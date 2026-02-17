import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { openCloseAnimation, rotateAnimation } from './menu-item.animations';
import { AuthService } from '@services/auth/auth.service';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [openCloseAnimation, rotateAnimation]
})
export class MenuItemComponent implements OnInit {
    @Input() menuItem: any = null;
    public isExpandable: boolean = false;
    @HostBinding('class.nav-item') isNavItem: boolean = true;
    @HostBinding('class.menu-open') isMenuExtended: boolean = false;
    public isMainActive: boolean = false;
    public isOneOfChildrenActive: boolean = false;
    public permissions;
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.permissions = this.authService.getPermissions();
        if (
            this.menuItem &&
            this.menuItem.children &&
            this.menuItem.children.length > 0
        ) {
            this.isExpandable = true;
        }
        this.calculateIsActive(this.router.url);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.calculateIsActive(event.url);
            });
    }

    public handleMainMenuAction() {
        if (this.isExpandable) {
            this.toggleMenu();
            return;
        }
        this.router.navigate(this.menuItem.path);
    }

    public toggleMenu() {
        this.isMenuExtended = !this.isMenuExtended;
    }
/*
    public calculateIsActive(url: string) {
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;
        if (this.isExpandable) {
            this.menuItem.children.forEach((item: any) => {
                //if (item.path[0] === url) {
                if (item.path?.length > 0) {
                    if (url.includes(item.path[0])) {
                        this.isOneOfChildrenActive = true;
                        this.isMenuExtended = true;
                    }
                }
            });
        } else if (this.menuItem.path[0] === url) {
            this.isMainActive = true;
        }
        if (!this.isMainActive && !this.isOneOfChildrenActive) {
            this.isMenuExtended = false;
        }
    }*/public calculateIsActive(url: string) {
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;

        // Check if THIS menu item is active
        if (!this.isExpandable && this.menuItem.path?.[0] === url) {
            this.isMainActive = true;
            return;
        }

        // If expandable, check ALL children (deep search)
        if (this.isExpandable) {
            this.isOneOfChildrenActive = this.hasActiveChild(this.menuItem, url);

            // Open the menu automatically if any child is active
            this.isMenuExtended = this.isOneOfChildrenActive;
        } else {
            this.isMenuExtended = false;
        }
    }
    private hasActiveChild(menu: any, url: string): boolean {
        if (!menu?.children) return false;

        return menu.children.some((child: any) => {
            const isDirectMatch =
                child.path?.length && url.includes(child.path[0]);

            const isDeepMatch = this.hasActiveChild(child, url); // 👈 KEY PART

            return isDirectMatch || isDeepMatch;
        });
    }


    public hasPermission(permission?: string): boolean {
        if (!permission) return true;
        return this.permissions?.includes(permission);
    }

}
