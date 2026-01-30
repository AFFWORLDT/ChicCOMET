# Hero Slider Component Documentation

## Overview
The HeroSlider component is a sophisticated, mobile-optimized image slider for the Whitlin homepage. It features smooth transitions, touch gestures, keyboard navigation, and responsive design.

## Features

### 🎯 Core Features
- **Auto-play**: Automatically cycles through slides every 6 seconds
- **Manual Navigation**: Arrow buttons and slide indicators
- **Touch Gestures**: Swipe left/right on mobile devices
- **Keyboard Navigation**: Arrow keys and spacebar support
- **Play/Pause Control**: Toggle auto-play functionality
- **Progress Bar**: Visual indicator of slide timing

### 📱 Mobile Optimization
- **Responsive Design**: Adapts to all screen sizes
- **Touch Gestures**: Swipe navigation with minimum distance threshold
- **Mobile-First Typography**: Scales text appropriately
- **Touch-Friendly Controls**: Larger touch targets on mobile
- **Performance Optimized**: Smooth animations on mobile devices

### 🎨 Visual Features
- **Smooth Transitions**: Fade effects between slides
- **Dynamic Overlays**: Adjustable background overlays
- **Text Animations**: Staggered content animations
- **Brand Integration**: Whitlin branding elements
- **Theme Support**: Light and dark theme variations

## Usage

### Basic Implementation
```tsx
import { HeroSlider } from "@/components/hero-slider"

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      {/* Other content */}
    </div>
  )
}
```

### Customization

#### Adding New Slides
Edit the `heroSlides` array in `hero-slider.tsx`:

```tsx
const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Your Title",
    subtitle: "Your Subtitle",
    description: "Your description text",
    image: "/images/your-image.jpg",
    primaryButton: {
      text: "Primary Action",
      href: "/your-link"
    },
    secondaryButton: {
      text: "Secondary Action",
      href: "/your-secondary-link"
    },
    textPosition: 'center', // 'left' | 'center' | 'right'
    theme: 'dark' // 'dark' | 'light'
  }
]
```

#### Slide Properties
- **id**: Unique identifier for the slide
- **title**: Main heading text
- **subtitle**: Secondary heading (displayed in accent color)
- **description**: Descriptive text below the title
- **image**: Background image path
- **primaryButton**: Main call-to-action button
- **secondaryButton**: Secondary action button
- **textPosition**: Text alignment ('left', 'center', 'right')
- **theme**: Color theme ('dark' or 'light')
- **overlay**: Optional brand text overlay

#### Timing Configuration
```tsx
// Auto-play interval (milliseconds)
const interval = setInterval(() => {
  setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
}, 6000) // Change this value to adjust timing
```

#### Touch Sensitivity
```tsx
// Minimum swipe distance for navigation
const minSwipeDistance = 50 // Adjust for sensitivity
```

## Responsive Breakpoints

### Mobile (< 640px)
- Smaller navigation arrows
- Stacked button layout
- Reduced text sizes
- Touch-optimized controls

### Tablet (640px - 1024px)
- Medium-sized controls
- Horizontal button layout
- Balanced text sizing

### Desktop (> 1024px)
- Full-sized controls
- Optimal spacing
- Maximum text sizes

## Performance Considerations

### Image Optimization
- Uses Next.js Image component for optimization
- Lazy loading for non-priority images
- Responsive image sizing

### Animation Performance
- CSS transforms for smooth animations
- Hardware acceleration enabled
- Reduced motion support

### Memory Management
- Proper cleanup of event listeners
- Efficient state management
- Minimal re-renders

## Accessibility Features

### Keyboard Navigation
- Arrow keys for slide navigation
- Spacebar for play/pause toggle
- Tab navigation for interactive elements

### Screen Reader Support
- Proper ARIA labels
- Semantic HTML structure
- Alt text for images

### Focus Management
- Visible focus indicators
- Logical tab order
- Keyboard trap prevention

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch device support
- Keyboard navigation support

## Troubleshooting

### Common Issues

#### Images Not Loading
- Check image paths in `/public/images/`
- Ensure images are optimized
- Verify Next.js Image component configuration

#### Touch Gestures Not Working
- Check touch event handlers
- Verify minimum swipe distance
- Test on actual mobile devices

#### Performance Issues
- Optimize image sizes
- Reduce animation complexity
- Check for memory leaks

### Debug Mode
Enable debug logging by adding:
```tsx
console.log('Current slide:', currentSlide)
console.log('Is playing:', isPlaying)
```

## Future Enhancements

### Planned Features
- Video background support
- Advanced animation options
- Custom transition effects
- Analytics integration
- A/B testing support

### Customization Options
- Custom transition durations
- Advanced theme configurations
- Dynamic content loading
- Integration with CMS

## Support
For issues or questions about the Hero Slider component, please refer to the main project documentation or contact the development team.
