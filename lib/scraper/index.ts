"use server";

import puppeteer from "puppeteer";
import {
  extractCurrency,
  extractDescription,
  extractPageForCategory,
  extractPrice,
} from "../utils";
import { ProductData } from "@/types";

export async function scrapeAmazonProduct(
  url: string
): Promise<ProductData | null> {
  if (!url) return null;

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint:
        process.env.BRIGHT_DATA_BROWSER_WS as string,
    });

    console.log("Connected to Scraping Browser...");
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    console.log("Navigated to product page");

    await page.waitForSelector("#productTitle", { timeout: 30000 });

    const title: string = await page.$eval(
      "#productTitle",
      (el) => el.textContent?.trim() || ""
    );

    const currentPrice = parseFloat(
      (await extractPrice(
        page,
        ".priceToPay span.a-price-whole",
        ".a.size.base.a-color-price",
        ".a-button-selected .a-color-base"
      )) || "0"
    );

    const originalPrice = parseFloat(
      (await extractPrice(
        page,
        "#priceblock_ourprice",
        ".a-price.a-text-price span.a-offscreen",
        "#listPrice",
        "#priceblock_dealprice",
        ".a-size-base.a-color-price"
      )) || `${currentPrice}`
    );

    const outOfStock: boolean =
      (await page.$eval("#availability span", (el) =>
        el.textContent?.trim().toLowerCase()
      )) === "currently unavailable";

    const imagesJson =
      (await page.evaluate(() => {
        const imgElement =
          document.querySelector("#imgBlkFront") ||
          document.querySelector("#landingImage");
        return imgElement?.getAttribute("data-a-dynamic-image");
      })) || "{}";

    const imageUrls: string[] = Object.keys(JSON.parse(imagesJson));

    const currency: string = await extractCurrency(page, ".a-price-symbol");

    const discountRate: number = parseFloat(
      await page
        .$eval(".savingsPercentage", (el) => 
          el.textContent?.replace(/[-%]/g, "").trim() || "0"
        )
        .catch(() => "0")
    );

    const description: string = await extractDescription(page);

    const pageDetails: string = await extractPageForCategory(page);

    const category = extractCategory(pageDetails);

    const data: ProductData = {
      url,
      currency: currency || "$",
      image: imageUrls[0] || "",
      title,
      currentPrice,
      originalPrice,
      priceHistory: [],
      discountRate,
      category,
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description: description,
      lowestPrice: currentPrice,
      highestPrice: originalPrice,
      averagePrice: currentPrice,
    };

    console.log("Data extracted:", data);

    await browser.close();

    return data;
  } catch (error: any) {
    console.error("Error scraping Amazon product:", error.message);
    return null;
  }
};

function extractCategory(description: string): string {
  const firstLine = description.split("\n")[0]?.trim();

  if (firstLine) {
    return firstLine;
  }

  return "Other";
};