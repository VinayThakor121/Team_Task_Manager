import Vapi from "@vapi-ai/web";

let instance;

export const getVapi = () => {
  if (!instance) {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "";
    if (!token) {
      console.warn("NEXT_PUBLIC_VAPI_WEB_TOKEN is not configured. Voice interviews may fail.");
    }
    instance = new Vapi(token);
  }
  return instance;
};
