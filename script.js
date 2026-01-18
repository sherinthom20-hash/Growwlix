// Smooth scroll for internal anchor links
document.addEventListener('click', function (e) {
	if (!(e.target instanceof Element)) return;
	const link = e.target.closest('a[href^="#"]');
	if (!link) return;
	const href = link.getAttribute('href');
	if (!href || href === '#') return;
	const target = document.querySelector(href);
	if (!target) return;
	e.preventDefault();
	target.scrollIntoView({ behavior: 'smooth', block: 'start' });

	// Close mobile nav on link click
	const nav = document.querySelector('.nav');
	const hamburger = document.querySelector('.hamburger');
	if (nav && nav.classList.contains('open')) {
		nav.classList.remove('open');
		if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
	}
});

// Active nav highlighting on scroll
const sectionIds = ['services', 'how-it-works', 'pricing', 'contact'];
const navLinks = sectionIds
	.map((id) => ({ id, el: document.querySelector(`.nav a[href="#${id}"]`) }))
	.filter((x) => x.el);

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const link = navLinks.find((l) => `#${l.id}` === `#${entry.target.id}`);
			if (!link || !link.el) return;
			if (entry.isIntersecting) {
				navLinks.forEach((l) => l.el.classList.remove('active'));
				link.el.classList.add('active');
			}
		});
	},
	{ threshold: 0.4 }
);
sectionIds.forEach((id) => {
	const el = document.getElementById(id);
	if (el) observer.observe(el);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
if (hamburger && nav) {
	hamburger.addEventListener('click', () => {
		nav.classList.toggle('open');
		const expanded = nav.classList.contains('open');
		hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
	});
}

// Header scrolled state
const header = document.querySelector('.site-header');
const setHeaderScrolled = () => {
	if (!header) return;
	header.classList.toggle('scrolled', window.scrollY > 8);
};
setHeaderScrolled();
window.addEventListener('scroll', setHeaderScrolled, { passive: true });

// Reveal-on-scroll animations
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15 }
	);
	revealEls.forEach((el) => revealObserver.observe(el));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
	yearEl.textContent = new Date().getFullYear().toString();
}

// Enquiry form handling (client-side)
const enquiryForm = document.getElementById('enquiry-form');
const formStatus = document.getElementById('form-status');
if (enquiryForm) {
	enquiryForm.addEventListener('submit', (ev) => {
		ev.preventDefault();
		const name = document.getElementById('name');
		const email = document.getElementById('email');
		const message = document.getElementById('message');
		if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
			formStatus.textContent = 'Please complete name, email and message.';
			formStatus.classList.remove('success');
			return;
		}
			formStatus.textContent = 'Preparing message…';
			formStatus.classList.remove('success');

			// Build mailto link to send to growlix8@gmail.com (opens user's email client)
			const to = 'growlix8@gmail.com';
			const subject = `New enquiry from ${name.value.trim()}`;
			const bodyLines = [];
			bodyLines.push(`Name: ${name.value.trim()}`);
			bodyLines.push(`Email: ${email.value.trim()}`);
			bodyLines.push('');
			bodyLines.push('Message:');
			bodyLines.push(message.value.trim());
			const body = encodeURIComponent(bodyLines.join('\n'));
			const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;

			// Open mail client. Note: this does not guarantee delivery — user must send the email.
			window.location.href = mailto;

			// Give user feedback
			formStatus.textContent = 'Opened your email client — please review and send the message.';
			formStatus.classList.add('success');
	});

	const clearBtn = document.getElementById('clear-form');
	if (clearBtn) clearBtn.addEventListener('click', () => { enquiryForm.reset(); formStatus.textContent = ''; });
}

/* Testimonial carousel rendering and auto-slide */
(function () {
	const testimonials = [
		{stars: '★★★★★', quote: 'Growlix did an excellent job building our website. Clean design, fast loading, and very smooth communication throughout the project.', author: 'David', role: 'Founder'},
		{stars: '★★★★★', quote: 'Professional team with strong technical knowledge. They delivered exactly what was promised and on time.', author: 'Sarah', role: 'CEO'},
		{stars: '★★★★★', quote: 'Highly satisfied with the web application developed by Growlix. Everything works perfectly and the code quality is great.', author: 'Michael', role: 'Product Manager'},
		{stars: '★★★★★', quote: 'Growlix understands requirements clearly and delivers reliable solutions. Great experience working with their team.', author: 'Ananya', role: 'Business Owner'},
		{stars: '★★★★★', quote: 'Our website looks modern and performs extremely well. Growlix exceeded our expectations.', author: 'James', role: 'Startup Founder'},
		{stars: '★★★★★', quote: 'Very responsive and professional developers. They guided us through every step of the process.', author: 'Emily', role: 'Operations Lead'},
		{stars: '★★★★★', quote: 'Growlix delivered a stable and scalable web solution for our business. Would definitely work with them again.', author: 'Rahul', role: 'CTO'},
		{stars: '★★★★★', quote: 'The team was easy to communicate with and delivered a high-quality website within the agreed timeline.', author: 'Sophia', role: 'Marketing Manager'},
		{stars: '★★★★★', quote: 'Excellent development skills and attention to detail. Growlix is a reliable partner for digital projects.', author: 'Daniel', role: 'Tech Consultant'},
		{stars: '★★★★★', quote: 'Our mobile app was delivered smoothly with great performance. Very happy with the final result.', author: 'Olivia', role: 'App Founder'},
		{stars: '★★★★★', quote: 'Growlix provided clear communication and professional execution. The website works flawlessly.', author: 'Ahmed', role: 'Business Director'},
		{stars: '★★★★★', quote: 'Strong technical team and excellent support even after delivery. Highly recommended.', author: 'Laura', role: 'Project Lead'},
		{stars: '★★★★★', quote: 'They turned our idea into a functional web application efficiently and professionally.', author: 'Kevin', role: 'Startup Owner'},
		{stars: '★★★★★', quote: 'Growlix delivered a clean and responsive website that perfectly matches our needs.', author: 'Nina', role: 'Entrepreneur'},
		{stars: '★★★★★', quote: 'Very satisfied with the development quality and professionalism. Communication was smooth and clear.', author: 'Thomas', role: 'Business Consultant'},
		{stars: '★★★★★', quote: 'The team understood our requirements well and delivered a reliable solution without delays.', author: 'Fatima', role: 'Operations Manager'},
		{stars: '★★★★★', quote: 'Growlix is dependable, skilled, and easy to work with. Great experience overall.', author: 'Robert', role: 'Product Owner'},
		{stars: '★★★★★', quote: 'Our web platform is fast, secure, and scalable thanks to Growlix’s development team.', author: 'Suresh', role: 'IT Manager'},
		{stars: '★★★★★', quote: 'Clear communication, strong technical execution, and timely delivery. Highly recommended.', author: 'Jessica', role: 'Business Founder'},
		{stars: '★★★★★', quote: 'Growlix delivered exactly what we needed. Professional approach and quality results.', author: 'Victor', role: 'Startup CEO'}
	];

	const track = document.getElementById('t-track');
	if (!track) return;

	// Render slides
	testimonials.forEach((t) => {
		const item = document.createElement('div');
		item.className = 't-item';
		item.innerHTML = `
			<div class="t-card">
				<div class="stars">${t.stars}</div>
				<blockquote class="test-quote">${t.quote}</blockquote>
				<div class="t-meta">
					<div class="meta-text">
						<div class="meta-name">— ${t.author}</div>
						<div class="meta-role">${t.role}</div>
					</div>
				</div>
			</div>
		`;
		track.appendChild(item);
	});

	// Carousel state (infinite loop with cloned slides)
	let index = 0;
	const originalCount = testimonials.length;

	const getVisibleCount = () => {
		const w = window.innerWidth;
		if (w >= 980) return 3;
		if (w >= 640) return 2;
		return 1;
	};

	let visibleCount = getVisibleCount();

	// clone first visibleCount slides to enable seamless looping
	const cloneSlides = () => {
		// remove existing clones if any
		const clones = track.querySelectorAll('.t-item.clone');
		clones.forEach(c => c.remove());
		const children = Array.from(track.children).filter(c => !c.classList.contains('clone'));
		for (let i = 0; i < visibleCount; i++) {
			const node = children[i].cloneNode(true);
			node.classList.add('clone');
			track.appendChild(node);
		}
	};

	cloneSlides();

	const total = track.children.length; // includes clones

	const slide = (immediate = false) => {
		const step = 100 / visibleCount; // percent per item
		const offset = -index * step;
		if (immediate) {
			track.style.transition = 'none';
			track.style.transform = `translateX(${offset}%)`;
			// force reflow
			void track.offsetWidth;
			track.style.transition = '';
		} else {
			track.style.transform = `translateX(${offset}%)`;
		}
	};

	// advance with infinite looping
	let interval = null;
	const startAuto = () => {
		clearInterval(interval);
		interval = setInterval(() => {
				index++;
				slide();
			}, 2000);
	};
	startAuto();

	// After transition, if we've passed originals, jump back to start
	track.addEventListener('transitionend', () => {
		const originals = originalCount;
		if (index >= originals) {
			// jump back to equivalent index 0
			index = 0;
			slide(true);
		}
		if (index < 0) {
			// wrap from start to end (not used here but safe)
			index = originals - 1;
			slide(true);
		}
	});

	// Pause on hover
	const carousel = document.querySelector('.testimonial-carousel');
	if (carousel) {
		carousel.addEventListener('mouseenter', () => clearInterval(interval));
		carousel.addEventListener('mouseleave', () => startAuto());
	}

	// Prev/Next controls
	const prevBtn = document.getElementById('t-prev');
	const nextBtn = document.getElementById('t-next');
	if (prevBtn) prevBtn.addEventListener('click', () => { index = Math.max(0, index - 1); slide(); });
	if (nextBtn) nextBtn.addEventListener('click', () => { index = index + 1; slide(); });

	// Rebuild clones when resizing past breakpoints
	let resizeTimeout = null;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			const newVisible = getVisibleCount();
			if (newVisible !== visibleCount) {
				visibleCount = newVisible;
				// rebuild: remove all items and re-render
				track.innerHTML = '';
				testimonials.forEach((t) => {
					const item = document.createElement('div');
					item.className = 't-item';
					item.innerHTML = `
						<div class="t-card">
							<div class="stars">${t.stars}</div>
							<blockquote class="test-quote">${t.quote}</blockquote>
							<div class="t-meta">
								<div class="meta-text">
									<div class="meta-name">— ${t.author}</div>
									<div class="meta-role">${t.role}</div>
								</div>
							</div>
						</div>
					`;
					track.appendChild(item);
				});
				cloneSlides();
				index = 0;
				slide(true);
			}
		}, 200);
	});
})();



