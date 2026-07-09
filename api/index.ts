export default async (req: any, res: any) => {
  try {
    let serverModule: any;
    try {
      // 1. Try to load the pre-compiled, optimized production bundle first
      const bundlePath = "../dist/server.cjs";
      serverModule = await import(bundlePath);
    } catch (bundleErr: any) {
      console.warn("Could not load pre-compiled bundle, falling back to TS source:", bundleErr?.message || String(bundleErr));
      // 2. Fall back to compiling/loading the TS source directly if bundle is missing
      const sourcePath = "../server";
      serverModule = await import(sourcePath);
    }

    const app = await serverModule.appPromise;
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel Serverless Function Critical Error:", err);
    res.status(500).json({
      error: "Vercel Serverless Function Error during import or run",
      message: err?.message || String(err),
      stack: err?.stack || ""
    });
  }
};
