import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'sb-not-found',
  imports: [
    Button,
    RouterLink,
  ],
  template: `
    <div class="flex flex-col items-center justify-center text-center px-4 bg-inherit mt-8">
      <!-- Error Icon -->
      <i class="bi bi-exclamation-triangle-fill text-yellow-500 text-6xl mb-4"></i>

      <!-- Error Message -->
      <h1 class="text-5xl font-bold text-gray-800 dark:text-white mb-2">404 - Page Not Found</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-xl">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <!-- Home Button -->
      <div class="mt-8">
        <p-button routerLink="/">
          <i class="bi bi-house-fill mr-2"></i>
          Go Home
        </p-button>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
