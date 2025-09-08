"use server";

import { mintclub } from "mint.club-v2-sdk";

const FILEBASE_API_KEY = process.env.FILEBASE_API_KEY;

if (!FILEBASE_API_KEY) {
  console.warn("FILEBASE_API_KEY not found in environment variables");
}

export async function uploadImage(formData: FormData) {
  const body = Object.fromEntries(formData.entries());
  const { file } = body;
  if (!file) {
    throw new Error("image is required");
  }
  if (!FILEBASE_API_KEY) {
    throw new Error("FILEBASE_API_KEY is required in environment variables");
  }

  const hash = await mintclub.ipfs.upload({
    filebaseApiKey: FILEBASE_API_KEY,
    media: file as Blob,
  });
  return hash;
}

export async function uploadMetadata(formData: FormData) {
  const body = Object.fromEntries(formData.entries());
  const { image, name } = body;
  if (!image || !name) {
    throw new Error("image and name are required");
  }
  if (!FILEBASE_API_KEY) {
    throw new Error("FILEBASE_API_KEY is required in environment variables");
  }

  const hash = await mintclub.ipfs.uploadMetadata({
    filebaseApiKey: FILEBASE_API_KEY,
    image: image as `ipfs://${string}`,
    name: name as string,
  });
  return hash;
}
