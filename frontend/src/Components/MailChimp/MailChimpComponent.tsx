export const MailChimpComponent = () => (
  <section
    id="subscribe"
    className="page-section subscribe-section"
    aria-labelledby="subscribe-heading"
  >
    <div>
      <p className="eyebrow">You're on the list</p>
      <h2 id="subscribe-heading">Don't miss the next one.</h2>
      <p>
        New shows, fresh music, and news from the band. Straight to your inbox.
      </p>
    </div>
    <form
      action="https://jesterjay.us7.list-manage.com/subscribe/post?u=b502469e7948b1c03ab920c6c&id=694d4baf18&f_id=008ed3e4f0"
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      className="subscribe-form"
      aria-label="Mailing list signup"
    >
      <label htmlFor="newsletter-email">Email address</label>
      <div className="subscribe-fields">
        <input
          id="newsletter-email"
          name="EMAIL"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-describedby="newsletter-help"
        />
        <button type="submit" name="subscribe" className="button-primary">
          Count me in <span aria-hidden="true">&#8599;</span>
        </button>
      </div>
      <div className="subscribe-honeypot" aria-hidden="true">
        <input
          type="text"
          name="b_b502469e7948b1c03ab920c6c_694d4baf18"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p id="newsletter-help">
        Unsubscribe anytime. Signup opens securely in Mailchimp.
      </p>
    </form>
  </section>
);
