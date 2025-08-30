import api from "@/lib/axios";

export interface UploadResponse {
  success: boolean;
  url?: string;
  filePath?: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export const uploadFile = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
  } = options;

  try {
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(
          ", "
        )}`,
      };
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return {
        success: false,
        error: `File size too large. Maximum size: ${maxSizeMB}MB`,
      };
    }
    const formData = new FormData();
    formData.append("image", file);

    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Upload file
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", response.data);

    const imageUrl = response.data?.imageUrl;

    if (!imageUrl) {
      throw new Error("No imageUrl in response");
    }

    return {
      success: true,
      url: imageUrl,
    };
  } catch (error: any) {
    console.error("Upload failed:", error);
    console.error("Upload error response:", error.response?.data);
    console.error("Upload error status:", error.response?.status);

    let errorMessage = "Upload failed";

    if (error.response?.status === 500) {
      errorMessage = "Server error during upload";
    } else if (error.response?.status === 413) {
      errorMessage = "File too large";
    } else if (error.response?.status === 415) {
      errorMessage = "Unsupported file type";
    } else if (error.response?.status === 401) {
      errorMessage = "Unauthorized - Please login again";
    } else if (error.response?.status === 403) {
      errorMessage = "Forbidden - Admin access required";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const compressImage = (
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
