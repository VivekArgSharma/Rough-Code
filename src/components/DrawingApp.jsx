// src/DrawingApp.jsx
import { useEffect, useRef, useState } from "react";
import PadTitle from "./PadTitle";

export default function DrawingApp() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [tool, setTool] = useState("pencil"); // 'pencil' | 'eraser'
  const [lineWidth, setLineWidth] = useState(4);
  const [color, setColor] = useState("#39FF14"); // neon green 🎨

  // Helper: set up canvas for high-DPI displays and handle resizing
  const resizeCanvas = (preserve = true) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    let dataURL = null;
    if (preserve && ctxRef.current) {
      dataURL = canvas.toDataURL();
    }

    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(200, Math.floor((rect.height - 8) * dpr));
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // restore
    if (dataURL) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.restore();
      };
      img.src = dataURL;
    }
  };

  useEffect(() => {
    resizeCanvas(false);
    const handleResize = () => resizeCanvas(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update lineWidth + color
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = lineWidth;
      ctxRef.current.strokeStyle = color;
    }
  }, [lineWidth, color]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
    return { x, y };
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    canvas.setPointerCapture?.(e.pointerId ?? 1);
    isDrawingRef.current = true;
    lastPosRef.current = getPos(e);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const { x, y } = getPos(e);
    const { x: lx, y: ly } = lastPosRef.current;

    ctx.save();
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();

    lastPosRef.current = { x, y };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset for full clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const ToolButton = ({ active, onClick, children, title }) => (
    <button
      title={title}
      onClick={onClick}
      className={
        `px-3 py-2 rounded-2xl border text-sm shadow-sm transition ` +
        (active
          ? "bg-black text-white border-black"
          : "bg-white border-gray-300 hover:bg-gray-100")
      }
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <PadTitle />
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-3">
          <ToolButton
            title="Pencil"
            active={tool === "pencil"}
            onClick={() => setTool("pencil")}
          >
            ✏️ Pencil
          </ToolButton>
          <ToolButton
            title="Eraser"
            active={tool === "eraser"}
            onClick={() => setTool("eraser")}
          >
            🧽 Eraser
          </ToolButton>
          <ToolButton title="Clear" active={false} onClick={clearCanvas}>
            🧹 Clear
          </ToolButton>

          <div className="ml-auto flex items-center gap-2">
            <label className="text-sm text-gray-600">Size</label>
            <input
              type="range"
              min={1}
              max={40}
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
              className="accent-black"
            />
            <span className="text-sm w-8 text-right">{lineWidth}</span>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <label className="text-sm text-gray-600">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-8 border rounded cursor-pointer"
            />
          </div>
        </div>

        <div
          className="bg-white border border-gray-200 rounded-2xl shadow overflow-hidden"
          style={{ height: 800 }} // reduced pad size
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerOut={handlePointerUp}
            onPointerMove={handlePointerMove}
          />
        </div>
      </div>
    </div>
  );
}
