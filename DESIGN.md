---
name: Beacon
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#20201f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c9ac'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9378'
  outline-variant: '#454932'
  surface-tint: '#b4d400'
  primary: '#ffffff'
  on-primary: '#2b3400'
  primary-container: '#cdf200'
  on-primary-container: '#5a6b00'
  inverse-primary: '#556500'
  secondary: '#c6c6c6'
  on-secondary: '#303030'
  secondary-container: '#474747'
  on-secondary-container: '#b5b5b5'
  tertiary: '#ffffff'
  on-tertiary: '#1c333d'
  tertiary-container: '#cee6f2'
  on-tertiary-container: '#516872'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cdf200'
  primary-fixed-dim: '#b4d400'
  on-primary-fixed: '#181e00'
  on-primary-fixed-variant: '#3f4c00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#cee6f2'
  tertiary-fixed-dim: '#b2cad6'
  on-tertiary-fixed: '#051e27'
  on-tertiary-fixed-variant: '#334a54'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 80px
    fontWeight: '700'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
  button:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
---

## Brand & Style

The design system embodies a "Technological Noir" aesthetic, merging extreme minimalism with high-precision instrumentation. It is designed for elite technical environments where clarity and focus are paramount. The brand personality is authoritative, surgical, and cinematic.

The visual style is a fusion of **Minimalism** and **High-Contrast/Bold**. By stripping away all non-essential decorative elements and relying on a binary palette of pure black and vibrant lime, the interface recedes to allow content and data to command the stage. The emotional response should be one of "controlled power"—quiet, yet intensely energetic through its accents. 

Visual interest is generated not through imagery or iconography, but through "Waving Tech Lines"—generative, organic-mathematical patterns that pulse with a slow, cinematic rhythm in the background or within large-scale containers. These lines represent data in motion and provide a sense of life to the otherwise austere environment.

## Colors

The palette is strictly functional and high-contrast.

- **Primary (#D9FF00):** A vibrant Lime Green used exclusively for interactive elements, precision highlights, and status indicators. It represents "The Beacon" in the darkness.
- **Background (#000000):** A pure black base across all surfaces to maximize OLED efficiency and visual depth.
- **Surface (#1A1A1A):** A deep charcoal used only when subtle differentiation of containers is required.
- **Typography:** Primary text is pure white (#FFFFFF). Secondary or deactivated text is a muted grey (#666666).

There are no intermediate neutrals or soft shadows. If an element is not primary or background, it should be invisible.

## Typography

This design system utilizes **Geist** for its mathematical precision and technical neutrality. 

- **Scale:** Large-scale display type is used for navigation and hero sections to create a cinematic impact.
- **Contrast:** High weight contrast between bold headlines and regular body text is essential.
- **Labels:** Use the `label-mono` style for all metadata and utility text. 
- **Character:** All headings and buttons should lean toward tighter letter-spacing to emphasize the "engineered" feel of the typeface. No icons are permitted; use text labels and typographic hierarchy to communicate intent.

## Layout & Spacing

The layout philosophy is a **Fixed Grid** with generous, intentional whitespace to create a gallery-like focus on the content.

- **Grid:** A 12-column grid on desktop with wide 32px gutters. 
- **Padding:** Use extreme vertical padding (120px+) between sections to allow the black background to "breathe."
- **Alignment:** Elements should be strictly aligned to the grid. Avoid centering; prefer strong left-alignment or justified layouts to maintain a structured, technical appearance.
- **Mobile:** Transition to a 4-column grid with reduced margins (24px) but maintain the signature high-contrast typographic scale.

## Elevation & Depth

This system rejects shadows and soft gradients. Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surfaces:** The primary level is pure black. Secondary containers use a subtle #1A1A1A fill with no border.
- **Active States:** Active or focused states are indicated by a 1px solid border of #D9FF00. 
- **Motion Depth:** Cinematic depth is achieved through the "Waving Tech Lines" motif. These lines should exist on a separate Z-axis behind content, moving at a different scroll speed (parallax) to create a sense of three-dimensional space without using shadows.

## Shapes

The shape language is **Sharp (0)**. 

To maintain the architectural and technical narrative, all corners are strictly 90 degrees. This applies to buttons, input fields, cards, and modal windows. The lack of roundedness reinforces the precision and "unyielding" nature of the design system.

## Components

Components are designed as "instruments" rather than "widgets."

- **Buttons:** Solid #D9FF00 background with black text. No icons. Text is uppercase. Hover states should invert colors (Black background, Lime border/text).
- **Inputs:** A simple bottom border of 1px (White). On focus, the border changes to 2px #D9FF00. 
- **Cards:** No background fill by default. Content is separated by 1px grey (#333) horizontal lines.
- **Active States/Chips:** Represented by a small "Beacon" rectangle (4px x 4px) in Lime Green next to the text label.
- **Waving Motif:** Use for loading states or background ornamentation. The lines should be ultra-thin (0.5pt to 1pt) in Lime Green or muted White.
- **Navigation:** Large, bold typographic links. Active page indicated by a 2px Lime Green underline that spans the width of the word.