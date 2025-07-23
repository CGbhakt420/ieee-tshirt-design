import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Canvas from "../canvas/index.jsx";
// for handling the customizer when comes with the /:designId
import { useParams } from "react-router-dom";
import state from "../store";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
  AIPicker,
} from "../components";
import LogoTransformControls from "../components/LogoTransformControls.jsx";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);

  const editorTabRef = useRef(null);

  const navigate = useNavigate();

  // getting the designId from url if exists
  const { designId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // if a saved design is opened ,fetch and set state
    if (designId) {
      axios
        .get(`/api/designs/${designId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const design = res.data;
          state.logoPosition=design.logoPosition;
          state.logoRotation=design.logoRotation;
          state.logoScale=design.logoScale;
          state.color = design.color;
          state.logoDecal = design.logoDecal;
          state.fullDecal = design.fullDecal;
          state.isLogoTexture = design.isLogoTexture;
          state.isFullTexture = design.isFullTexture;
        })
        .catch((err) => {
          alert("Failed to load design");
          console.error(err);
        });
    }

    // Ensure the customizer UI shows
    state.intro = false;
  }, [navigate, designId]);

  // Closes the tab if clicked out
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editorTabRef.current &&
        !editorTabRef.current.contains(event.target)
      ) {
        setActiveEditorTab("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // show tab content depending on the activeTab, or close it if clicked again
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return (
          <>
            <FilePicker file={file} setFile={setFile} readFile={readFile} />
            {/* <LogoTransformControls /> */}
          </>
        );
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleAISubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleAISubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      // Call Hugging Face API
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_HUGGING_FACE_API_KEY
            }`,
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const result = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        handleDecals(type, imageDataUrl);
        setGeneratingImg(false);
        setActiveEditorTab("");
      };

      reader.readAsDataURL(result);
    } catch (error) {
      alert(`Error generating image: ${error.message}`);
      setGeneratingImg(false);
    }
  };

  // Handles click on tab: opens tab or closes it if clicked again
  const handleTabClick = (tabName) => {
    setActiveEditorTab((prevTab) => (prevTab === tabName ? "" : tabName)); // Toggle tab
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  // handle save design
  const saveDesign = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save designs.");
      return;
    }
    // Get the canvas image
    const canvas = document.querySelector("canvas");
    // getting the full texture image url
    const fullDecal = state.fullDecal;
    // getting the logo image url
    const logoDecal = state.logoDecal;
    // converting the canvas image to url
    const designUrl = canvas.toDataURL();
    const color = state.color;
    const isLogoTexture = state.isLogoTexture;
    const isFullTexture = state.isFullTexture;
    const logoPosition = state.logoPosition;
    const logoRotation = state.logoRotation;
    const logoScale = state.logoScale;

    const payload = {
      color,
      designUrl,
      fullDecal,
      logoDecal,
      isLogoTexture,
      isFullTexture,
      logoPosition,
      logoRotation,
      logoScale,

    };

    console.log("Payload size:", designUrl.length / 1024, "KB");

    try {
      await axios.post("/api/designs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Design saved successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save design.");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D Canvas (background layer) */}
      <div className="absolute inset-0 z-0">
        <Canvas showBackground={true}/>
      </div>

      {/* UI Overlay (on top of canvas) */}
      <AnimatePresence>
        {!snap.intro && (
          <>
            {/* left menu tabs */}
            <motion.div
              key="custom"
              className="absolute top-0 left-0 z-10"
              {...slideAnimation("left")}
            >
              <div
                className="flex items-center min-h-screen"
                ref={editorTabRef}
              >
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab) => (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => handleTabClick(tab.name)}
                    />
                  ))}
                  {generateTabContent()}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute z-10 top-5 right-5 flex gap-4 w-[250px]"
              {...fadeAnimation}
            >
              <CustomButton
                type="filled"
                title="Save Design"
                handleClick={saveDesign}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
              <CustomButton
                type="filled"
                title="Go Back"
                handleClick={() => navigate("/")}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>

            {/* filter tabs */}
            <motion.div
              className="filtertabs-container z-10"
              {...slideAnimation("up")}
            >
              {FilterTabs.map((tab) => (
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              ))}

              <button className="download-btn" onClick={downloadCanvasToImage}>
                <img
                  src={download}
                  alt="Download Image"
                  className="w-3/5 h-3/5 object-contain"
                />
              </button>
              {/* <CustomButton
              type="filled"
              title="Save Design"
              handleClick={saveDesign}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            /> */}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed top-1/3 right-6 z-20 bg-white/30 rounded-xl shadow-lg p-4 w-72">
        <h3 className="font-bold text-gray-700 mb-2 text-lg">Logo Position</h3>
        <LogoTransformControls />
      </div>
    </div>
  );
};

export default Customizer;
