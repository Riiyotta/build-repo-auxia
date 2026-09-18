import { useState } from 'react'

/**
 * /demo — demo request form.
 *
 * Measured on the reference site's /demo at 1440x900:
 *   section_demo        924px, inherits body bg #f0efe3 (paper)
 *   .demo_content       grid 400px / 712px, gap 120px, padding 80px 0
 *   .demo_info          400px wide, padding-top 64px
 *     h1 .heading-style-h2 → 64px/500/60.8px/-1.92px  "See Auxia in action"
 *     .demo_tag         12px/500/14.4px, IBM Plex Mono, uppercase
 *     .demo_auxia       flex col, gap 24px, margin-top 40px
 *     .demo_bullet      flex, gap 10px
 *     .demo_p           14px/500/18.2px
 *     .demo_brands      flex, gap 40px, margin 40px 0
 *   .demo_form-wrap     712x700, bg #fefdf5, radius 24px, padding 40px,
 *                       margin-top 64px
 *   .demo_form          flex col, gap 40px
 *   .form_field-wrapper flex col, gap 0
 *   .form_label         13px/500/18.2px
 *   .form_input         48px tall, padding 12px 16px 12px 0,
 *                       14px/500/20px, transparent bg,
 *                       border-bottom 1px solid rgba(0,0,0,.3), radius 0
 *   .form_2-col         grid 308px x2, gap 16px
 *   submit .button      49px, padding 14px 24px, radius 12px,
 *                       bg #0b4fff, colour #f0efe3  → .btn-primary
 *
 * Responsive (measured):
 *   991px / 767px  .demo_content → flex column, gap 32px, padding 152px 0 80px
 *   390px          padding 136px 0 80px; form-wrap padding 24px 16px
 *
 * Fields, in original order (name → label):
 *   Email*     Work Email Address*      firstname* first name*
 *   lastname*  last name*               company*   company name*
 *   Phone      phone number             address*   Reason for Interest*
 *   Details    How can we help?
 *
 * NOTE: the original posts to HubSpot and mounts a Cloudflare Turnstile
 * widget. Neither is reproduced — this form is local React state only and
 * performs no network request. Submit renders a local success panel.
 *
 * NOTE: the original's .demo_slider is a marquee of real customer logos
 * (Atlassian, Konami, MUFG, Comcast, Mercari, Docomo, The Guardian, Mixi,
 * Assurant). Those are third-party trademarks and are NOT bundled — the
 * project's existing placeholder wordmarks stand in, matching the homepage.
 */

const BULLETS = [
  {
    title: 'Deliver Outcomes',
    body: 'Set your goals, define your boundaries, and let Auxia guide each customer to a successful outcome.',
  },
  {
    title: 'Automate Personalization',
    body: 'Create personalized experiences for every customer interaction, automatically in real time.',
  },
  { title: 'Get Actionable Insights', body: null },
]

const LOGOS = [
  'northwind',
  'lumenline',
  'cascadia',
  'quanta',
  'verdant',
  'orbital',
  'meridian',
  'stratafold',
  'halcyon',
]

const FIELDS = [
  { name: 'email', label: 'Work Email Address', type: 'email', required: true, full: true },
  { name: 'firstName', label: 'first name', type: 'text', required: true },
  { name: 'lastName', label: 'last name', type: 'text', required: true },
  { name: 'company', label: 'company name', type: 'text', required: true },
  { name: 'phone', label: 'phone number', type: 'tel', required: false },
  { name: 'reason', label: 'Reason for Interest', type: 'text', required: true, full: true },
  { name: 'details', label: 'How can we help?', type: 'text', required: false, full: true },
]

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.name, '']))

function Field({ field, value, error, onChange }) {
  const id = `demo-${field.name}`
  return (
    <div className="form_field-wrapper flex flex-col">
      <label htmlFor={id} className="form_label flex text-[.8125rem] leading-[1.4]">
        {field.label}
        {field.required && '*'}
      </label>
      <input
        id={id}
        name={field.name}
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        aria-required={field.required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`form_input h-12 w-full bg-transparent py-3 pr-4 text-sm leading-[1.43] text-ink outline-none
                    transition-colors duration-200 placeholder:text-ink/40
                    border-b focus:border-focus
                    ${error ? 'border-error-dark' : 'border-ink/30'}`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[.8125rem] leading-[1.4] text-error-dark">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Demo() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const update = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }

  // Local validation only — nothing leaves the page.
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    FIELDS.forEach((f) => {
      const v = values[f.name].trim()
      if (f.required && !v) next[f.name] = 'This field is required.'
      else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
        next[f.name] = 'Enter a valid email address.'
    })
    setErrors(next)
    if (Object.keys(next).length === 0) setSent(true)
  }

  return (
    <section className="section_demo">
      <div className="padding-global">
        <div className="container-large">
          <div
            className="demo_content flex flex-col gap-8 pb-20 pt-[8.5rem]
                       min-[992px]:grid min-[992px]:grid-cols-[400px_minmax(0,712px)]
                       min-[992px]:gap-[7.5rem] min-[992px]:py-20"
          >
            {/* ---------- Left: copy ---------- */}
            <div className="demo_info pt-6 min-[992px]:pt-16">
              <h1 className="text-h2">See Auxia in action</h1>

              <div className="demo_auxia mt-10 flex flex-col gap-6">
                <div className="demo_tag font-mono text-xs uppercase leading-[1.2]">
                  with auxia, you can:
                </div>
                <div className="demo_bullets flex flex-col gap-6">
                  {BULLETS.map((b, i) => (
                    <div
                      key={b.title}
                      className="demo_bullet reveal flex gap-2.5"
                      data-reveal-delay={i * 100}
                    >
                      <img
                        src="/assets/icons/checkmark.svg"
                        alt=""
                        className="mt-1 h-3 w-3 flex-none"
                      />
                      <div>
                        <div className="text-base font-medium leading-[1.3]">{b.title}</div>
                        {b.body && (
                          <div className="demo_p mt-1 text-sm leading-[1.3] text-ink">
                            {b.body}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="demo_brands my-10 flex flex-col gap-10">
                <div className="demo_tag font-mono text-xs uppercase leading-[1.2]">
                  leading enterprises choose auxia
                </div>
                {/* Placeholder wordmarks — see the note at the top of this file. */}
                <div className="demo_slider marquee-rail">
                  <div className="animate-marquee flex w-max items-center gap-10">
                    {[...LOGOS, ...LOGOS].map((name, i) => (
                      <img
                        key={`${name}-${i}`}
                        src={`/assets/logos/${name}.svg`}
                        alt={i < LOGOS.length ? name : ''}
                        aria-hidden={i >= LOGOS.length}
                        className="h-8 w-auto flex-none opacity-70"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- Right: form ---------- */}
            <div
              className="demo_form-wrap reveal relative rounded-3xl bg-[#fefdf5] px-4 py-6
                         min-[992px]:mt-16 min-[992px]:p-10"
            >
              {sent ? (
                /* Local success state — no request was made. */
                <div
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[20rem] flex-col items-start justify-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success">
                    <img src="/assets/icons/checkmark.svg" alt="" className="h-5 w-5" />
                  </div>
                  <h2 className="text-h3">Thanks — we'll be in touch.</h2>
                  <p className="max-w-[34rem] text-base leading-[1.3] text-ink/70">
                    Your demo request has been recorded locally in this demo build. Nothing
                    was sent to a server.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(EMPTY)
                      setErrors({})
                      setSent(false)
                    }}
                    className="btn-secondary mt-2"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form className="demo_form flex flex-col gap-10" onSubmit={submit} noValidate>
                  <Field
                    field={FIELDS[0]}
                    value={values.email}
                    error={errors.email}
                    onChange={update}
                  />

                  <div className="form_2-col grid gap-4 min-[768px]:grid-cols-2">
                    {FIELDS.slice(1, 3).map((f) => (
                      <Field
                        key={f.name}
                        field={f}
                        value={values[f.name]}
                        error={errors[f.name]}
                        onChange={update}
                      />
                    ))}
                  </div>

                  <div className="form_2-col grid gap-4 min-[768px]:grid-cols-2">
                    {FIELDS.slice(3, 5).map((f) => (
                      <Field
                        key={f.name}
                        field={f}
                        value={values[f.name]}
                        error={errors[f.name]}
                        onChange={update}
                      />
                    ))}
                  </div>

                  {FIELDS.slice(5).map((f) => (
                    <Field
                      key={f.name}
                      field={f}
                      value={values[f.name]}
                      error={errors[f.name]}
                      onChange={update}
                    />
                  ))}

                  <button type="submit" className="btn-primary w-full">
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
