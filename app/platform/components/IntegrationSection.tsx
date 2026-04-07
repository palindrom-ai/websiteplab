'use client'

import Reveal from './Reveal'

function Logo({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className="plat-connector-icon" style={{ backgroundColor: bg }}>
      {children}
    </div>
  )
}

const SalesforceLogo = () => (
  <Logo bg="#00A1E0">
    <svg width="24" height="17" viewBox="0 0 24 24" fill="white">
      <path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"/>
    </svg>
  </Logo>
)

const SlackLogo = () => (
  <Logo bg="#4A154B">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M5.04 15.16a2.53 2.53 0 0 1-2.52 2.52A2.53 2.53 0 0 1 0 15.16a2.53 2.53 0 0 1 2.52-2.52h2.52v2.52zm1.27 0a2.53 2.53 0 0 1 2.52-2.52 2.53 2.53 0 0 1 2.52 2.52v6.32A2.53 2.53 0 0 1 8.83 24a2.53 2.53 0 0 1-2.52-2.52v-6.32zM8.83 5.04a2.53 2.53 0 0 1-2.52-2.52A2.53 2.53 0 0 1 8.83 0a2.53 2.53 0 0 1 2.52 2.52v2.52H8.83zm0 1.27a2.53 2.53 0 0 1 2.52 2.52 2.53 2.53 0 0 1-2.52 2.52H2.52A2.53 2.53 0 0 1 0 8.83a2.53 2.53 0 0 1 2.52-2.52h6.31zm10.13 2.52a2.53 2.53 0 0 1 2.52-2.52A2.53 2.53 0 0 1 24 8.83a2.53 2.53 0 0 1-2.52 2.52h-2.52V8.83zm-1.27 0a2.53 2.53 0 0 1-2.52 2.52 2.53 2.53 0 0 1-2.52-2.52V2.52A2.53 2.53 0 0 1 15.17 0a2.53 2.53 0 0 1 2.52 2.52v6.31zm-2.52 10.13a2.53 2.53 0 0 1 2.52 2.52A2.53 2.53 0 0 1 15.17 24a2.53 2.53 0 0 1-2.52-2.52v-2.52h2.52zm0-1.27a2.53 2.53 0 0 1-2.52-2.52 2.53 2.53 0 0 1 2.52-2.52h6.31A2.53 2.53 0 0 1 24 15.17a2.53 2.53 0 0 1-2.52 2.52h-6.31z"/>
    </svg>
  </Logo>
)

const JiraLogo = () => ( <Logo bg="#0052CC"><svg width="18" height="20" viewBox="0 0 20 22" fill="white"><path d="M9.53 0c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V.84A.84.84 0 0 0 19.16 0H9.53zM4.77 4.8a4.36 4.36 0 0 0 4.34 4.34h1.78v1.72a4.36 4.36 0 0 0 4.34 4.34V5.63a.84.84 0 0 0-.83-.83H4.77zM0 9.6a4.35 4.35 0 0 0 4.34 4.34h1.78v1.72A4.35 4.35 0 0 0 10.47 20v-9.57a.84.84 0 0 0-.84-.83H0z"/></svg></Logo> )
const ZendeskLogo = () => ( <Logo bg="#03363D"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11.09 0v16.36L0 22h11.09V0zm1.82 2v22l11.09-5.64V2H12.91zM0 2c0 3.07 2.48 5.55 5.55 5.55S11.09 5.07 11.09 2H0zm12.91 20c0-3.07 2.48-5.55 5.55-5.55S24 18.93 24 22H12.91z"/></svg></Logo> )
const PagerDutyLogo = () => ( <Logo bg="#06AC38"><svg width="14" height="20" viewBox="0 0 14 22" fill="white"><path d="M10.97 0C6.11 0 2.58 2.91 2.58 7.68c0 4.44 3.15 7.27 8.05 7.27h.69V19.6H14V0h-3.03zm-.34 12.11c-3.2 0-4.95-1.95-4.95-4.84 0-3.13 2.01-4.81 5.06-4.81h1.22v9.65h-1.33zM0 16.37h3.61V22H0v-5.63z"/></svg></Logo> )
const GitHubLogo = () => ( <Logo bg="#24292F"><svg width="20" height="20" viewBox="0 0 16 16" fill="white"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 4.01 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg></Logo> )
const NotionLogo = () => ( <Logo bg="#1C1917"><svg width="18" height="20" viewBox="0 0 24 24" fill="white"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg></Logo> )
const GoogleLogo = () => ( <Logo bg="white"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></Logo> )
const MicrosoftLogo = () => ( <Logo bg="white"><svg width="18" height="18" viewBox="0 0 22 22"><rect fill="#F25022" x="0" y="0" width="10" height="10"/><rect fill="#7FBA00" x="12" y="0" width="10" height="10"/><rect fill="#00A4EF" x="0" y="12" width="10" height="10"/><rect fill="#FFB900" x="12" y="12" width="10" height="10"/></svg></Logo> )
const ConfluenceLogo = () => ( <Logo bg="#1868DB"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M.87 18.26c-.2.34-.43.76-.66 1.13a.88.88 0 0 0 .31 1.2l4.13 2.53a.88.88 0 0 0 1.22-.33c.2-.36.46-.84.74-1.36 1.89-3.48 3.78-3.05 7.21-1.37l4.17 2.05a.88.88 0 0 0 1.17-.41l2.17-4.6a.88.88 0 0 0-.42-1.15c-1.16-.56-3.45-1.69-4.18-2.05-5.12-2.52-9.49-2.13-15.86 4.36zm22.26-12.52c.2-.34.43-.76.66-1.13a.88.88 0 0 0-.31-1.2L19.35.88a.88.88 0 0 0-1.22.33c-.2.36-.46.84-.74 1.36-1.89 3.48-3.78 3.05-7.21 1.37L5.99 1.9a.88.88 0 0 0-1.17.41L2.65 6.91a.88.88 0 0 0 .42 1.15c1.16.56 3.45 1.69 4.18 2.05 5.13 2.52 9.49 2.13 15.88-4.37z"/></svg></Logo> )
const ServiceNowLogo = () => ( <Logo bg="#293E40"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm0 17.38a5.1 5.1 0 0 1-3.67-1.55.42.42 0 0 1 .03-.63 6.84 6.84 0 0 0 7.28 0c.2.16.21.46.03.63A5.1 5.1 0 0 1 12 18.88z"/></svg></Logo> )
const HubSpotLogo = () => ( <Logo bg="#FF7A59"><svg width="18" height="20" viewBox="0 0 20 22" fill="white"><path d="M14.59 8.48V5.55a2.33 2.33 0 0 0 1.34-2.1 2.36 2.36 0 0 0-4.72 0c0 .9.5 1.67 1.25 2.07v2.96a5.78 5.78 0 0 0-2.86 1.35L2.98 4.82a2.83 2.83 0 0 0 .07-.6A2.82 2.82 0 1 0 .23 7a2.8 2.8 0 0 0 1.55-.47l6.48 4.94a5.79 5.79 0 0 0 .07 5.58l-2.02 2.02a2.34 2.34 0 0 0-.69-.11 2.37 2.37 0 1 0 2.37 2.37c0-.24-.04-.47-.1-.69l1.98-1.97a5.82 5.82 0 1 0 4.72-10.19z"/></svg></Logo> )

const CONNECTORS = [
  { name: 'Salesforce', C: SalesforceLogo },
  { name: 'Slack', C: SlackLogo },
  { name: 'Jira', C: JiraLogo },
  { name: 'Zendesk', C: ZendeskLogo },
  { name: 'PagerDuty', C: PagerDutyLogo },
  { name: 'GitHub', C: GitHubLogo },
  { name: 'Notion', C: NotionLogo },
  { name: 'Google', C: GoogleLogo },
  { name: 'Microsoft', C: MicrosoftLogo },
  { name: 'Confluence', C: ConfluenceLogo },
  { name: 'ServiceNow', C: ServiceNowLogo },
  { name: 'HubSpot', C: HubSpotLogo },
]

export default function IntegrationSection() {
  return (
    <section className="plat-integrations">
      <Reveal>
        <div className="plat-integrations-header">
          <p className="plat-label">Integrations</p>
          <h2 className="plat-h2">Your entire stack, one context graph</h2>
          <p className="plat-body">
            Cortex connects to the tools your teams already use.
            Every decision, ticket, deal, and incident feeds into
            a unified graph that improves with each interaction.
          </p>
        </div>
      </Reveal>

      <Reveal stagger={0.05}>
        <div className="plat-connector-grid">
          {CONNECTORS.map((c) => {
            const LogoC = c.C
            return (
              <div key={c.name} className="plat-connector-item">
                <LogoC />
                <span className="plat-connector-name">{c.name}</span>
              </div>
            )
          })}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="plat-integrations-note">
          100+ connectors available. Custom integrations via REST API and webhooks.
        </p>
      </Reveal>
    </section>
  )
}
