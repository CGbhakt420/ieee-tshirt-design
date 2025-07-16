import state from "../store";
import { useSnapshot } from "valtio";
import { MdFlip, MdFlipCameraAndroid } from "react-icons/md";

const LogoTransformControls = () => {
  const snap = useSnapshot(state);
  const handlePointerDown = () => {
    state.isUIInteracting = true;
  };
  const handlePointerUp = () => {
    state.isUIInteracting = false;
  };

  return (
    <div
      className="flex flex-col gap-2 p-2"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <label>
        X:
        <input
          type="range"
          min={-0.2}
          max={0.2}
          step={0.01}
          value={snap.logoPosition[0]}
          onChange={(e) =>
            (state.logoPosition = [
              parseFloat(e.target.value),
              snap.logoPosition[1],
              snap.logoPosition[2],
            ])
          }
        />
      </label>
      <label>
        Y:
        <input
          type="range"
          min={-0.1}
          max={0.2}
          step={0.01}
          value={snap.logoPosition[1]}
          onChange={(e) =>
            (state.logoPosition = [
              snap.logoPosition[0],
              parseFloat(e.target.value),
              snap.logoPosition[2],
            ])
          }
        />
      </label>
      <label>
        Z:
        <input
          type="range"
          min={-0.15}
          max={0.25}
          step={0.01}
          value={snap.logoPosition[2]}
          onChange={(e) =>
            (state.logoPosition = [
              snap.logoPosition[0],
              snap.logoPosition[1],
              parseFloat(e.target.value),
            ])
          }
        />
      </label>
      <label>
        Scale:
        <input
          type="range"
          min={0.05}
          max={0.3}
          step={0.01}
          value={snap.logoScale}
          onChange={(e) => (state.logoScale = parseFloat(e.target.value))}
        />
      </label>
      <label>
        Spin:
        <input
          type="range"
          min={-Math.PI}
          max={Math.PI}
          step={0.01}
          value={snap.logoRotation[2]}
          onChange={(e) =>
            (state.logoRotation = [
              snap.logoRotation[0],
              
              snap.logoRotation[1],
              parseFloat(e.target.value),
            ])
          }
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="font-medium">Flip:</span>
        <button
          type="button"
          className={`p-2 rounded-full border transition ${
            snap.logoRotation[2] === Math.PI
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
          title="Flip Horizontally"
          onClick={() =>
            (state.logoRotation = [
              snap.logoRotation[0],
              snap.logoRotation[1],
              snap.logoRotation[2] === Math.PI ? 0 : Math.PI,
            ])
          }
        >
          <MdFlip size={20} />
        </button>
        <button
          type="button"
          className={`p-2 rounded-full border transition ${
            snap.logoRotation[0] === Math.PI
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
          title="Flip Vertically"
          onClick={() =>
            (state.logoRotation = [
              snap.logoRotation[0] === Math.PI ? 0 : Math.PI,
              snap.logoRotation[1],
              snap.logoRotation[2],
            ])
          }
        >
          <MdFlipCameraAndroid size={20} />
        </button>
      </label>
      
    </div>
  );
};

export default LogoTransformControls;
