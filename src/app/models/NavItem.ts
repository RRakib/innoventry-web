export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    cssClass? : string;
    children?: NavItem[];    
    permission?: Array<string>;
}
