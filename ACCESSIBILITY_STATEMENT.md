# Accessibility Statement

## Our Commitment

The Magician Platform is committed to ensuring digital accessibility for people with disabilities, with a specific focus on serving the deaf and hard of hearing community. We continually improve the user experience for everyone and apply the relevant accessibility standards to ensure we provide equal access to all.

## Conformance Status

The Magician Platform aims to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA** standards. These guidelines explain how to make web content accessible to people with a wide array of disabilities, including blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, photosensitivity, and combinations of these.

### Current Conformance Level

**Partially Conformant**: The Magician Platform is partially conformant with WCAG 2.1 Level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.

## Accessibility Features

### Deaf-First Design

Our platform is built with deaf-first accessibility principles:

#### Visual Communication
- **ASL Video Content**: American Sign Language video interpretations available throughout the platform for key instructions and content
- **Visual Notifications**: All system alerts and notifications are presented visually, never relying solely on audio
- **Clear Visual Hierarchy**: Content is organized with clear headings, spacing, and visual cues
- **Captions and Transcripts**: All video content includes accurate captions and text transcripts

#### No Audio Dependencies
- **No Audio-Only Content**: Information is never conveyed through audio alone
- **Visual Alternatives**: All alerts, notifications, and feedback are provided visually
- **Vibration and Visual Alerts**: Mobile notifications use vibration and visual indicators

### Keyboard Accessibility

- **Full Keyboard Navigation**: All functionality is accessible using only a keyboard
- **Logical Tab Order**: Interactive elements follow a logical and intuitive tab order
- **Visible Focus Indicators**: Clear visual indicators show which element has keyboard focus
- **Skip Navigation Links**: Users can skip to main content, bypassing repetitive navigation
- **Keyboard Shortcuts**: Documented keyboard shortcuts for common actions (can be customized)
- **No Keyboard Traps**: Users can navigate away from any component using standard keyboard commands

### Screen Reader Compatibility

- **Semantic HTML**: Proper HTML5 semantic elements for document structure
- **ARIA Labels**: Appropriate ARIA (Accessible Rich Internet Applications) labels and landmarks
- **Alt Text**: All images include descriptive alternative text
- **Form Labels**: All form inputs are properly labeled and associated
- **Dynamic Content**: Screen readers are notified of dynamic content changes using ARIA live regions
- **Table Accessibility**: Data tables include proper headers and relationships

#### Tested With
- JAWS (Job Access With Speech)
- NVDA (NonVisual Desktop Access)
- VoiceOver (macOS and iOS)
- TalkBack (Android)

### Visual Accessibility

#### Color and Contrast
- **High Contrast Ratios**: 
  - Normal text: Minimum 4.5:1 contrast ratio
  - Large text (18pt+): Minimum 3:1 contrast ratio
  - UI components: Minimum 3:1 contrast ratio
- **No Color-Only Information**: Color is never the only means of conveying information
- **Colorblind-Friendly**: Color palettes tested with colorblindness simulators

#### Text and Typography
- **Resizable Text**: Text can be resized up to 200% without loss of content or functionality
- **Readable Fonts**: Clear, sans-serif fonts with appropriate spacing
- **Line Height**: Minimum 1.5x line height for paragraph text
- **Paragraph Spacing**: Minimum 2x spacing between paragraphs
- **User Control**: Users can customize text size and spacing in browser settings

#### Visual Design
- **Consistent Layout**: Predictable and consistent page layouts
- **Clear Headings**: Proper heading hierarchy (H1 through H6)
- **Whitespace**: Adequate spacing between interactive elements (minimum 44×44 pixels touch targets)
- **No Flashing Content**: No content flashes more than 3 times per second

### Motor Accessibility

- **Large Click Targets**: Interactive elements are at least 44×44 pixels (WCAG AAA recommendation)
- **No Time Limits**: Users have unlimited time to complete forms and tasks, or can extend time limits
- **Error Prevention**: Confirmations for destructive actions
- **Error Recovery**: Clear error messages with suggestions for correction
- **Voice Input Support**: Compatible with voice recognition software

### Cognitive Accessibility

- **Plain Language**: Clear, concise language avoiding jargon where possible
- **Consistent Navigation**: Navigation menus and controls in consistent locations
- **Predictable Behavior**: Interactive elements behave in expected ways
- **Help and Documentation**: Contextual help available throughout the platform
- **Progress Indicators**: Clear indication of multi-step process progress
- **Error Messages**: Clear, specific error messages with actionable solutions

## Assistive Technologies

The Magician Platform is designed to be compatible with the following assistive technologies:

### Screen Readers
- JAWS (Windows)
- NVDA (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)
- Narrator (Windows)

### Input Methods
- Keyboard-only navigation
- Voice recognition software (Dragon NaturallySpeaking, etc.)
- Switch access devices
- Eye-tracking devices
- Mouth stick/head wand

### Visual Assistance
- Screen magnification software
- High contrast mode
- Browser zoom (up to 200%)
- Custom color schemes
- Dark mode support

### Deaf/Hard of Hearing
- Video relay services (VRS) compatible
- ASL video player controls
- Visual notification systems
- Vibration alerts on mobile

## Browser and Device Support

The Magician Platform is tested and optimized for:

### Desktop Browsers
- Chrome (latest version)
- Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

### Mobile Browsers
- Safari on iOS (latest version)
- Chrome on Android (latest version)
- Samsung Internet (latest version)

### Operating Systems
- Windows 10/11
- macOS (latest 2 versions)
- iOS (latest 2 versions)
- Android (latest 2 versions)

## Known Limitations

We are continuously working to improve accessibility. Current known limitations include:

1. **ASL Video Coverage**: Not all content has ASL video interpretation yet (in progress)
2. **PDF Documents**: Some downloadable documents may not be fully accessible (being remediated)
3. **Third-Party Integrations**: Some third-party embedded content may not meet our accessibility standards
4. **Legacy Components**: Older components are being updated to meet current standards

## Ongoing Improvements

We are committed to continuous improvement and are actively working on:

- [ ] Expanding ASL video coverage to 100% of key content
- [ ] Implementing automated accessibility testing in CI/CD pipeline
- [ ] Conducting regular user testing with diverse disability groups
- [ ] Training all developers on accessibility best practices
- [ ] Quarterly accessibility audits with external experts
- [ ] Updating legacy components to current WCAG 2.1 standards

## Testing and Validation

Our accessibility testing process includes:

### Automated Testing
- **Tools Used**: axe DevTools, WAVE, Lighthouse
- **Frequency**: On every pull request
- **Coverage**: All new components and pages

### Manual Testing
- **Keyboard Navigation**: All interactive features tested with keyboard only
- **Screen Reader Testing**: Regular testing with JAWS, NVDA, and VoiceOver
- **Color Contrast**: Manual verification of all color combinations
- **Zoom Testing**: All pages tested at 200% zoom

### User Testing
- **Deaf Community**: Regular feedback from deaf users and ASL interpreters
- **Diverse Disabilities**: User testing with people with various disabilities
- **Real-World Scenarios**: Testing common user workflows and tasks

## Feedback and Support

We welcome feedback on the accessibility of the Magician Platform. If you encounter accessibility barriers, please let us know:

### Report Accessibility Issues

**Email**: accessibility@360magicians.com

**GitHub Issues**: [Report an accessibility issue](https://github.com/MBTQ-dev/Magician_Platform/issues/new?labels=accessibility)

**Response Time**: We aim to respond to accessibility feedback within 2 business days.

### Information to Include

When reporting accessibility issues, please include:

1. **Description**: Clear description of the issue
2. **Location**: URL or page where issue occurs
3. **Assistive Technology**: Screen reader, browser, or other tools being used
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened
6. **Steps to Reproduce**: How to recreate the issue
7. **Screenshots**: If applicable and helpful

## Formal Complaints

If you are not satisfied with our response to your accessibility concern, you may:

1. Contact our accessibility coordinator at accessibility@360magicians.com
2. File a formal complaint with the relevant accessibility authority in your jurisdiction
3. In the United States: File a complaint with the U.S. Department of Justice

## Standards and Regulations

The Magician Platform strives to meet or exceed the following standards and regulations:

### Web Accessibility Standards
- **WCAG 2.1 Level AA**: Web Content Accessibility Guidelines
- **Section 508**: U.S. federal accessibility standards (based on WCAG 2.0 Level AA)
- **ADA**: Americans with Disabilities Act (web accessibility requirements)
- **EN 301 549**: European accessibility standard

### Industry-Specific Standards
- **34 CFR Part 361**: VR services regulations include accessibility requirements
- **Rehabilitation Act of 1973**: Section 504 accessibility requirements
- **CVAA**: 21st Century Communications and Video Accessibility Act

## Accessibility Team

Our accessibility efforts are led by:

- **Development Team**: All developers trained in accessibility best practices
- **Quality Assurance**: Dedicated accessibility testing in QA process
- **Community Advisors**: Deaf community members providing ongoing guidance
- **External Auditors**: Regular third-party accessibility audits

## Training and Education

We invest in accessibility education:

- **Developer Training**: All developers complete accessibility training
- **Design Training**: Designers trained in accessible design principles
- **Content Training**: Content creators trained in accessible content creation
- **Ongoing Learning**: Regular workshops and updates on accessibility best practices

## Third-Party Content

Some content and functionality may rely on third-party services:

- **Video Hosting**: YouTube (with captions), Vimeo
- **Storage**: Google Cloud Storage
- **Authentication**: OAuth providers
- **Analytics**: Privacy-respecting analytics tools

We require third-party providers to meet accessibility standards where possible, and provide accessible alternatives when third-party content is not fully accessible.

## Accessibility Statement Maintenance

- **Last Updated**: December 14, 2024
- **Review Frequency**: Quarterly
- **Next Review**: March 2025

## Technical Specifications

The Magician Platform relies on the following technologies:

- **HTML5**: Semantic markup
- **CSS3**: Responsive design and styling
- **JavaScript/TypeScript**: Enhanced functionality
- **React**: Component framework
- **ARIA**: Accessibility attributes

These technologies are chosen for their robust accessibility support and compatibility with assistive technologies.

## Success Criteria

We measure our accessibility success through:

1. **Automated Testing**: 100% pass rate on automated accessibility tests
2. **Manual Testing**: Regular keyboard and screen reader testing
3. **User Feedback**: Positive feedback from users with disabilities
4. **Compliance Audits**: External accessibility audits every 6 months
5. **Issue Resolution**: Accessibility issues resolved within defined SLA

## Resources and References

### Accessibility Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Section 508 Standards](https://www.section508.gov/)

### Deaf Accessibility Resources
- [NAD (National Association of the Deaf)](https://www.nad.org/)
- [Deaf Web Accessibility](https://www.w3.org/WAI/perspective-videos/captions/)
- [ASL Best Practices](https://www.nad.org/resources/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

## Contact Information

**Accessibility Coordinator**: accessibility@360magicians.com

**General Support**: support@360magicians.com

**Mailing Address**:
360 Magicians Platform
[Address to be added]

**Phone/Video Relay**:
- VRS: [Number to be added]
- TTY: [Number to be added]

---

## Acknowledgments

We thank the deaf community, accessibility experts, and users with disabilities who have provided invaluable feedback to improve the Magician Platform's accessibility.

## Legal

This accessibility statement applies to the Magician Platform available at https://business.360magicians.com and related domains. This statement does not constitute a legally binding warranty.

**Last Updated**: December 14, 2024

**Version**: 1.0.0

---

**Built with ❤️ for universal accessibility and the deaf community**
