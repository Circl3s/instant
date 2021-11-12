class Instant extends HTMLAnchorElement {
    constructor() {
        super();

        let options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        }
        let observer = new IntersectionObserver(this.onVisible, options);
        observer.observe(this);

        this.addEventListener('click', this.onClick);
    }

    onClick(e) {
        e.preventDefault();
        history.pushState(null, null, this.href);
        document.open();
        document.write(this.newContent);
        document.close();
    }

    async onVisible(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.host != window.location.host) {
                    throw new Error('Instant: host mismatch');
                } else {
                    let request = fetch(entry.target.href);
                    request.then(response => {
                        if (response.ok) {
                            response.text().then(html => {
                                entry.target.newContent = html;
                            });
                        } else {
                            throw new Error('Instant: response not ok');
                        }
                    });
                }
                entry.target.classList.add('instant-visible');
                observer.unobserve(entry.target);
            }
        });
    }
}

customElements.define('instant-load', Instant, { extends: 'a' });