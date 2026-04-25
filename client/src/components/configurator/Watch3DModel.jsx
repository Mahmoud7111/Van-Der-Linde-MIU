/**
 * Watch3DModel
 *
 * What this file is:
 * A 3D watch model viewer using the Google model-viewer web component.
 * Loads the watch.glb model and applies styling based on user selections.
 *
 * What it does:
 * - Renders a 3D GLB model of the watch using the model-viewer web component
 * - Auto-rotates and provides interactive orbit controls
 * - Supports camera configuration for proper framing
 *
 * Where it is used:
 * Integrated into ConfiguratorPage as a replacement for the 2D SVG illustration.
 */

import React, { useEffect, useRef } from 'react'

// Helper to convert hex like '#C9A84C' to [r, g, b, a] format expected by model-viewer
const hexToRgba = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
        1.0
    ] : [1, 1, 1, 1];
};

/**
 * Watch3DModel
 * Main component that wraps the 3D model viewer and applies materials based on selections
 */
export default function Watch3DModel({ selectedModel, caseOption, bezelOption, dialOption, strapOption }) {
    const viewerRef = useRef(null);
    const originalMaterials = useRef({});

    useEffect(() => {
        // Clear original materials cache when model changes
        originalMaterials.current = {};
    }, [selectedModel.id]);

    useEffect(() => {
        const updateMaterials = () => {
            const viewer = viewerRef.current;
            if (!viewer || !viewer.model || !viewer.model.materials) return;

            const materials = viewer.model.materials;
            
            materials.forEach(material => {
                const name = material.name.toLowerCase();
                
                if (material.pbrMetallicRoughness) {
                    // Backup original material properties if not already saved for this model
                    if (!originalMaterials.current[name]) {
                        originalMaterials.current[name] = {
                            baseColorFactor: material.pbrMetallicRoughness.baseColorFactor.slice(),
                            metallicFactor: material.pbrMetallicRoughness.metallicFactor,
                            roughnessFactor: material.pbrMetallicRoughness.roughnessFactor
                        };
                    }

                    const original = originalMaterials.current[name];

                    // Update Strap Material FIRST to prevent 'metal.001' from being caught by 'metal' case fallback
                    if (name.includes('strap') || name.includes('metal.001') || name.includes('strap_mork')) {
                        if (strapOption.color === 'original') {
                            material.pbrMetallicRoughness.setBaseColorFactor(original.baseColorFactor);
                            material.pbrMetallicRoughness.setMetallicFactor(original.metallicFactor);
                            material.pbrMetallicRoughness.setRoughnessFactor(original.roughnessFactor);
                        } else {
                            material.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(strapOption.color));
                            
                            if (strapOption.id.includes('leather') || strapOption.id.includes('nato')) {
                                material.pbrMetallicRoughness.setMetallicFactor(0.0);
                                material.pbrMetallicRoughness.setRoughnessFactor(0.8);
                            } else {
                                material.pbrMetallicRoughness.setMetallicFactor(0.9);
                                material.pbrMetallicRoughness.setRoughnessFactor(0.2);
                            }
                        }
                    } 
                    // Update Bezel Material
                    else if (name.includes('bezel') || name.includes('urtavla_primaropaquetext')) {
                        if (bezelOption.color === 'original') {
                            material.pbrMetallicRoughness.setBaseColorFactor(original.baseColorFactor);
                            material.pbrMetallicRoughness.setMetallicFactor(original.metallicFactor);
                            material.pbrMetallicRoughness.setRoughnessFactor(original.roughnessFactor);
                        } else {
                            material.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(bezelOption.color));
                            material.pbrMetallicRoughness.setMetallicFactor(0.9);
                            material.pbrMetallicRoughness.setRoughnessFactor(0.2);
                            
                            if (bezelOption.label.includes('Ceramic')) {
                                material.pbrMetallicRoughness.setMetallicFactor(0.1);
                                material.pbrMetallicRoughness.setRoughnessFactor(0.05);
                            }
                        }
                    }
                    // Update Dial Material
                    else if (name.includes('dial') || name.includes('face') || name.includes('blue') || name.includes('urtavla')) {
                        if (dialOption.color === 'original') {
                            material.pbrMetallicRoughness.setBaseColorFactor(original.baseColorFactor);
                            material.pbrMetallicRoughness.setMetallicFactor(original.metallicFactor);
                            material.pbrMetallicRoughness.setRoughnessFactor(original.roughnessFactor);
                        } else {
                            material.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(dialOption.color));
                            material.pbrMetallicRoughness.setMetallicFactor(0.0);
                            material.pbrMetallicRoughness.setRoughnessFactor(0.4);
                        }
                    } 
                    // Update Case Material
                    else if (name.includes('case') || name.includes('screws') || name.includes('silver') || name.includes('brushed aluminum') || name.includes('back plate') || name.includes('metal') || name.includes('scene_-_root')) {
                        if (caseOption.color === 'original') {
                            material.pbrMetallicRoughness.setBaseColorFactor(original.baseColorFactor);
                            material.pbrMetallicRoughness.setMetallicFactor(original.metallicFactor);
                            material.pbrMetallicRoughness.setRoughnessFactor(original.roughnessFactor);
                        } else {
                            material.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(caseOption.color));
                            material.pbrMetallicRoughness.setMetallicFactor(0.9);
                            material.pbrMetallicRoughness.setRoughnessFactor(0.2);
                        }
                    } 
                    // Make sure glass is transparent and shiny
                    else if (name.includes('glass')) {
                        material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 0.3]);
                        material.pbrMetallicRoughness.setMetallicFactor(0.0);
                        material.pbrMetallicRoughness.setRoughnessFactor(0.1);
                        material.alphaMode = "BLEND";
                    }
                }
            });
        };

        const viewer = viewerRef.current;
        if (viewer) {
            viewer.addEventListener('load', updateMaterials);
            
            // If the model is already loaded (e.g. on prop updates), update immediately
            if (viewer.model && viewer.model.materials) {
                updateMaterials();
            }
        }

        return () => {
            if (viewer) {
                viewer.removeEventListener('load', updateMaterials);
            }
        };
    }, [selectedModel, caseOption, bezelOption, dialOption, strapOption]);

    return (
        <model-viewer
            ref={viewerRef}
            src={selectedModel.path}
            auto-rotate="true"
            auto-rotate-delay="0"
            camera-controls="true"
            camera-orbit={selectedModel.cameraOrbit || "245deg 40deg auto"}
            shadow-intensity="1"
            exposure="0.85"
            style={{
                width: '100%',
                height: '100%',
                background: 'transparent'
            }}
            title={`Watch: ${caseOption.label} case, ${bezelOption.label} bezel, ${dialOption.label} dial, ${strapOption.label} strap`}
        />
    )
}
