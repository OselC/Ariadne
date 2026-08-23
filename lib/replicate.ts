import Replicate from "replicate";

export function getReplicate() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  return new Replicate({ auth: token });
}

// IDM-VTON model on Replicate (yisol/idm-vton)
// Inputs: human image, garment image, category, etc.
export type VTONInput = {
  humanImage: string; // base64 data URL or https URL
  garmentImage: string; // https URL
  category?: "upper_body" | "lower_body" | "dress";
  // optional garment description for better prompting
  garmentDescription?: string;
};

export async function runIDMVTON(input: VTONInput): Promise<string> {
  const replicate = getReplicate();
  if (!replicate) throw new Error("REPLICATE_API_TOKEN not configured");

  // Using yisol/idm-vton - update version hash as needed
  const output = (await replicate.run("yisol/idm-vton:77525d43a039cc42a1a937ece3b24c3d60bc3836e03d9fa78397f2ee367016d38", {
    input: {
      garm_img: input.garmentImage,
      human_img: input.humanImage,
      garment_des: input.garmentDescription ?? "a stylish garment, photorealistic fabric draping",
      category: input.category ?? "upper_body",
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    },
  })) as unknown;

  // Output is typically a URL string or array
  if (typeof output === "string") return output;
  if (Array.isArray(output) && typeof output[0] === "string") return output[0];
  return String(output);
}

export function mockVTONResult(garmentImage: string): string {
  // For demo without Replicate key, return garment image as placeholder
  // UI will overlay with indication it's a mock
  return garmentImage;
}
