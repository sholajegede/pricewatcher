"use server";

import puppeteer from "puppeteer";
import {
  extractCurrency,
  extractDescription,
  extractPageForCategory,
  extractPrice,
  extractReviewCount,
  extractRating,
  extractFirstPercentage,
} from "../utils";
import { ProductData } from "@/types";

export async function scrapeAmazonProduct(
  url: string
): Promise<ProductData | null> {
  if (!url) {
    console.error("URL is missing.");
    return null;
  }

  let browser;
  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: process.env.BRIGHT_DATA_BROWSER_WS as string,
    });

    console.log("Connected to Scraping Browser...");
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log("Navigated to product page");

    // Wait for product title
    await page.waitForSelector("#productTitle", { timeout: 30000 }).catch(() => {
      throw new Error("Product title not found on page.");
    });

    const title = await page
      .$eval("#productTitle", (el) => el.textContent?.trim() || "")
      .catch(() => "Unknown Product");

    const currentPrice = parseFloat(
      (await extractPrice(
        page,
        ".priceToPay span.a-price-whole",
        ".a.size.base.a-color-price",
        ".a-button-selected .a-color-base"
      )) || "0"
    );

    // Gracefully handle the priceblock error and fallback to currentPrice
    let originalPrice = currentPrice; // Default to currentPrice
    try {
      originalPrice = parseFloat(
        (await extractPrice(
          page,
          ".a-price.a-text-price span.a-offscreen",
          "#listPrice",
          "#priceblock_dealprice",
          ".a-size-base.a-color-price"
        )) || `${currentPrice}`
      );
    } catch (error) {
      // No need to log the error, just silently fallback to currentPrice
    }

    const outOfStock = await page
      .$eval("#availability span", (el) => el.textContent?.trim().toLowerCase())
      .catch(() => "in stock") === "currently unavailable";

    const imagesJson = await page
      .evaluate(() => {
        const imgElement =
          document.querySelector("#imgBlkFront") ||
          document.querySelector("#landingImage");
        return imgElement?.getAttribute("data-a-dynamic-image");
      })
      .catch(() => "{}");

    const imageUrls = Object.keys(JSON.parse(imagesJson || "{}"));

    const currency = await extractCurrency(page, ".a-price-symbol").catch(
      () => "$"
    );

    const discountRate = parseFloat(
      await page
        .$eval(".savingsPercentage", (el) =>
          el.textContent?.replace(/[-%]/g, "").trim() || "0"
        )
        .catch(() => "0")
    );

    const description = await extractDescription(page).catch(() => "");

    const reviews = await extractReviewCount(page).catch(() => 0);

    const rating = await extractRating(page).catch(() => 0);

    const recommended = await extractFirstPercentage(page).catch(() => 0);

    const pageDetails = await extractPageForCategory(page).catch(() => "");

    const category = extractCategory(pageDetails);

    const data: ProductData = {
      url,
      currency,
      image: imageUrls[0] || "",
      title,
      currentPrice,
      originalPrice,
      priceHistory: [],
      discountRate,
      category,
      reviewsCount: reviews || 0,
      stars: rating || 0,
      recommendedBy: recommended || 0,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: currentPrice,
      highestPrice: originalPrice,
      averagePrice: currentPrice,
    };

    console.log("Data extracted:", data);

    return data;
  } catch (error: any) {
    console.error("Error scraping Amazon product:", error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close().catch(() => console.error("Failed to close browser."));
    }
  }
}

// Updated `extractCategory` function
function extractCategory(description: string): string {
  const firstLine = description?.split("\n")[0]?.trim();
  return firstLine || "Other";
}