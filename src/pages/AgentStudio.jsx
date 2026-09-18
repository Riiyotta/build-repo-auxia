import AgentHero from '../components/AgentHero'
import Brands from '../components/Brands'
import FeatureRows from '../components/FeatureRows'
import FeaturesBottom from '../components/FeaturesBottom'
import UseCaseGrid from '../components/UseCaseGrid'
import Prefooter from '../components/Prefooter'
import CTA from '../components/CTA'

/**
 * /agent-studio — section inventory measured on the live original, in order:
 *   1 .section_agent-hero   869px  ink
 *   2 .section_brands       260px  paper
 *   3 .section_features    5476px  paper  (6 alternating rows + features_bottom)
 *   4 .section_grid        1064px  #fefdf5
 *   5 .case-studies_slider  531px  ink
 *   6 .section_prefooter    435px  blue
 *   7 .section_cta          562px  blue
 */
const FEATURES = [
  {
    eyebrow: 'INTEGRATE',
    title: 'Bring all your tools into one place',
    img: '/assets/img/as-integrate.png',
    points: [
      { title: 'You choose what we connect to',
        body: 'Grant Auxia access to the systems you want, so it only ever reaches where you allow.' },
      { title: 'Your data, pulled in and ready',
        body: 'Auxia ingests and unifies the data from the tools you connect, so agents work from the full, up to date picture instead of a stale export.' },
      { title: 'One pane over your stack',
        body: 'See, configure, and operate your CDP, ESP, orchestrator, and warehouse from one surface, including campaigns already running in other tools.' },
    ],
  },
  {
    eyebrow: 'BUILD PLAYBOOKS',
    title: 'Turn your work into playbooks agents can run',
    img: '/assets/img/as-playbooks.png',
    points: [
      { title: 'Playbooks you reuse',
        body: 'Capture any process as a playbook. Set your triggers, steps, approvers, and guardrails, then let agents run it for you every time.' },
      { title: 'Reusable building blocks',
        body: 'Your best briefs, templates, and skills live in the library and drop into any playbook, so nothing gets rebuilt from scratch.' },
      { title: 'Reports when you want them',
        body: 'Weekly reviews, QBRs, and retros run on a schedule you set and produce the output you want, so reporting goes from a scramble to a recurring item in your inbox.' },
    ],
  },
  {
    eyebrow: 'EXECUTE',
    title: 'Agents run the work, on a schedule or on-demand',
    img: '/assets/img/as-execute.svg',
    points: [
      { title: 'Reads and acts in place',
        body: "Agents don't just read your systems, they take action in them, building and updating campaigns where they already live." },
      { title: 'Build from a brief in plain language',
        body: 'Describe the objective and agents assemble the strategy, brief, experiment design, and content; your team reviews, not assembles, the output.' },
      { title: 'Works with you, not against you',
        body: 'You and your team review the work the agents execute for you, freeing your time to focus on creative judgment, not execution.' },
    ],
  },
  {
    eyebrow: 'COLLABORATE',
    title: 'Marketing is multiplayer, so your workspace is too.',
    img: '/assets/img/as-collab.png',
    points: [
      { title: 'The whole team, one context',
        body: 'Brand, ops, legal, and creative work the same campaign with the same knowledge, so nothing restarts from scratch in a Slack thread.' },
      { title: 'Turns problems into proposals',
        body: 'When someone raises an issue, the agent summarizes it, brings a suggested resolution, and lets you approve, reject, or comment.' },
      { title: 'Notifies and gathers input',
        body: 'The agent engages each approver and collects the responses, so no one chases sign-off and everyone can see approval status.' },
    ],
  },
  {
    eyebrow: 'STAY IN CONTROL',
    title: 'You set the boundaries. Agents work inside them',
    img: '/assets/img/as-control.svg',
    points: [
      { title: 'Your brand and rules, enforced',
        body: "Brand voice, approved claims, and policy live as guardrails the agents can't cross, so everything they produce stays on-brand and compliant." },
      { title: 'Autonomy you dial in',
        body: "Set the agent's autonomy for a given task or project, so control expands only as much as trust does." },
      { title: 'Set the objective, not the steps',
        body: 'Tell agents the outcome you want and they work out the how, so you direct the work instead of scripting every task.' },
    ],
  },
  {
    eyebrow: 'UNDERSTAND THE CONTEXT',
    title: 'The intelligence compounds, not the work',
    img: '/assets/img/as-context.svg',
    points: [
      { title: 'Institutional memory',
        body: 'Every correction or note from your team feeds the context graph; your guidance is remembered and won’t need to be repeated.' },
      { title: 'A widening lead',
        body: "Six months in Agent Studio knows your voice, segments, and rules. Twelve months in it's a moat a new competitor can't close." },
      { title: 'Faster every cycle',
        body: 'Past learnings means future projects have less rework and more reuse, making each campaign smarter than the last.' },
    ],
  },
]

const USE_CASES = [
  { icon: 'launch',   title: 'Launch or revamp a series',
    body: 'Go from brief to experiment design to content to setup in SFMC or Braze, end to end.' },
  { icon: 'diagnose', title: 'Diagnose and act',
    body: 'Surface where a funnel leaks or retention drops, then stand up a campaign to reverse it.' },
  { icon: 'approve',  title: 'Run approvals without chasing',
    body: 'Route each step to brand, legal, and product, and get back one reconciled recommendation.' },
  { icon: 'refresh',  title: 'Refresh a live campaign',
    body: 'Update copy, naming, or pricing across your ESP by describing the change, then push it live.' },
  { icon: 'report',   title: 'Recurring performance writeups',
    body: "Auxia turns every connected system's data into a weekly update, in your voice and ready to share." },
  { icon: 'board',    title: 'QBRs and Board Reports',
    body: 'Agents pull the data, write the commentary, and assemble the materials for every deliverable.' },
]

export default function AgentStudio() {
  return (
    <main>
      <AgentHero />
      <Brands />
      <FeatureRows items={FEATURES}>
        <FeaturesBottom
          heading="Built for enterprise marketing teams, at the autonomy you set"
          body="Dedicated experts support your team through onboarding and ongoing use, while agents work with you and the level of oversight you're comfortable with."
          cards={[
            { label: 'Guardrails you set', icon: 'guardrails' },
            { label: 'Nothing ships without approval', icon: 'approval' },
            { label: 'Role-based access', icon: 'roles' },
            { label: 'Enterprise-grade security (SOC 2, GDPR)', icon: 'security' },
          ]}
        />
      </FeatureRows>
      <UseCaseGrid eyebrow="USE CASES"
                   heading="Do the work that fills your team's week"
                   cards={USE_CASES} cols={3} />
      {/* The original /agent-studio has NO case-studies section. */}
      <Prefooter label="Auxia Decisioning" heading="Auxia Decisioning"
                 body="The engine that personalizes every customer experience that Agent Studio ships, one real-time decision at a time."
                 cta="Discover more" to="/decisioning" />
      <CTA />
    </main>
  )
}
