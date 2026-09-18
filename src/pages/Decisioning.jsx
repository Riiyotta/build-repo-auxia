import DecisionHero from '../components/DecisionHero'
import Brands from '../components/Brands'
import FeatureRows from '../components/FeatureRows'
import FeaturesBottom from '../components/FeaturesBottom'
import UseCaseGrid from '../components/UseCaseGrid'
import Prefooter from '../components/Prefooter'

/**
 * /decisioning — section inventory measured on the live original, in order:
 *   1 .section_agent-hero.is-decision 1095px  blue
 *   2 .section_brands                  260px  paper
 *   3 .section_features               5107px  paper (6 rows + features_bottom)
 *   4 .section_grid                    784px  #fefdf5 (4-up cards)
 *   5 .case-studies_slider             531px  blue
 *   6 .section_prefooter               435px  ink
 * Note: the original has NO .section_cta on this page — the prefooter closes it.
 */
const FEATURES = [
  {
    eyebrow: 'INGEST',
    title: 'Your data in, model-ready features out',
    img: '/assets/img/dc-ingest.svg',
    points: [
      { title: 'Connect your data',
        body: 'Batch or real time: Auxia ingests event, attribute, and campaign data from your warehouse, CDP, and live sessions, so decisions use the full picture.' },
      { title: 'Make it model-ready',
        body: 'Deep learning and LLMs turn raw data and structured content data like headlines, images, and offers into model-ready features automatically, so you skip the data-science work a feature store usually takes.' },
      { title: 'Keep privacy first',
        body: 'PII is filtered on the way in, so personalization runs without exposing sensitive data.' },
    ],
  },
  {
    eyebrow: 'GOALS AND GUARDRAILS',
    title: 'Control the customer experience',
    img: '/assets/img/dc-goals.svg',
    points: [
      { title: 'True 1:1, not segments',
        body: 'Auxia chooses content, offer, channel, and timing for each person from up to ~10,000 signals per decision, giving each customer their own experience.' },
      { title: 'Multi-goal optimization',
        body: 'Balances activation, retention, cross-sell and win-back goals across every channel and customer at once, so a win-back offer is never cannibalized by an unrelated upsell.' },
    ],
  },
  {
    eyebrow: 'DEFINE THE CONTENT AND SURFACES',
    title: 'Creatives that keep pace with enterprise scale.',
    img: '/assets/img/dc-scale.png',
    points: [
      { title: 'Customize every surface and channel',
        body: 'In-app, push, email, SMS, and on any other owned property, so decisions find your customer wherever they are.' },
      { title: 'Pull or create hundreds of variants',
        body: 'Past creatives guide new messaging, imagery, and product combinations, so personalization never slows production.' },
      { title: 'Work across your stack',
        body: 'Bring personalization into your various systems of activation (Braze, SFMC, Adobe)' },
    ],
  },
  {
    eyebrow: 'DECISIONING',
    title: 'Deliver 1:1, personalized experiences',
    img: '/assets/img/dc-decisioning.svg',
    points: [
      { title: 'Multi-model orchestration and optimization',
        body: 'Analyze customer signals and other data using multiple competing models' },
      { title: 'Rank, score, predict',
        body: 'Find and have Auxia deliver the next best action for a user' },
      { title: 'Real time, at enterprise scale',
        body: '500 million decisions a day, each returned in roughly 100 milliseconds, so personalization holds at the volume of your entire user base' },
    ],
  },
  {
    eyebrow: 'PROVE',
    title: 'Measure the impact you actually caused, and prove it with data',
    img: '/assets/img/dc-measure.svg',
    points: [
      { title: 'Uplift against a control',
        body: 'Every decision is measured against an embedded global control group, giving precise counterfactuals, so you can show the revenue the program actually caused, not just raw conversions.' },
      { title: 'Bespoke reporting on demand',
        body: 'Ask natural language questions and get custom charts and specifics returned. Popular reports are saved so insight doesn’t wait on a report build.' },
      { title: 'Compare variants head to head',
        body: 'Tracks views, clicks, and CTR per variant, so you always know what’s working and what to cut.' },
    ],
  },
  {
    eyebrow: 'COMPOUND',
    title: 'The engine gets sharper the longer it runs.',
    img: '/assets/img/dc-compound.svg',
    points: [
      { title: 'Learns from every interaction',
        body: 'Results feed back into the models automatically, boosting conversion, engagement, and revenue for the programs you already run.' },
      { title: "Surfaces what you'd miss",
        body: "Signals you wouldn't have known to look for are pushed to you unprompted, so things like unusual drops or standout segments aren't ignored but acted upon." },
      { title: 'A context layer 200 billion decisions deep',
        body: 'Auxia records every decision and the reasons behind it. Compounded judgment helps marketers launch new campaigns in days, not weeks.' },
    ],
  },
]

const USE_CASES = [
  { icon: 'launch',   title: 'Onboarding and activation',
    body: 'Engage new users to reach value faster and deepen product usage' },
  { icon: 'report',   title: 'Engagement',
    body: 'Surface the right perk, milestone, or offer to keep members coming back.' },
  { icon: 'diagnose', title: 'Cross-sell and upsell',
    body: 'Move customers to the right upgrade, add-on, or other product when ready.' },
  { icon: 'refresh',  title: 'Retention',
    body: 'Spot at-risk customers and give them a reason to stay or come back.' },
]

export default function Decisioning() {
  return (
    <main>
      <DecisionHero />
      <Brands />
      <FeatureRows items={FEATURES}>
        <FeaturesBottom
          heading="Built for revenue-critical decisions across brands and regions"
          body="Auxia partners with your teams, ensuring every touchpoint is on-brand and approved before being delivered to customers or prospects."
          cards={[
            { label: 'Guardrails you set', icon: 'guardrails' },
            { label: 'Role-based access', icon: 'roles' },
            { label: 'QA and preview testing', icon: 'qa' },
            { label: 'Explainable decisions', icon: 'explainable' },
          ]}
        />
      </FeatureRows>
      <UseCaseGrid eyebrow="USE CASES"
                   heading="Engage customers across the lifecycle"
                   cards={USE_CASES} cols={4} />
      {/* The original /decisioning has NO case-studies section (verified: 0
          .section_case-studies) and NO trailing .section_cta — the prefooter
          closes the page. Its prefooter promotes Auxia Decisioning with this
          exact copy, identical to the one on /agent-studio. */}
      <Prefooter label="Auxia Decisioning" heading="Auxia Decisioning"
                 body="The engine that personalizes every customer experience that Agent Studio ships, one real-time decision at a time."
                 cta="Discover more" to="/decisioning" />
    </main>
  )
}
