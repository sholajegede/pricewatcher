import * as puppeteer from "puppeteer";
import { ProductData } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const THRESHOLD_PERCENTAGE = 40;

export enum Notification {
  WELCOME = "WELCOME",
  CHANGE_OF_STOCK = "CHANGE_OF_STOCK",
  LOWEST_PRICE = "LOWEST_PRICE",
  THRESHOLD_MET = "THRESHOLD_MET",
}

export interface PriceHistoryItem {
  price: number;
  date: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export async function extractPrice(
  page: puppeteer.Page,
  ...selectors: string[]
): Promise<string> {
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout: 3000 });
      const elementHandle = await page.$(selector);
      if (elementHandle) {
        const priceText = await page.evaluate(
          (el: Element) => el.textContent?.trim(),
          elementHandle
        );
        if (priceText) {
          const cleanPrice = priceText.replace(/[^\d.]/g, "");
          const firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
          return firstPrice || cleanPrice;
        }
      }
    } catch (error) {
      console.error(`Error processing selector ${selector}:`, error);
    }
  }
  return "";
}

export async function extractCurrency(
  page: puppeteer.Page,
  selector: string
): Promise<string> {
  try {
    return await page.$eval(
      selector,
      (el: Element) => el.textContent?.trim().slice(0, 1) || ""
    );
  } catch (error) {
    console.error(
      `Error extracting currency from selector ${selector}:`,
      error
    );
    return "";
  }
}

export async function extractPageForCategory(
  page: puppeteer.Page
): Promise<string> {
  const selectors = [".a-unordered-list .a-list-item", ".a-expander-content p"];

  for (const selector of selectors) {
    try {
      const elements = await page.$$eval(selector, (els: Element[]) =>
        els.map((el: Element) => el.textContent?.trim() || "").join("\n")
      );
      if (elements) return elements;
    } catch {
      continue;
    }
  }
  return "";
}

export async function extractRating(page: puppeteer.Page): Promise<number> {
  try {
    const rating = await page.$eval(
      "span.a-size-base.a-color-base",
      (span: Element) => span.textContent?.trim() || "0"
    );

    return parseFloat(rating);
  } catch (error) {
    console.error("Error extracting rating:", error);
    return 0;
  }
}

export async function extractReviewCount(page: puppeteer.Page): Promise<number> {
  try {
    const reviewCount = await page.$eval(
      "#acrCustomerReviewText",
      (span: Element) =>
        span.textContent
          ?.trim()
          .replace(/[^\d,]/g, "")
          .replace(/,/g, "")
    );

    return reviewCount ? parseInt(reviewCount, 10) : 0;
  } catch (error) {
    console.error("Error extracting review count:", error);
    return 0;
  }
}

export async function extractDescription(page: puppeteer.Page): Promise<string> {
  try {
    const aboutSection = await page.$$eval(
      "ul.a-unordered-list.a-vertical.a-spacing-small", // Target the specific unordered list
      (ulElements: Element[]) => {
        return ulElements
          .map((ul) =>
            Array.from(ul.querySelectorAll("li span.a-list-item"))
              .map((span) =>
                span.textContent
                  ?.trim()
                  .replace(/\s+/g, " ")
                  .replace(/\u200b/g, "")
                  || ""
              )
              .join("\n")
          )
          .join("\n");
      }
    );

    return aboutSection || "";
  } catch (error) {
    console.error("Error extracting product description:", error);
    return "";
  }
}

export function getHighestPrice(priceList: PriceHistoryItem[]): number {
  return Math.max(...priceList.map((p) => p.price));
}

export function getLowestPrice(priceList: PriceHistoryItem[]): number {
  return Math.min(...priceList.map((p) => p.price));
}

export function getAveragePrice(priceList: PriceHistoryItem[]): number {
  const sum = priceList.reduce((acc, curr) => acc + curr.price, 0);
  return sum / priceList.length || 0;
}

export function getEmailNotifType(
  scrapedProduct: ProductData,
  currentProduct: ProductData
): Notification | null {
  const lowestPrice = Math.min(...currentProduct.priceHistory);

  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET;
  }

  return null;
}

export const formatNumber = (num: number = 0): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}