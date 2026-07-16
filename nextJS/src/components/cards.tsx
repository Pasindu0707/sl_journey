import Link from "next/link";
import Ic from "./Ic";
import { waLink } from "@/data/site";
import {
  img, dateParts, priceLabel, FEATURES, EXPERIENCES, DESTINATIONS, REVIEWS, PACKAGES, BLOG, type Post,
} from "@/data/content";

export const Stars = ({ n = 5 }: { n?: number }) => (
  <>{Array.from({ length: n }).map((_, i) => <Ic key={i} name="star" />)}</>
);

export function FeatureCards() {
  return (
    <>
      {FEATURES.map(([ic, t, d]) => (
        <div className="feature" key={t}>
          <div className="feature__ic"><Ic name={ic} /></div>
          <h3>{t}</h3>
          <p>{d}</p>
        </div>
      ))}
    </>
  );
}

export function PackageCards() {
  return (
    <>
      {PACKAGES.map((p) => (
        <Link className="pkg" href={`/packages/${p.slug}`} data-reveal="scale" key={p.slug}>
          <div className="pkg__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(p.img)} alt={p.name} loading="lazy" decoding="async" />
          </div>
          <div className="pkg__body">
            <span className="pkg__dur">{p.days}</span>
            <h3>{p.name}</h3>
            <p className="pkg__route">{p.route}</p>
            <div className="pkg__foot">
              <div className="pkg__price">Starting<b>{priceLabel(p)}</b></div>
              <span className="pkg__link">View Tour <Ic name="arrow" /></span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export function ExperienceCards() {
  return (
    <>
      {EXPERIENCES.map(([im, tag, t, d]) => (
        <article className="exp" tabIndex={0} key={t}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(im)} alt={t} loading="lazy" decoding="async" />
          <div className="exp__body">
            <span className="tag">{tag}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        </article>
      ))}
    </>
  );
}

export function DestinationCards() {
  return (
    <>
      {DESTINATIONS.map(([im, name]) => (
        <Link className="dest" href="/gallery" aria-label={name} key={name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(im)} alt={name} loading="lazy" decoding="async" />
          <div className="dest__cap">
            <h3>{name}</h3>
            <span className="arr"><Ic name="arrow" /></span>
          </div>
        </Link>
      ))}
    </>
  );
}

export function ReviewCards() {
  return (
    <>
      {REVIEWS.map(([name, country, title, body]) => (
        <article className="review" data-reveal key={name}>
          <div className="stars"><Stars /></div>
          <h4>{title}</h4>
          <p>{body}</p>
          <div className="who">
            <span className="av">{name[0]}</span>
            <div>
              <b>{name}</b>
              <span>Verified · {country}</span>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}

export function BlogCards({ posts = BLOG }: { posts?: Post[] }) {
  return (
    <>
      {posts.map((b) => {
        const [day, month] = dateParts(b.date);
        return (
        <Link className="post-card" href={`/blog/${b.slug}`} data-reveal key={b.slug}>
          <div className="post-card__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(b.img)} alt={b.title} loading="lazy" decoding="async" />
            <time className="post-card__date" dateTime={b.date}><b>{day}</b><span>{month}</span></time>
          </div>
          <div className="post-card__body">
            <h3>{b.title}</h3>
            <p>{b.excerpt}</p>
            <span className="link-arrow">Read Story <Ic name="arrow" /></span>
          </div>
        </Link>
        );
      })}
    </>
  );
}

export function CtaBand() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("harbor-dusk")} alt="Plan your Sri Lanka journey" loading="lazy" />
          <div className="cta-band__inner">
            <span className="eyebrow center">Your Journey Awaits</span>
            <h2 style={{ marginTop: 16 }}>Let&apos;s Plan Your Sri Lanka Story</h2>
            <p>Tell us how you like to travel and our local experts will craft a private, tailor-made itinerary — at no obligation.</p>
            <div className="hero__cta">
              <a className="btn btn--primary btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer"><Ic name="whatsapp" /> Chat on WhatsApp</a>
              <Link className="btn btn--light btn--lg" href="/contact">Enquire Now</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
