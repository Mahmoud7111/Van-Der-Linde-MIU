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

import watchModel from '@/assets/3D Models/watch.glb'

/**
 * Watch3DModel
 * Main component that wraps the 3D model viewer
 */
export default function Watch3DModel({ caseOption, dialOption, strapOption }) {
    return (
    <model-viewer
        src={watchModel}
        auto-rotate
        auto-rotate-delay="0"
        camera-controls
        camera-orbit="245deg 40deg 2.5m"
        shadow-intensity="1"
        exposure="0.85"
        style={{
            width: '100%',
            height: '100%',
            background: 'transparent'
        }}
        title={`Watch: ${caseOption.label} case, ${dialOption.label} dial, ${strapOption.label} strap`}
    />
    )
}
