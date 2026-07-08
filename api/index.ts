export default async (req: any, res: any) => {
  try {
    const { appPromise } = await import("../server");
    const app = await appPromise;
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel Serverless Function Error:", err);
    res.status(500).json({
      error: "Vercel Serverless Function Error during import or run",
      message: err.message,
      stack: err.stack
    });
  }
};
