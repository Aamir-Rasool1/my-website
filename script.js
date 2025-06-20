// Smooth scroll for the arrow in the hero section
const scrollArrow = document.getElementById('scrollArrow');
if (scrollArrow) {
  scrollArrow.addEventListener('click', function(e) {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Contact form submission handler with backend integration
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = 'form-message';
    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };
    try {
      const response = await fetch('http://localhost:5050/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        formMessage.textContent = result.message || 'Message sent!';
        formMessage.classList.add('success');
        contactForm.reset();
      } else {
        formMessage.textContent = result.error || 'Failed to send message.';
        formMessage.classList.add('error');
      }
    } catch (err) {
      formMessage.textContent = 'Network error. Please try again later.';
      formMessage.classList.add('error');
    }
  });
} 