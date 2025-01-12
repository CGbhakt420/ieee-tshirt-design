import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';

import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
  const snap = useSnapshot(state);
  


  const [file, setFile] = useState(''); // to upload file
  const [prompt, setPrompt] = useState(''); // ai prompt
  const [generatingImg, setGeneratingImg] = useState(false); // to show loading state

  const [activeEditorTab, setActiveEditorTab] = useState(""); // show which tab is currently being used
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true, // will show logo
    stylishShirt: false,
  });

  // Show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />;
      default:
        return null;
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  
  
//   const handleSubmit = async (type) => {
//   const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;
//   const modelId = 'CompVis/stable-diffusion-v1-4'; // Example model
  
//   const userPrompt = prompt; // Use the dynamically set prompt
  
//   if (!apiKey) {
//     console.error("API Key is missing");
//     return;
//   }
  
//   try {
//     const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ inputs: userPrompt }),
//     });
    
//     const contentType = response.headers.get('Content-Type');
    
//     // If response is JSON, parse the JSON first
//     if (contentType && contentType.includes('application/json')) {
//       const data = await response.json(); // Parse the JSON
//       console.log('API Response (JSON):', data);
//     }
//     // If response is an image, handle the blob
//     else if (contentType && contentType.includes('image')) {
//       const rawResponse = await response.blob(); // Get the response as a Blob
//       const imageUrl = URL.createObjectURL(rawResponse); // Create an object URL for the image
//       console.log('Image URL:', imageUrl);

//       // Set the image URL in state based on the decal type
//       if (type === 'logo') {
//         state.logoDecal = imageUrl; // Apply logo texture
//         state.isLogoTexture = true; // Enable logo texture
//       } else if (type === 'full') {
//         state.fullDecal = imageUrl; // Apply full texture
//         state.isFullTexture = true; // Enable full texture
//       }
//     } else {
//       console.error('Unexpected response type:', contentType);
//     }
//   } catch (error) {
//     console.error('Error during request:', error); // Handle errors
//   }
// };


const handleSubmit = async (type) => {
  const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  const modelId = 'CompVis/stable-diffusion-v1-4'; // AI model ID

  const userPrompt = prompt; // Use the dynamically set prompt

  if (!apiKey) {
    console.error("API Key is missing");
    return;
  }

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: userPrompt }),
    });

    const contentType = response.headers.get('Content-Type');

    // If response is JSON, parse the JSON first
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json(); // Parse the JSON
      console.log('API Response (JSON):', data);
    }
    // If response is an image, handle the blob
    else if (contentType && contentType.includes('image')) {
      const rawResponse = await response.blob(); // Get the response as a Blob
      const imageUrl = URL.createObjectURL(rawResponse); // Create an object URL for the image
      console.log('Image URL:', imageUrl);

      // Set the image URL in state based on the decal type
      if (type === 'logo') {
        state.logoDecal = imageUrl; // Apply logo texture
        state.isLogoTexture = true; // Enable logo texture
      } else if (type === 'full') {
        state.fullDecal = imageUrl; // Apply full texture
        state.isFullTexture = true; // Enable full texture
      }
    } else {
      console.error('Unexpected response type:', contentType);
    }
  } catch (error) {
    console.error('Error during request:', error); // Handle errors
  }
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

    // After setting the state, activeFilterTab is updated
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div className="filtertabs-container" {...slideAnimation("up")}>
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
