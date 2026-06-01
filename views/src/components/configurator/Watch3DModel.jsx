/**
 * Watch3DModel Component
 * 
 * CORE FUNCTIONALITY:
 * This component acts as an interactive 3D wrapper for the watch configurator.
 * It uses the Google <model-viewer> web component to render GLB files and
 * provides a custom API to modify materials (colors, textures) in real-time.
 * 
 * 3D MATERIAL ENGINE:
 * - Traverses the model's material tree on every selection change.
 * - Matches material names (e.g., "strap", "bezel") to apply custom hex colors.
 * - Supports a "Material Backup" system to restore original textures when 'Original' is selected.
 * 
 * AR (AUGMENTED REALITY) SYSTEM:
 * - Detects device type (Mobile vs Desktop).
 * - Mobile: Triggers native AR (Quick Look for iOS, Scene Viewer for Android).
 * - Desktop: Opens a Portal-based Modal with a QR Code for mobile handoff.
 */

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
                    // --- THE MATERIAL BACKUP SYSTEM ---
                    // Since model-viewer modifies the GLB in memory, we must save the
                    // original textures/colors on the first load. This allows the 
                    // 'Original' color swatch to perfectly restore the designer's intent.
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

    const [showQrModal, setShowQrModal] = useState(false);

    // Detect if the user is on a mobile device or using a mobile inspector
    const isMobileDevice = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);

        // Browser inspectors (like Chrome) don't always spoof the UA correctly, 
        // so we also check screen width and touch capability.
        const isSmallScreen = window.innerWidth <= 768;
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        return isMobileUA || (isSmallScreen && isTouch) || (window.innerWidth <= 600);
    };

    /**
     * handleArClick
     * Manages the "View in AR" experience across different devices.
     */
    const handleArClick = () => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        // On real mobile devices, we call the native AR engine directly.
        // On desktops, we show the QR code so the user can scan and switch to mobile.
        if (isMobileDevice()) {
            viewer.activateAR();
        } else {
            setShowQrModal(true);
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <model-viewer
                ref={viewerRef}
                src={selectedModel.path}
                auto-rotate="true"
                auto-rotate-delay="0"
                camera-controls="true"
                // camera-orbit: specific to each model to ensure the watch is framed perfectly
                camera-orbit={selectedModel.cameraOrbit || "245deg 40deg auto"}
                shadow-intensity="1"
                exposure="0.85" // High exposure for luxury lighting
                ar // Enables AR capabilities
                ar-modes="webxr scene-viewer quick-look" // Order of preference for AR tech
                ar-scale="auto" // Prevents the watch from appearing as a 2-meter giant
                ar-placement="floor" // Looks for flat surfaces (tables/floors)
                interaction-prompt="auto" // Shows a tutorial hand if the user is lost
                min-camera-orbit="auto auto auto" // Unlocks vertical rotation limits
                max-camera-orbit="auto auto auto" // Unlocks vertical rotation limits
                touch-action="pan-y"
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'transparent'
                }}
                title={`Watch: ${caseOption.label} case, ${bezelOption.label} bezel, ${dialOption.label} dial, ${strapOption.label} strap`}
            >
            </model-viewer>

            {/* Premium AR Button (Now only visible on desktop to trigger the QR code) */}
            {!isMobileDevice() && (
                <button 
                    className="cfg-ar-button"
                    onClick={handleArClick}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2" /> {/* Draws the top-left corner of a square */}
                        <path d="M17 3h2a2 2 0 0 1 2 2v2" /> {/* Draws the top-right corner of a square */}
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2" /> {/* Draws the bottom-right corner of a square */}
                        <path d="M7 21H5a2 2 0 0 1-2-2v-2" /> {/* Draws the bottom-left corner of a square */}
                        <circle cx="12" cy="12" r="3" /> {/* Draws a circle in the center */}
                        <path d="M12 7v2" /> {/* Draws a vertical line from the center upwards */}
                        <path d="M12 15v2" /> {/* Draws a vertical line from the center downwards */}
                        <path d="M17 12h-2" /> {/* Draws a horizontal line from the center to the right */}
                        <path d="M9 12H7" /> {/* Draws a horizontal line from the center to the left */}
                    </svg>
                    View in AR
                </button>
            )}

            {/* QR Code Modal for Desktop - Rendered via Portal to be on top of everything */}
            {showQrModal && createPortal(
                <div className="cfg-qr-overlay" onClick={() => setShowQrModal(false)}>
                    <div className="cfg-qr-modal" onClick={e => e.stopPropagation()}>
                        <button className="cfg-qr-close" onClick={() => setShowQrModal(false)}>&times;</button>
                        <h3 className="cfg-qr-title">Try it in your room</h3>
                        <p className="cfg-qr-desc">Scan this code with your phone camera to view this watch in Augmented Reality.</p>
                        <div className="cfg-qr-code-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                                        ? 'https://van-der-linde1.vercel.app/configurator'
                                        : window.location.href
                                )}`}
                                alt="QR Code"
                                className="cfg-qr-code"
                            />
                        </div>
                        <div className="cfg-qr-footer">
                            <span>Supported on iOS & Android</span>
                            <p className="cfg-qr-browser-note">For best results, use Safari (iOS) or Chrome (Android)</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}
