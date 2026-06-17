import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

type ModuleMetric = {
  label: string;
  value: string;
  hint: string;
  icon: string;
};

type ModuleAction = {
  label: string;
  description: string;
  icon: string;
  route?: string;
  href?: string;
};

type ModuleLandingData = {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  tone: string;
  metrics: ModuleMetric[];
  actions: ModuleAction[];
  roadmap: string[];
};

@Component({
  selector: 'lib-module-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './module-landing.component.html',
})
export class ModuleLandingComponent implements OnInit {
  module: ModuleLandingData = {
    eyebrow: 'ERP module',
    title: 'Module',
    description: '',
    icon: 'apps',
    tone: 'bg-wigwe-green',
    metrics: [],
    actions: [],
    roadmap: [],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.module = data['module'] ?? this.module;
    });
  }
}
