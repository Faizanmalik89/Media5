// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Change icon based on menu state
      const icon = mobileMenuButton.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      const icon = mobileMenuButton.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Handle form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // For login and signup forms
      if (form.classList.contains('login-form') || form.classList.contains('signup-form')) {
        const formData = new FormData(form);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Simple client-side validation
        if (username) {
          localStorage.setItem('username', username);
        }
        if (email) {
          localStorage.setItem('email', email);
        }
        if (password) {
          localStorage.setItem('password', password);
        }
        
        // Show success message
        const formContainer = form.closest('.form-container');
        if (formContainer) {
          formContainer.innerHTML = `
            <div class="text-center">
              <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <h2 class="text-2xl font-bold mb-2">Success!</h2>
              <p class="mb-4">${form.classList.contains('login-form') ? 'You have successfully logged in.' : 'Your account has been created successfully.'}</p>
              <a href="index.html" class="btn btn-primary">Go to Homepage</a>
            </div>
          `;
        }
      }
      
      // For contact form
      if (form.classList.contains('contact-form')) {
        const formContainer = form.closest('.contact-form');
        if (formContainer) {
          formContainer.innerHTML = `
            <div class="text-center">
              <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
              <h2 class="text-2xl font-bold mb-2">Message Sent!</h2>
              <p class="mb-4">Thank you for contacting us. We will get back to you soon.</p>
            </div>
          `;
        }
      }
      
      // For newsletter form
      if (form.classList.contains('newsletter-form')) {
        const formContainer = form.closest('.newsletter-form');
        const emailInput = form.querySelector('input[type="email"]');
        if (formContainer && emailInput) {
          const email = emailInput.value;
          formContainer.innerHTML = `
            <div class="text-center">
              <p class="mb-2">Thank you for subscribing to our newsletter!</p>
              <p class="newsletter-privacy">We've sent a confirmation email to ${email}</p>
            </div>
          `;
        }
      }
    });
  });
  
  // Check if user is logged in for admin functions
  const isLoggedIn = localStorage.getItem('username') && localStorage.getItem('email');
  
  // Blog and video submission forms
  const blogSubmitForm = document.getElementById('blog-submit-form');
  if (blogSubmitForm) {
    blogSubmitForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      if (!isLoggedIn) {
        alert('Please log in to submit a blog post');
        window.location.href = 'login.html';
        return;
      }
      
      const formData = new FormData(blogSubmitForm);
      const title = formData.get('title');
      const category = formData.get('category');
      const content = formData.get('content');
      
      // You would normally send this to a server, but for this static site we just show a success message
      const uploadSection = document.querySelector('.upload-section');
      if (uploadSection) {
        uploadSection.innerHTML = `
          <div class="text-center">
            <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h2 class="text-2xl font-bold mb-2">Blog Submitted!</h2>
            <p class="mb-4">Your blog post "${title}" has been submitted successfully.</p>
            <a href="blogs.html" class="btn btn-primary">View All Blogs</a>
          </div>
        `;
      }
    });
  }
  
  // Video admin controls (only shown to logged in users who are admins)
  const adminControls = document.querySelectorAll('.admin-controls');
  if (adminControls.length > 0) {
    adminControls.forEach(control => {
      if (!isLoggedIn) {
        control.style.display = 'none';
      }
    });
  }
  
  // Delete buttons for admin (for demo purposes only)
  const deleteButtons = document.querySelectorAll('.btn-delete');
  if (deleteButtons.length > 0) {
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (!isLoggedIn) {
          alert('Please log in as admin to delete items');
          return;
        }
        
        const card = button.closest('.blog-card, .video-card');
        if (card && confirm('Are you sure you want to delete this item?')) {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  }
  
  // Animate stat counters
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const animateCounter = (element, target, duration) => {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start).toLocaleString();
        
        if (start >= target) {
          element.textContent = target.toLocaleString();
          clearInterval(timer);
        }
      }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.value || entry.target.textContent, 10);
          animateCounter(entry.target, target, 1500);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
      observer.observe(stat);
    });
  }
});