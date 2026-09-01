export interface BankAccount {
  bank: string;
  holder: string;
  accountNumber: string;
}

export interface RegistryLink {
  title: string;
  url: string;
  icon?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface CoupleConfig {
  theme?: {
    primary?: string;
    secondary?: string;
    background?: string;
    accent?: string;
  };
  parents?: {
    brideFather?: string;
    brideMother?: string;
    groomFather?: string;
    groomMother?: string;
  };
  contacts?: {
    bride?: { name: string; phone: string };
    groom?: { name: string; phone: string };
    dayOfEvent?: { name: string; phone: string };
  };
  dressCode?: {
    type: string;
    description: string;
    restrictedColors?: string;
  };
  musicUrl?: string;
  timeline?: TimelineItem[];
  registryLinks?: RegistryLink[];
  bankAccounts?: BankAccount[];
  photos?: {
    cover?: string;
    album?: string[];
    end?: string;
  };
  adultsOnly?: boolean;
  adultsOnlyMessage?: string;
  countdownDate?: string;
  monogram?: string;
}

export interface Couple {
  id: number;
  slug: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  reception_time?: string;
  ceremony_address?: string;
  reception_address?: string;
  ceremony_maps_url?: string;
  reception_maps_url?: string;
  bible_verse?: string;
  bible_citation?: string;
  access_password?: string;
  rsvp_deadline?: string;
  config: CoupleConfig;
  created_at?: string;
}

export interface Guest {
  id?: number;
  group_id?: number;
  name: string;
  type: 'principal' | 'acompanante' | 'familiar';
  attendance: boolean | null;
  arrived: boolean | null;
}

export interface InvitationGroup {
  id?: number;
  couple_id?: number;
  uuid: string;
  group_name: string;
  titular_name?: string;
  attendance: boolean | null;
  message?: string;
  is_couple?: boolean;
  is_guard?: boolean;
  guests?: Guest[];
}

export interface FullInvitation {
  couple: Couple;
  group: InvitationGroup;
  uuid: string;
}
