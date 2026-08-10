// ==UserScript==
// @name         Brybry Pokemas Enhancer
// @namespace    https://pokemon.brybry.ch/
// @version      1.11.120
// @description  Adds readable sync-grid labels, persistent builds, sorting and skill filters to the Sync Pair picker.
// @match        https://pokemon.brybry.ch/masters/duo.html*
// @homepageURL  https://github.com/charlie5188/brybry-pokemas-enhancer
// @supportURL   https://github.com/charlie5188/brybry-pokemas-enhancer/issues
// @downloadURL  https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js
// @updateURL    https://raw.githubusercontent.com/charlie5188/brybry-pokemas-enhancer/main/brybry-enhancer.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

// src/index.js
(() => {
  "use strict";
  const BRYBRY_ENHANCER_CSS = `html[data-be-spoiler-protection] #lastReleasedPairs {
display: none !important;
    }

/* Brybry adds .hidden while scrolling down. Keep the pair picker available as
   a stable page action instead of making users reverse-scroll to recover it. */
#openPairSearchBtn.fab-btn,
#openPairSearchBtn.fab-btn.hidden {
bottom: max(20px, calc(env(safe-area-inset-bottom) + 12px));
opacity: 1 !important;
pointer-events: auto !important;
right: max(20px, calc(env(safe-area-inset-right) + 12px));
transform: none !important;
visibility: visible !important;
    }

#openPairSearchBtn.fab-btn:hover,
#openPairSearchBtn.fab-btn.hidden:hover {
transform: translateY(-2px) !important;
    }

.brybry-tile-label {
pointer-events: none;
fill: #fff;
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif;
font-weight: 800;
letter-spacing: -0.2px;
paint-order: stroke fill;
stroke: rgba(0, 0, 0, .78);
stroke-width: 2.1px;
stroke-linejoin: round;
    }

#grid .be-move-level-shade {
fill: #000;
opacity: 0;
pointer-events: none;
transition: opacity .16s ease;
    }

#grid g[data-cell-id].be-move-level-disabled .be-move-level-shade {
opacity: .45;
    }

#grid g[data-cell-id].be-move-level-disabled.be-move-level-hovered .be-move-level-shade {
opacity: .28;
    }

input[name="energy-radio"]:disabled + .radio-tile {
filter: grayscale(.8) brightness(.72);
opacity: .48;
    }

input[name="energy-radio"]:disabled + .radio-tile .radio-tile-label {
cursor: not-allowed;
    }

    body > .tooltip {
box-sizing: border-box;
font-size: 13px;
line-height: 1.35;
padding: 8px 9px;
width: min(300px, calc(100vw - 16px));
    }

    .tooltip .be-related-move {
background: rgba(105, 190, 218, .14);
border: 1px solid rgba(145, 214, 235, .28);
border-left: 3px solid rgba(145, 214, 235, .82);
border-radius: 6px;
color: rgba(255, 255, 255, .86);
font-size: 11px;
line-height: 1.4;
margin: 8px 0 0;
padding: 6px 8px;
white-space: pre-line;
    }

    .tooltip .be-related-move strong {
color: #fff;
display: block;
font-size: 11.5px;
line-height: 1.3;
margin-bottom: 2px;
    }

    .tooltip .be-related-move span { display: block; }
    .tooltip .be-related-move .be-related-move-stats {
color: rgba(255, 255, 255, .72);
font-weight: 700;
margin-top: 3px;
    }

    .tooltip .be-power-multiplier,
    .tooltip .be-field-duration {
background: rgba(105, 190, 218, .14);
border: 1px solid rgba(145, 214, 235, .28);
border-radius: 6px;
color: rgba(255, 255, 255, .9);
display: block;
font: 750 11.5px/1.25 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
margin: 8px 0 0;
padding: 6px 8px;
    }

    .tooltip .be-required-move-level {
align-items: center;
display: inline-flex;
margin-right: 4px;
vertical-align: middle;
    }

    .tooltip .be-field-duration {
background: rgba(239, 184, 75, .13);
border-color: rgba(244, 198, 106, .3);
    }

    .tooltip .be-required-move-level-icon {
display: block;
height: 24px;
object-fit: contain;
width: 24px;
    }

    #pairSearchModal .be-picker-tools {
display: flex;
flex-wrap: wrap;
gap: 8px;
align-items: center;
margin: 0 0 10px;
    }

    /* Keep wheel and touch scrolling inside the open picker when one of its
       scroll regions reaches an edge. */
    #pairSearchModal,
    #pairSearchModal .modal-body,
    #pairSearchModal #pairSearchResults,
    #pairSearchModal .be-filter-sidebar,
    #pairSearchModal .be-skill-suggestions {
overscroll-behavior: contain;
    }

#pairSearchModal .be-active-filter-tags {
display: flex;
flex: 1 0 100%;
flex-wrap: wrap;
gap: 3px;
min-width: 0;
    }

    #pairSearchModal .be-active-filter-tags[hidden] { display: none; }

    #pairSearchModal .be-active-filter-tag {
appearance: none;
align-items: center;
background: rgba(39, 117, 139, .1);
border: 1px solid rgba(39, 117, 139, .38);
border-radius: 999px;
color: #225f70;
cursor: pointer;
display: inline-flex;
font: 700 12px/1.2 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 5px;
max-width: 100%;
padding: 5px 7px 5px 9px;
    }

    #pairSearchModal .be-active-filter-tag[data-be-filter-state="exclude"] {
background: rgba(170, 68, 68, .08);
border-color: rgba(170, 68, 68, .34);
color: #8b3d3d;
    }

    #pairSearchModal .be-active-filter-tag > span:first-child {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
    }

    #pairSearchModal .be-active-filter-tag-remove {
font-size: 15px;
line-height: .8;
    }

    #pairSearchModal .be-filter-operator {
align-self: center;
color: #51727c;
font: 600 15px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    #pairSearchModal .be-filter-match-mode {
align-items: center;
color: #51727c;
display: inline-flex;
font: 750 12px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 5px;
margin-left: auto;
    }

    #pairSearchModal .be-filter-match-mode select {
background: #fff;
border: 1px solid #9bc8d2;
border-radius: 7px;
color: #24586a;
font: inherit;
min-height: 30px;
padding: 4px 7px;
    }

    #pairSearchModal .be-filter-button {
appearance: none;
border: 1px solid #6aafc0;
border-radius: 999px;
background: rgba(255, 255, 255, .94);
color: #226478;
cursor: pointer;
font: 700 14px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
padding: 8px 12px;
    }

    #pairSearchModal .be-clear-button {
align-self: center;
appearance: none;
background: transparent;
border: 0;
border-radius: 6px;
color: #51727c;
cursor: pointer;
font: 750 12px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
padding: 7px 8px;
    }

    #pairSearchModal .be-clear-button:hover { background: rgba(44, 104, 120, .08); color: #24586a; }

    #pairSearchModal .be-filter-button[aria-expanded="true"] {
color: #fff;
background: #27758b;
border-color: #27758b;
    }

    #pairSearchModal :is(
      .be-filter-button,
      .be-clear-button,
      .be-sort-direction,
      .be-view-button,
      .be-chip,
      .be-skill-category-chip,
      .be-skill-token,
      .be-active-filter-tag,
      .be-pair-result
    ):focus-visible,
    .be-settings-button:focus-visible,
    .be-spoiler-banner button:focus-visible {
outline: 3px solid rgba(54, 126, 201, .45);
outline-offset: 2px;
    }

    #pairSearchModal .be-filter-count {
color: #51727c;
font: 700 13px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
font-variant-numeric: tabular-nums;
white-space: nowrap;
    }

    #pairSearchModal .be-results-toolbar {
align-items: center;
display: flex;
flex: 0 0 auto;
gap: 10px;
justify-content: space-between;
margin-bottom: 8px;
min-height: 40px;
    }

    #pairSearchModal .be-sort-control {
align-items: center;
display: flex;
gap: 7px;
min-width: 0;
    }

    #pairSearchModal .be-sort-label {
color: #51727c;
font: 700 12px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
white-space: nowrap;
    }

    #pairSearchModal .be-sort-select {
appearance: auto;
background: #fff;
border: 1px solid #9bc8d2;
border-radius: 8px;
color: #24586a;
font: 700 13px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
height: 40px;
max-width: 230px;
min-width: 0;
padding: 0 10px;
    }

    #pairSearchModal .be-sort-direction {
align-items: center;
appearance: none;
background: #fff;
border: 1px solid #9bc8d2;
border-radius: 8px;
color: #226478;
cursor: pointer;
display: inline-flex;
flex: 0 0 40px;
height: 40px;
justify-content: center;
padding: 0;
    }

    #pairSearchModal .be-sort-direction svg {
fill: none;
height: 20px;
stroke: currentColor;
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 2;
transition: transform 140ms ease;
width: 20px;
    }

    #pairSearchModal .be-sort-direction[data-direction="asc"] svg { transform: rotate(180deg); }
    #pairSearchModal .be-sort-direction:active { transform: scale(.96); }

    #pairSearchModal .be-view-toggle {
background: #edf7f9;
border-radius: 10px;
box-shadow: inset 0 0 0 1px rgba(39, 117, 139, .25);
display: inline-flex;
flex: 0 0 auto;
padding: 3px;
    }

    #pairSearchModal .be-view-button {
appearance: none;
align-items: center;
background: transparent;
border: 0;
border-radius: 7px;
color: #51727c;
cursor: pointer;
display: inline-flex;
height: 40px;
justify-content: center;
padding: 0;
transition: background-color 120ms ease, box-shadow 120ms ease, color 120ms ease, transform 80ms ease;
width: 40px;
    }

    #pairSearchModal .be-view-button[aria-pressed="true"] {
background: #fff;
box-shadow: 0 1px 3px rgba(24, 73, 86, .18);
color: #226478;
    }

    #pairSearchModal .be-view-button:active { transform: scale(.96); }
    #pairSearchModal .be-view-button svg {
fill: none;
height: 20px;
stroke: currentColor;
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 2;
width: 20px;
    }

    #pairSearchModal .be-filter-panel {
display: none;
padding: 12px 0 14px;
border-bottom: 1px solid rgba(44, 104, 120, .18);
margin-bottom: 10px;
    }

    #pairSearchModal .be-filter-panel[data-open="true"] { display: block; }

    #pairSearchModal .be-skill-search-section {
margin: 12px 0 2px;
    }

    #pairSearchModal .be-name-search-section { margin: 2px 0 0; }

    #pairSearchModal .be-name-search-section > #pairSearchInput {
background: #fff;
border: 1px solid rgba(44, 104, 120, .34);
border-radius: 8px;
box-shadow: none;
box-sizing: border-box;
color: #234d59;
font: 500 14px/1.3 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
height: 40px;
margin: 0;
outline: 0;
padding: 0 10px;
width: 100%;
    }

    #pairSearchModal .be-name-search-section > #pairSearchInput:focus {
border-color: #27758b;
box-shadow: 0 0 0 3px rgba(39, 117, 139, .14);
    }

    #pairSearchModal .be-skill-combobox {
position: relative;
z-index: 6;
    }

    #pairSearchModal .be-skill-token-field {
align-items: center;
border: 1px solid rgba(44, 104, 120, .34);
border-radius: 8px;
box-sizing: border-box;
display: flex;
flex-wrap: wrap;
gap: 5px;
min-height: 40px;
padding: 5px 7px;
width: 100%;
    }

    #pairSearchModal label.be-filter-title { display: block; }

    #pairSearchModal .be-skill-token-field:focus-within {
border-color: #27758b;
box-shadow: 0 0 0 3px rgba(39, 117, 139, .14);
    }

    #pairSearchModal .be-skill-search-input {
background: transparent;
border: 0;
box-shadow: none;
box-sizing: border-box;
color: #234d59;
flex: 1 1 150px;
font: 500 14px/1.3 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
height: 28px;
min-width: 96px;
outline: 0;
padding: 3px;
    }

    #pairSearchModal .be-skill-token {
align-items: center;
background: #e4f4f7;
border: 1px solid #8bc2cf;
border-radius: 999px;
color: #215e70;
display: inline-flex;
font: 700 12px/1.2 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 5px;
max-width: 100%;
padding: 5px 7px 5px 9px;
    }

    #pairSearchModal .be-skill-token > span:first-child {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
    }

    #pairSearchModal .be-skill-token > span:last-child { font-size: 15px; line-height: 10px; }

    #pairSearchModal .be-skill-suggestions {
background: #fff;
border: 1px solid rgba(44, 104, 120, .3);
border-radius: 8px;
box-shadow: 0 8px 24px rgba(20, 52, 61, .22);
left: 0;
list-style: none;
margin: 5px 0 0;
max-height: 280px;
overflow-y: auto;
padding: 4px;
position: absolute;
right: 0;
top: 100%;
    }

    #pairSearchModal .be-skill-suggestions[hidden] { display: none; }

    #pairSearchModal .be-skill-suggestion {
border-radius: 6px;
cursor: pointer;
display: grid;
gap: 3px;
padding: 8px 9px;
    }

    #pairSearchModal .be-skill-suggestion:hover,
    #pairSearchModal .be-skill-suggestion.is-active { background: #e9f5f7; }

    #pairSearchModal .be-skill-suggestion strong {
color: #1e5667;
font: 750 13px/1.25 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    }

    #pairSearchModal .be-skill-suggestion span {
-webkit-box-orient: vertical;
-webkit-line-clamp: 2;
color: #647d84;
display: -webkit-box;
font: 500 11px/1.35 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
overflow: hidden;
    }

    #pairSearchModal .be-skill-suggestion-empty {
color: #6c8187;
font: 600 12px/1.3 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
padding: 10px;
    }

    #pairSearchModal .be-skill-category-groups { margin-top: 12px; }

    #pairSearchModal .be-skill-battle-grid { display: grid; gap: 0; }

    #pairSearchModal .be-skill-category-row {
display: flex;
flex-wrap: wrap;
gap: 5px;
    }

    #pairSearchModal .be-skill-category-row--grouped {
display: grid;
gap: 5px;
    }

    #pairSearchModal .be-skill-category-cluster {
align-items: center;
display: flex;
flex-wrap: wrap;
gap: 5px;
min-width: 0;
    }

    #pairSearchModal .be-skill-category-chip {
align-items: center;
background: #fff;
border: 1px solid #9ac7d1;
border-radius: 8px;
color: #286577;
display: inline-flex;
font: 700 14px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 6px;
min-height: 34px;
padding: 6px 9px;
position: relative;
    }

    #pairSearchModal .be-skill-category-chip:hover { background: #eff8fa; }

    #pairSearchModal .be-skill-category-chip--detail {
background: #f7fafb;
font-size: 12px;
min-height: 28px;
padding: 5px 7px;
    }

    #pairSearchModal .be-skill-category-chip--icon-only {
border-style: solid;
justify-content: center;
padding: 4px;
width: 34px;
    }

    #pairSearchModal .be-skill-category-chip--icon-only .be-skill-category-label {
clip: rect(0 0 0 0);
clip-path: inset(50%);
height: 1px;
overflow: hidden;
position: absolute;
white-space: nowrap;
width: 1px;
    }

    #pairSearchModal .be-skill-category-chip--compact-label .be-skill-category-label {
font-size: 16px;
    }

    #pairSearchModal .be-skill-category-chip--icon-only > img {
height: 22px;
object-fit: contain;
width: 22px;
    }

    #pairSearchModal .be-skill-category-chip--ex-detail { overflow: visible; }

    #pairSearchModal .be-skill-category-ex-badge {
align-items: center;
background: #6b46c1;
border: 1px solid #fff;
border-radius: 5px;
color: #fff;
display: inline-flex;
font: 850 7px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
height: 11px;
justify-content: center;
letter-spacing: -.02em;
min-width: 14px;
padding: 0 2px;
position: absolute;
left: -3px;
top: -4px;
z-index: 1;
    }

    #pairSearchModal .be-skill-category-chip--stat-direction {
gap: 1px;
width: 44px;
    }

    #pairSearchModal .be-skill-category-chip--directional-icon {
gap: 3px;
min-width: 44px;
padding: 4px 6px;
width: auto;
    }

    #pairSearchModal .be-stat-direction {
color: #3f7180;
font: 700 15px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
margin-left: -1px;
    }

    #pairSearchModal .be-skill-category-chip--stat-direction[data-be-filter-state="include"] .be-stat-direction,
    #pairSearchModal .be-skill-category-chip--stat-direction[data-be-filter-state="exclude"] .be-stat-direction {
color: currentColor;
    }

    #pairSearchModal .be-skill-category-chip img,
    #pairSearchModal .be-skill-category-icon,
    #pairSearchModal .be-skill-category-icon svg {
height: 17px;
width: 17px;
    }

    #pairSearchModal .be-skill-category-icon {
display: inline-flex;
    }

    #pairSearchModal .be-skill-category-icon svg {
fill: none;
stroke: currentColor;
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 2;
    }

    #pairSearchModal .be-skill-category-icon-pair {
align-items: center;
display: inline-flex;
gap: 2px;
    }

    #pairSearchModal .be-skill-category-icon-pair > img {
height: 20px;
width: 20px;
    }

    #pairSearchModal label.be-filter-title {
color: #24586a;
font: 800 12px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
letter-spacing: .04em;
margin: 0 0 7px;
text-transform: none;
    }

    #pairSearchModal details.be-filter-section {
border-bottom: 1px solid rgba(44, 104, 120, .16);
margin: 0;
scroll-margin-top: 10px;
    }

    #pairSearchModal details.be-filter-section.be-filter-section--jump-target {
animation: be-filter-jump-highlight 1.35s ease-out;
    }

    @keyframes be-filter-jump-highlight {
0%, 35% { box-shadow: 0 0 0 3px rgba(37, 132, 157, .3); }
100% { box-shadow: 0 0 0 3px rgba(37, 132, 157, 0); }
    }

    #pairSearchModal details.be-filter-section > summary.be-accordion-trigger {
align-items: center;
border-radius: 6px;
color: #285b6a;
cursor: pointer;
display: flex;
font: 750 13px/1.2 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
justify-content: space-between;
letter-spacing: 0;
list-style: none;
margin: 0;
min-height: 40px;
padding: 8px 2px;
text-transform: none;
    }

    #pairSearchModal details.be-filter-section > summary.be-accordion-trigger::-webkit-details-marker { display: none; }
    #pairSearchModal details.be-filter-section > summary.be-accordion-trigger:hover { background: rgba(44, 104, 120, .055); }
    #pairSearchModal details.be-filter-section > summary.be-accordion-trigger:focus-visible {
box-shadow: inset 0 0 0 2px rgba(39, 117, 139, .55);
outline: 0;
    }

    #pairSearchModal .be-accordion-heading {
align-items: center;
display: inline-flex;
gap: 7px;
min-width: 0;
    }

    #pairSearchModal .be-accordion-heading-icon {
flex: 0 0 auto;
height: 24px;
object-fit: contain;
width: 24px;
    }

    #pairSearchModal .be-accordion-chevron {
fill: none;
flex: 0 0 auto;
height: 16px;
stroke: #5c7d86;
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 2;
transition: transform 180ms ease;
width: 16px;
    }

    #pairSearchModal details.be-filter-section[open] > summary .be-accordion-chevron { transform: rotate(180deg); }

    #pairSearchModal .be-accordion-content {
animation: be-accordion-in 160ms ease-out;
padding: 0 2px 12px;
    }

    @keyframes be-accordion-in {
from { opacity: 0; transform: translateY(-3px); }
to { opacity: 1; transform: translateY(0); }
    }

    #pairSearchModal .be-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }

    #pairSearchModal .be-filter-anchor {
align-items: center;
appearance: none;
background: transparent;
border: 0;
border-radius: 5px;
color: #28738a;
cursor: pointer;
display: inline-flex;
font: 750 12px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
min-height: 28px;
padding: 5px 6px;
text-decoration: underline;
text-underline-offset: 2px;
    }

    #pairSearchModal .be-filter-anchor:hover { background: rgba(44, 104, 120, .08); }
    #pairSearchModal .be-filter-anchor:focus-visible {
box-shadow: 0 0 0 2px rgba(39, 117, 139, .55);
outline: 0;
    }

    @media (prefers-reduced-motion: reduce) {
#pairSearchModal details.be-filter-section.be-filter-section--jump-target { animation: none; box-shadow: 0 0 0 3px rgba(37, 132, 157, .3); }
    }

    #pairSearchModal .be-chip {
appearance: none;
align-items: center;
background: #fff;
border: 1px solid #9bc8d2;
border-radius: 8px;
color: #2d6272;
cursor: pointer;
display: inline-flex;
font: 700 14px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 6px;
min-height: 34px;
min-width: 0;
padding: 6px 9px;
position: relative;
width: auto;
    }

    #pairSearchModal .be-chip--detail {
background: #f7fafb;
font-size: 12px;
min-height: 28px;
padding: 5px 7px;
    }

    #pairSearchModal .be-chip--detail .be-chip-icon {
height: 17px;
width: 17px;
    }

    #pairSearchModal .be-chip[data-be-filter-state="include"],
    #pairSearchModal .be-skill-category-chip[data-be-filter-state="include"] {
background: #d9f1e3;
border-color: #2d8a58;
box-shadow: inset 0 0 0 1px #2d8a58;
color: #17583a;
    }

    #pairSearchModal .be-chip[data-be-filter-state="exclude"],
    #pairSearchModal .be-skill-category-chip[data-be-filter-state="exclude"] {
background: #fae2e5;
border-color: #c64856;
box-shadow: inset 0 0 0 1px #c64856;
color: #852d38;
    }

    #pairSearchModal .be-filter-state-mark {
align-items: center;
border: 2px solid #fff;
border-radius: 50%;
box-shadow: 0 1px 3px rgba(24, 51, 59, .25);
color: #fff;
display: none;
font: 900 10px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
height: 17px;
justify-content: center;
pointer-events: none;
position: absolute;
right: -5px;
top: -5px;
width: 17px;
z-index: 3;
    }

    #pairSearchModal [data-be-filter-state="include"] > .be-filter-state-mark {
background: #218351;
display: flex;
    }

    #pairSearchModal [data-be-filter-state="exclude"] > .be-filter-state-mark {
background: #c33f4d;
display: flex;
    }

    #pairSearchModal .be-chip-icon {
display: block;
flex: 0 0 auto;
height: 19px;
object-fit: contain;
pointer-events: none;
width: 19px;
    }

    #pairSearchModal .be-chip[data-be-group="role"]:has(.be-role-variant-icon) {
padding-inline: 5px;
width: 42px;
    }

    #pairSearchModal .be-chip .be-role-variant-icon {
height: 22px;
max-width: 32px;
width: auto;
    }

    #pairSearchModal .be-origin-mark-icon {
filter: grayscale(1) brightness(0);
height: 21px;
width: 21px;
    }

    #pairSearchModal .be-chip-symbol {
color: #111;
font: 900 21px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
width: 21px;
    }

    #pairSearchModal .be-chip:has(.be-chip-icon + .be-chip-icon) {
gap: 3px;
    }

    #pairSearchModal .be-chip:has(.be-chip-icon + .be-chip-icon) .be-chip-icon {
height: 18px;
width: 18px;
    }

    #pairSearchModal .be-chip-text {
font: inherit;
min-width: 0;
    }

    #pairSearchModal .be-chip--icon-only {
justify-content: center;
padding: 6px;
width: 34px;
    }

    #pairSearchModal .be-chip--icon-only .be-chip-text {
clip: rect(0 0 0 0);
clip-path: inset(50%);
height: 1px;
overflow: hidden;
position: absolute;
white-space: nowrap;
width: 1px;
    }

    #pairSearchModal .be-chip--icon-only:has(.be-chip-icon + .be-chip-icon) {
width: auto;
    }

    #pairSearchModal .be-chip[data-be-group="trainerGroup"],
    #pairSearchModal .be-chip[data-be-group="fashion"],
    #pairSearchModal .be-chip[data-be-group="other"],
    #pairSearchModal .be-chip[data-be-group="region"] {
max-width: 100%;
    }

    #pairSearchModal .be-chip[data-be-group="region"] { min-width: 0; }

    #pairSearchModal .be-chip[data-be-group="trainerGroup"] .be-chip-text,
    #pairSearchModal .be-chip[data-be-group="fashion"] .be-chip-text,
    #pairSearchModal .be-chip[data-be-group="other"] .be-chip-text,
    #pairSearchModal .be-chip[data-be-group="region"] .be-chip-text {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
    }

    .be-floating-filter-tooltip {
background: rgba(20, 31, 35, .96);
border-radius: 6px;
color: #fff;
font: 700 12px/1.2 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
padding: 6px 8px;
pointer-events: none;
position: fixed;
white-space: normal;
width: max-content;
max-width: 220px;
z-index: 100000;
    }

    .be-floating-filter-tooltip[hidden] { display: none; }

    .be-floating-pair-tooltip {
background: rgba(20, 31, 35, .97);
border-radius: 8px;
box-shadow: 0 6px 20px rgba(0, 0, 0, .22);
color: #fff;
display: grid;
gap: 3px;
max-width: 260px;
padding: 9px 11px;
pointer-events: none;
position: fixed;
width: max-content;
z-index: 100000;
    }

    .be-floating-pair-tooltip[hidden] { display: none; }
    .be-floating-pair-tooltip .pair-stars { color: #ffd85a; font: 800 12px/1 system-ui, sans-serif; }
    .be-floating-pair-tooltip .pair-name { font: 800 13px/1.25 system-ui, sans-serif; }
    .be-floating-pair-tooltip .be-pair-meta { color: #b9d5dc; font: 700 11px/1.25 system-ui, sans-serif; }

    #pairSearchModal .be-chip[data-be-group="rarity"] { width: 48px; }
    #pairSearchModal .be-chip[data-be-group="rarity"] .be-chip-icon {
height: 18px;
width: 36px;
    }

    #pairSearchModal #pairSearchResults .be-pair-meta {
color: #5b7c85;
display: block;
font: 700 12px/1.3 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
margin-top: 3px;
    }

    #pairSearchModal #pairSearchResults .be-result-type {
align-items: center;
border-radius: 50%;
display: flex;
height: 42px;
margin: 16px;
width: 42px;
    }

    #pairSearchModal #pairSearchResults .be-pair-avatar {
display: block;
width: 75px;
height: 75px;
margin: 0;
border-radius: 0;
object-fit: contain;
outline: 1px solid rgba(0, 0, 0, .1);
outline-offset: -1px;
    }

    #pairSearchModal #pairSearchResults[data-be-view="icons"] {
align-content: start;
display: grid;
gap: 6px;
grid-template-columns: repeat(auto-fill, 79px);
padding: 8px 0 12px;
    }

    #pairSearchModal #pairSearchResults[data-be-view="icons"] > .be-pair-result {
align-items: center;
border: 0;
border-radius: 10px;
cursor: pointer;
display: flex;
flex-direction: column;
min-width: 0;
padding: 2px;
text-align: center;
    }

    #pairSearchModal #pairSearchResults[data-be-view="icons"] > .be-pair-result:hover,
    #pairSearchModal #pairSearchResults[data-be-view="icons"] > .be-pair-result:focus-visible {
background: #edf7f9;
box-shadow: inset 0 0 0 1px rgba(39, 117, 139, .18);
    }

    #pairSearchModal #pairSearchResults[data-be-view="icons"] .pair-images {
flex: 0 0 auto;
margin: 0;
    }

    #pairSearchModal #pairSearchResults[data-be-view="icons"] .pair-info {
display: none;
    }

    .be-grid-wrapper { min-width: 0; }
    .be-grid-wrapper > #gridDiv { margin-inline: auto; }

    #pairSearchModal .be-modal-layout {
display: flex;
flex-direction: column;
min-height: 0;
    }

    #pairSearchModal .be-results-column {
display: flex;
flex-direction: column;
min-height: 0;
position: relative;
-webkit-font-smoothing: antialiased;
    }

    #pairSearchModal .be-results-column.is-loading #pairSearchResults {
opacity: .42;
pointer-events: none;
transition: opacity 100ms ease;
    }

    #pairSearchModal .be-results-loading {
align-items: center;
background: rgba(255, 255, 255, .94);
border: 1px solid rgba(44, 104, 120, .16);
border-radius: 9px;
box-shadow: 0 8px 24px rgba(20, 45, 52, .14);
color: #315f6c;
display: flex;
font: 750 13px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 9px;
left: 50%;
padding: 10px 13px;
pointer-events: none;
position: absolute;
top: 50%;
transform: translate(-50%, -50%);
z-index: 20;
    }

    #pairSearchModal .be-results-loading[hidden] { display: none; }

    #pairSearchModal .be-loading-spinner {
animation: be-spin 700ms linear infinite;
border: 2px solid #b9d8df;
border-radius: 50%;
border-top-color: #27758b;
height: 17px;
width: 17px;
    }

    @keyframes be-spin { to { transform: rotate(360deg); } }

    #pairSearchModal .be-filter-sidebar { order: -1; }

    #headerBody.navbar { z-index: 100; }

    .be-settings {
float: right;
overflow: visible;
position: relative;
    }

    .be-settings-button {
align-items: center;
appearance: none;
background: transparent;
border: 0;
color: #fff;
cursor: pointer;
display: flex;
height: 61px;
justify-content: center;
padding: 0;
width: 58px;
    }

    .be-settings-button:hover,
    .be-settings-button[aria-expanded="true"] { background: #1f5c9b; }
    .be-settings-button:active svg { transform: scale(.96); }
    .be-settings-button svg {
fill: none;
height: 23px;
stroke: currentColor;
stroke-linecap: round;
stroke-linejoin: round;
stroke-width: 2;
width: 23px;
    }

    .be-settings-popover {
background: #fff;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(0, 0, 0, .24), 0 0 0 1px rgba(0, 0, 0, .08);
color: #234d59;
padding: 16px;
position: absolute;
right: 8px;
top: calc(100% + 8px);
width: min(300px, calc(100vw - 24px));
z-index: 110;
    }

    .be-settings-popover[hidden] { display: none; }
    .be-settings-heading {
font: 800 15px/1.2 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
letter-spacing: -.01em;
margin: 0 0 12px;
    }

    .be-toggle-row {
align-items: center;
cursor: pointer;
display: flex;
gap: 12px;
justify-content: space-between;
    }

    .be-toggle-copy { display: grid; gap: 4px; }
    .be-toggle-copy strong { font: 750 14px/1.25 system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    .be-toggle-copy small { color: #607b83; font: 500 12px/1.35 system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    .be-settings-popover .be-settings-item {
align-items: center;
border-top: 1px solid #dbe6e9;
box-sizing: border-box;
color: #176b83;
display: flex;
float: none !important;
font: 700 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
left: auto !important;
margin-top: 14px;
max-width: 100%;
min-width: 0;
padding-top: 12px;
position: static !important;
right: auto !important;
text-decoration: none;
transform: none !important;
white-space: normal !important;
width: 100% !important;
writing-mode: horizontal-tb;
    }
    #headerBody .be-settings-popover a.be-settings-item {
background: transparent !important;
color: #176b83 !important;
font: 700 13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
height: auto !important;
padding: 12px 0 0 !important;
text-align: left !important;
    }
    #headerBody .be-settings-popover a.be-settings-item:hover { color: #0c4f66 !important; text-decoration: underline; }
    #headerBody .be-settings-popover a.be-settings-item:focus-visible { border-radius: 4px; outline: 3px solid #71b7c9; outline-offset: 3px; }
    .be-settings-version { color: #607b83; justify-content: space-between; }
    .be-settings-version strong { color: #234d59; }
    .be-toggle-row input { opacity: 0; position: absolute; pointer-events: none; }
    .be-switch {
background: #aab9bd;
border-radius: 999px;
flex: 0 0 44px;
height: 24px;
position: relative;
transition: background-color 140ms ease;
    }

    .be-switch::after {
background: #fff;
border-radius: 50%;
box-shadow: 0 1px 3px rgba(0, 0, 0, .28);
content: '';
height: 20px;
left: 2px;
position: absolute;
top: 2px;
transition: transform 140ms ease;
width: 20px;
    }

    .be-toggle-row input:checked + .be-switch { background: #27758b; }
    .be-toggle-row input:checked + .be-switch::after { transform: translateX(20px); }
    .be-toggle-row input:focus-visible + .be-switch { outline: 3px solid rgba(54, 126, 201, .35); outline-offset: 2px; }

    .be-spoiler-banner {
align-items: center;
background: #173f4b;
border-radius: 10px;
box-shadow: 0 8px 24px rgba(0, 0, 0, .24);
color: #fff;
display: flex;
font: 700 14px/1.35 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
gap: 14px;
left: 50%;
max-width: min(620px, calc(100vw - 24px));
padding: 12px 12px 12px 16px;
position: fixed;
top: 76px;
transform: translateX(-50%);
z-index: 1100;
    }

    .be-spoiler-banner button {
align-items: center;
appearance: none;
background: transparent;
border: 0;
color: #fff;
cursor: pointer;
display: flex;
flex: 0 0 40px;
font: 400 25px/1 system-ui, sans-serif;
height: 40px;
justify-content: center;
padding: 0;
width: 40px;
    }

    @media (min-width: 960px) {
.be-grid-picker { flex-wrap: nowrap !important; width: 100%; }
.be-grid-wrapper { flex: 1 1 0 !important; max-width: none !important; }
    }

    @media (min-width: 860px) {
#pairSearchModal .modal-content {
  max-width: 1240px;
  width: min(96%, 1240px);
}

#pairSearchModal .modal-body { overflow: hidden; }

#pairSearchModal .be-modal-layout {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 1fr) clamp(360px, 36vw, 440px);
  height: min(80vh, 820px);
}

#pairSearchModal .be-results-column { grid-column: 1; }

#pairSearchModal .be-filter-button { display: none; }

#pairSearchModal .be-filter-sidebar {
  border-left: 1px solid rgba(44, 104, 120, .18);
  grid-column: 2;
  min-width: 0;
  order: initial;
  overflow-y: auto;
  padding-left: 18px;
}

#pairSearchModal .be-filter-sidebar > .be-picker-tools {
  background: #fff;
  border-bottom: 1px solid rgba(44, 104, 120, .18);
  box-shadow: 0 5px 10px -10px rgba(20, 52, 61, .45);
  margin: 0;
  min-height: 44px;
  padding: 4px 0 9px;
  position: sticky;
  top: 0;
  z-index: 8;
}

#pairSearchModal #pairSearchResults {
  flex: 1;
  max-height: none;
}

#pairSearchModal .be-filter-panel {
  border-bottom: 0;
  display: block !important;
  margin-bottom: 0;
  padding: 10px 0 18px;
}
    }

    #pairSearchModal #pairSearchResults .be-result-type {
background: var(--be-type-color, #6aafc0);
box-shadow: inset 0 0 0 3px rgba(255, 255, 255, .28), 0 1px 3px rgba(0, 0, 0, .18);
color: #fff;
font: 800 13px/1 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
justify-content: center;
    }

    #pairSearchModal #pairSearchResults .be-empty {
color: #58747c;
cursor: default;
display: block;
font: 600 14px/1.4 system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
padding: 26px 10px;
text-align: center;
    }

    @media (max-width: 600px) {
#pairSearchModal .be-picker-tools { align-items: stretch; flex-wrap: wrap; }
#pairSearchModal .be-filter-count { align-self: center; }
#pairSearchModal .be-chip { min-height: 36px; }
#pairSearchModal .be-results-toolbar { gap: 8px; }
#pairSearchModal .be-sort-label { display: none; }
#pairSearchModal .be-sort-select { max-width: min(43vw, 190px); }
.be-settings-popover { position: fixed; right: 12px; top: 69px; }
    }
`;
  const NO_STAT_INCREASES_ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA6CAYAAAAURcGYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAN6ADAAQAAAABAAAAOgAAAACxFQjmAAAI+0lEQVRoBe1ae3CU1RU/u5vsRnlEnhWwUh6hI0irJjKiqTOd2qESCsqbVsAK6GisRWGmM+34d9vRBMQK8ioCYksVfItUnXEUHUVxsLS2IgWsPEJ4BUXIbpLd/n7ffvfuvV++zSbZB82MZ+bmvs459/zuOfex90tAckCJRKI/1NyNVIm0A2lFIBCoR961CcAmIR1FMon1cV0aGQAQWFv0ky4JEIgsYPUn44natY2J02fiXrA3XyiAgc4MDOtvhdxWJXv8VEJqVjfKqTMJ6d8nIIvml0ivUkt1FdbgK4q/ULllQXsG9QP2MICdBjBF/XoD4IIS6W0DnACALyueQuQdAucFVn8SHltjA1NGOwDhwd6XWENMBMAXFU++c2vktgYDsMno36J42gKmePr2Snqwjw1wEgC+oHjymbcLnB8whmLDl6lQTGckgTFECdSgWwDweaOel6I1ot8IADYF7c+ovmMnkqHYHmBKhqHJTYahatBkAHzWqOe8GGxLYy6AUf+phuRuyl3VoK2ufqMpt0VrKk3VGHgq6k+rtroTcaldE21XKCoZb87jgR7kcWHQNHhQR4bRnnXRGkVpywcwpfuSngF5YH5ELu1rBc10ANQTqXizzVuBawXseBzbfVTOfGWFVFbjlvagBwGwnwVwBgD+NSvFHmFLO4BNQ7+ewbo8AOP4nKiHMWFH6+OmOZsx/iyzIduy9pwLTM8cgdGAL3PoMa+xPbsnPTigvzXHt8GDm7y8nak74ABsOoQ3KwWc0Zq1+QWmxuoBgA/cEZFBl1oAZwPgk4qns7kCdxIKelOJA4weO5u7NZbJuB7dAnI/AF42QAM8C3A9Msll6g/CayPBdMGA0cCvvk5I7Z+i8sVRvQa7w66rMhmfqb8IDI2KqagoIL+cG1HVgueRsN4COPbZbA1QYXkYigZmqyyH8nUIywHZ6lNBzsedI9kqy5F8HfTQnqzJigPE+VBo7JW11s4rOAOP7eu8+DeS38zA//0MWGsuG2uxXsdD3nlxxrop+EtXNranlQWosUi7kUz6AJWKtEJdoQMACOy0icooH0L52q6Ao5WNMJzAGhSY843xxNbtsUSsSbU4+WH8HdNKuEAN6hDv0HAw+HoIbEMqpWBjNCHL1kdl25tNsnxjVJqa2OoQbz3PZwKI/lKkKqQyV67NDHx9kR5E2u7mff0EOryhQJkC1pMKHWBPRGXf5/rSKyPLQnLPbREJF+sh61H6KTaanbrFLUDfr1H8vdF+DOW7wev7Mgb+GehfgWReNni7mgmZt5Fr6hA4KL4BktwJ0wJTmq8YHpLq2RbAU+gbDwPeVzzQtxjlh1Tdk7d62wT/VPDolwIPP38A3AT976j2doelH7BH1tkeU0qZ/2tfi/xxQ1RiqRDlz6pt0HMd+5Hfj0wD2/PvFqnHm6hBz4GnStVRvgVlDezIsbgsxQ/qc+e1TAn6qZ+R5VC7PAcBeuxVpO6UOt+INYZQ/M9/U6HIdj8qGxKU++aWSCSsextQWou0SLX8c2+LPLY+JvxVvvjOiPSzn/5uBh8DXD/B1x3HG8zK5A/qwZcF8ZoWlotKNBTqHwcP7tQtaiBvng0wpavsOwB4uwVQdcknn8XlMXhYbUJ98OxOgMz9iN8oCMx88R56eVAWzotISeqn6EcAV+6vwdXqAtuOajc20WMMxf1fZPaYq0JnwwkQP4RLIqkh9+6PyzLoM0LX4eez++K7It5vfHICL9YPAZj5uUwNQP0EaGxi3dKuORfY3yCcNTAasO9g3FmDypg45mfj1lgrYOxPfsy0vZN8kvcHRpkjxxKQsyZ9aIgdXnKBvYb2i9lHjy3FDB/ohMdM3SfxzaD8ypCztgJwII+MXXtaJBozuZLlr8+J/OPTFqkYHcKmIVK7Oup4rjWnOOtt4bywXD5Q+6oBYbkoFSOulAvsdVS5+ySB4fHmwCFrVlzujmeDBwXlt9WOakeYu17NqpjzSOSnbdC3gtLckhB+XfIjrrNf4eVs2GANjGyzAO4vlucAjLd6C9gSADuYI2Acla/NhwGoYjTfpsTx4qgRQflwT1xvKk6H+4cvY/SiH3F93feLiHC9GTQPwDayrsG5wBiK2mO1OEc+P5wbjxmD4200IXzRLr8yCbAnvh2MHO4CbDY505cJ7F5sUN8dZgG7C8DWKCkHHID9AA3aY+ewxpbkCZgamBsAQ+0arEFSKb7+0NBd8GBzBoBFmJN75oSdNav0Ia8GsMeNuijYvKs5p0QhgCkDdn7cLOueTu0mQ74dlAWzeF63TXdMD8uoETroyLwQwJZ7pfjizAvoKHbwKpNvj5kGDMHtYtr4FJjGqMhLb2RwGxS8+V6z9whZDBzXmLpZDqBxLPJ3WdmP69ShutyvMer2Er8PjMJREHavZTzIH8Hm9dmB9o0/siwo1XMiUpyamwMYYyo8+JEayzkKAJDTZflZMRQiJ7BHcY5+ihtLR4ihWT03LEUpy/dCnh8xd1OPWnN84W1hQ6GpCdO6HHfLdMB42IdSxlvm8cK98skYzkHdPAKlTXDW99liHeJuiI7WrLkvcDIfRBpI1TRqxYaY7MFNxI8IbPbkYul2cUBWP2WBsNi54975s7AElatEdsF7FRY4SyIPFUzevVD7KFUT2KpNMdn9SXpgMycWyw/HJs9CXtNW/zkmvJP6UcX3QjJ/pgVwQQqrn0Tu2yqVynWb0wMjz7SqFDDWy3HH5BFgeIfNmj78e4us35I6VtBRWWhwO5Q1o68IpTV0Co6HmyqTHlP8zMdcFZI5U8LCcPUS20YMsRbnjkKDe0kZdd3VIayn1oZO+nGxjLvRArYWMr9TcteXU67YAkhgP7+1WG6osMC9VVBwWOQHYeQflKE0hkYpT0z4UZFUIRm0ATLzkX6DthrVXnltkczCeqQc04wJxXLjGEtuCWR4LBSesLHUIGl6452mxJZtMV13C5u9lqF9qcn02ttNCSYPLfPKFbwOg5Z5jDKrW9IZBKblJqOnvCqdXMHbYdhKj3GsZvxPWvCs8ZHj2rQIEXthCUZeDQt4RAxE2oG10q7/g4ZchStHDJT7ALlF/wOCjO0OfE6Z9QAAAABJRU5ErkJggg==";
  const STATUS_CONDITION_DEFENSE_ICON_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA8CAYAAAA34qk1AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAOqADAAQAAAABAAAAPAAAAAAs615UAAAQnklEQVRoBc1aSYwcVxn+X1X1Oj372BkvieN4C1kUTxQCQYFEYlFCBIQDiTgFCEcQcGSREAdA4gKIAxcCygmRS+AQEBKgLIiEEOwEyIad2I73ZTxbz/RMd1c9vu+vpau6q9sziR3y7Jqqesv//u/f3v9el5HLXFq2dWer5d/mB8Fdvg3GA2tvEWtLVqSSN5URaYgxa44xL7nGmXMd56lCwX2hYAp/zev/duswz8bLSnP16xzV9Nv3i5GRILA7rbU1VHkbpzZwRNsYU3ccc0SsLBZd77fsXS2WfzJwVE5jX6CqmWb7vmbg3yHWbAskmAKYUdDoOyaH/pWsshDCgiPOBTH2ZNFxny0UvSf6WUIP0wCzY6Gx8iff+ruvJJdXirZr3MOjlerHIIRj6TkyQKnFxZXG0+iQqU8PWO+zXV2S9qlXxZ87ieuUPrMuXUx5WLyt7xN3fCuubfrMustQ7Ei18pG0djOALq4szUGjY+udiCCC+ZMA8ZoQRPPN53VoK7qvl053v8J1t2tVEfdQGNeLM7ZNhdHdt987NDo/UR0ej9sToAwwjVbzx3FDfG+fDkG0jjwvtgEt4T1YXRQf9/9HcbcAdHlEPNxNZVgKOyNh4L27VArFb8SBKwE6v1o/4PvBTNyZGlp45CEFFte9l+8EPvrwo2oBMZ+u6xwcK9du5XuyHHCJiDvw3nz1z+KffV2Mk8gi3fyeeyav5Lk0c3/CWxpTAjRpjR6C+VOXISQJlj8HdAzuvJzwjvdYfKwVG4iDy4jfzcaG3pXnPiP6AiUnG9emsp0AS89JYEaCdFXnWVFzLNixoUgiSp0+63mKpZfTdyDQROw5A7urrKG2XFRDQ0lJP5MLvsd3dsp5TrTPVoCGptdd1gO0e1kJFk7B4gaMTM0eGAJEX7cgplAWM3yVmLGtYBLQIhKdZzIP00U9IbCe82B+9MV17pDY5VkRH2ZsfdTB9KPi4H1QIc/pksbUV6N2EUA7c6THZ54JMsQCjotlcUa3SunGe6SqQYHk27hwDwDLodYd9M9qKUAfE3CyttSf/Lm03nhaZGUuBJuZDWMHaJg89yt9gSr3l9BooJKIVIYZzNCElPbeLe70Prx5UEg7MlaANQHeHXGNL4GFBeAdDwAPKwigKZIxnnjbbxLbWpb2kWexr2ll+Kb3JkLNtEQvHVZ6WgcABdEBGqVJxdMqlxCKGd8ipRs+ARMuir9yQYKlC9LGeuyqBl2YZ1vaAMN7XEz07o1Mi1OblOL0DeJw/HkkJGuL6AZh6BWOsDB72kVuGaAYBRrluJmxOqbPQI2L6pfREAcg3JK4Q1PiFKvSrl+U1oXD0nzljxJcPJqhm3mhGUbS9LbPSGXmc2JKMP+RzeLWNom/dAbWDK3SN+nsqnVQUJy9YPPYJTbmvCFQbJQzDODFP/FCzEN3kwYIBpFwYsi3NCTuyFbxJq/VgITRSBfnxc4eFmf5fM/4sCImQDpW/NkRgFoRB2mdRTBzN+2SAFYhS+dEWqvo1PFrCtpB8Oou5Lm78BAAdSHQ7kZ9zxMPGjgJHAv/MZEDMyxUxdm8T0rX3wOgO9TnnKFJ8RB1m14RIGLHSQFTlaT9AmZfKIk3skVscQgxy5HC7ruQy04gMD0ldu4ohLAWBjQdSx8nl71gWZtX+vpoP//UqKmTQJMwU3fiWinsuE3Ke+/G5AWdwy2PSlAeQ2wBUKSQ4eIfA2aX8DmGjh00hlbEwFzjXsXpm6DdcQkas+LbltiF42IIlj0wULV6OYAmMyrr4R/VpmooZIdRtnDDvVLYxCiLguipzKvPAnSBQBk6kN7lmJqOoUS5RGFp4nj+c50iskLcKyNS2vdxaUFgzde4tjYxJNIi+Ygelc4l/qj96NlPqmNwPkzmmQL2XJS+C8ZKMFmsmcVtM+KN75QAy4SPuQ1AwqlU8AxMUsDyAbA9dEAbZ0EQBPozyYCf85kgWVSUXlUKEzuxJYN2hzfrOt2hRfcBH108kvd0ibHlmq5dW+q4VnoUnylID8yPbkfA2BMGH4dJOZePqB2Lv+OCdHkI5guT5HLSiSUZisYFw0X0wcWlQ9DXkh7XV/RkYHYr8Pmp3eIjWAkjcRAtT1ziuhII8p5XVKM9DTSLvhd6w5Sc8asRcK5BPCqDGZgnTC3UJoaqpAviwk8FQYamSXqaUpL7FG2LgGaKw9hMD6MazoGxCEURS62QZqkmZnI3Usst0CIESBr8Azo2op2mGQ3O3PKBkgxaci8y7JXEmdypxxsEYqCBGGRIHQx6MCsGJJwGIB1SWhqs1WTBL+jzohtIBUCKPC3NFiuRGZdr0OguAJ0GLWiRPHAsAatbdHjNUui8qeki+d3bqcJTE+pXKplavIA6JQnTdYew1g1tghnhHcl8thRgqWCoCi1BG7FG032SOEJ/r4yi30jGKhiYKECYBIZ74mA+B/0CaJyRPBOIqNXYhMl7qsTYyDnHZE7R7ex/Q4lRajkX/c9BymaqWA4whwYf3hiEoh0GgwqZN9BGqIVIdtQCLspRLwjJKY+HwYhtUdEcHyAt6HGZcocnAXZCLUA1ynkZiGAtaa2S93SJseUGI/WBHI3qaUHCpcoINNPaxHPMLDTlVKd00acfhhaS6LHDC320hjwXa6ZBos9/9FGk/yFIlSQ1xsQfxCFky0AX8UGKejLBbR1LPH/4lvzNB8r+MY6ka4oGsyKYCudlgs7EvLtY+I6LJL0N82ZkzaOn5gdteQhsTnUCxNBPCYWBzYTmojUakemP7EDTVaAYwifyksOvDoz+hBziR6B0JalphMxWhkygjZmM9deAtYkJwoARALAT7UQUOJikabsAYBmFlUMSJJOhHvhoGcGHoXlGVvaL5kxHcd3t0Ge5TGkHjof/4sa9jG7IY/rxPaIDTSg2lQP6Z330zD8hNfTsuTALJwqQijUuStBcBuBmGERQTeZ0l8Fn+l4Jywb8ymIJop+yzsKkaXq8q+8iVzYMbEgbM9s3gLbQcFiQW3ENxU6GCYLyQGFT49xdaN6NnuhuyXuqxNh6bY6dQKSjgXgU6tgEM7HNBSUYYKfhTN0sATIbl+bLDlHBbyCY1UegmUCfvWLrWGpqiJzQHL1QkMPa+lkxU3uwNEbLCC2CwkJR7XKzznckAcHiW9jjnkUL1loFSX6MuAxW6Ym7NarU9Iwjekrd2DcRZlKPCdRUWAEG6idEGOHGdiE+QGOG2QrlhswGS068rhoEGXf6FpwiBDg9uB2ba0RraKt97jVpnnpeXGRYBllQXOJxpEN6BtrygxaAnhDTwGaeJhv7KAA6PKlIlT44lbNUt+iR1tFvhGoNUl4+jd9d3kDGtgIBIAOyccQlcxEdAHKQ2nnT+wEU/gxT1r0qeR3aLKXtH0T6xxw3BtoRkrVYnrhrobbWsLedOyzB8hm8RUChCQfLmbIT/dVZw4qIgc7Ni35z6dTwaf5QxgzjxsRESIw+Uz8ldv4Icgb4Y3UMST0Ci0GmlJYyIiWPRoIWfq85cxDnQXX0gb8Warr8OEg+4Iw6hY9c14VwWIyB79Ny1uo4aTgpdum4mNWLYhAEGYQCnD3BLrRv5g957yrEmO+j7Tq0kiMaTECemJOqia5hr3jmAPwEUq7cAT/FGDCI9AVawgVz9RGwgrMH8fPGS2IvYmcBAakXlifhnzeKu/lmKWz7gI6JQYYnhvDX9rz484dxUvEyhArTxaGZJvRgosA4pJbTxSd4zyv5QLvGJgOJgzuMuPgNsRcAgqyPbIOZIhOiKbq4GHCYA68uiH/hVZgetn6r5zA+1ILlWOoMW7lgy23wc24MuB6G43gSaBfhHqf+LhaCMkztol2Lbs1cCnv9JRdorjYjmmpl0RyakTRwpjP7b5GJ68WOXAOgSJuVIXRCRLTtBrTxFhidU0vQiAlaBqZnVrHlqsMkLcxRsKUjSBQLC/GXz6lw7NkDYhAPdFMfNjM5IgHtu94/+UBrWzTY5BEhfc1SokasZlhusKYeewJavRYHWmeQB2P7VrsaQZNbOBxsMZlgEFGL0JtqEw3gHxqOMis9B8Z4u3RUgvMw9Qsva6TluW94CAgfhiaTYJfH4BB4zylOpVB6vLve7LwPZgeu+lyamak/knOEKAAx9WMiF17E+vosojEDAjQKzRpcDvJZJgtZekwgELxwVpQUaNSfe0WCE0+LxWUQ1Q0FhWl4MU4Zjw/9L+U9IRg+EKMHUzo2t7J0Gt8DJaIwex8UOfZ7/CwAk+lTDCTrW7Uh9IhsGesdzTSwTWnBpJ1NtyINBNnp2xFUrsIB11ENKFwiLHY21LzZhDUWQmhDQPb0c6Evw2ydFqJ6ZAUKkthy7S/FIOZS3lNV+H7pNDHq0JJX+FHmZ32EfvP+74h95iupIb2PLoJQEEBbKnK0Y60ULOqG697yKfERnIq7Po2t2r3iILNZw7krD6WhN3yPcJ14O+7UJYb72eDMcyInn0FURg7NnQqFF9mog6ThkiAxgjwLeE8XYuM75BSW3A81qNUD34+79L2HmoUpqmZBkmaNJMCO7REDbZrJ/fDXEfEXTmA9XVM6bm0KVddAIMfhjwdgrk+JLCBokQaXq6g4DoTidt7j+p77rd8W2fHJTDU0mXywkRjDcKX8qZ5PbziQojj4gwyB7hcGmpC3MKXgQs8AZBBUGIxMcUycrR8Vb3grYHDK0H95D2b/JcHxv2juG/7iHQkKvTwPNJiwd/TRPXX4PvMtkWuyINFgiSkeQBhJqa82frHmtx5OKuKH438Qc3CwZmm+beyIOj/Pk2HsQJgHV6bwXdtWCXBZF7sV+t8ashxkSRZLBzMePYlXk2WsCaBFLD+amMRM5N/tDDR59b09jSW38EitXPly3JABysr5Rv1JfrAYd0juC4fE/O2rOC3Jzzzifm2LY0v4livwV9UENcKwwoStAp8Oc1SHEbknhYMvRiB10KA/8EX7oZ+JjO7p6cUPJ8cqtbvTDT1A2Ti/snwo9xM5gDT/+CaWkYNpGj3PPk7v2gaaIzwkA7rWAnyLGue2ClmHal6zD4oDAB1u3Nfhi5xtakbs+3/YE3jYxE/kxqpDPehzgXJAX82izbz+SxFelyyECp9EcCI0bqT5Ez6/QMECqQC5AWDrusu+L4nFlVfyNBn36wuUHfr6LBtpyi8iSOH+rhSYqN2PoJNjqpy/2ye7eRoIlJ3X2u0H62srv8Zjbl/V7puPXdJ3uyde9zvXxese6KtF0LG1UvXzJc/7zSCaucx3D4C57Zhr1F/EHTvsnIL81PznpyJnsOBfzjL9YbE3fQ0RGyf0OYXr5Hiltp+ZT05zpmpdQOMRg/xW+8xiO8U1d0DqGNMaeEcqZ7k2TiafJvZ0H+SPPZ1RsSGgJEBTXl5b+RXCRyob7yINU1aTvsRS1DVKo6gGGphqvwKGG0Ol6hcvZard4zcMNCawtLryOH57/Aze82lwKaLvrsd/Yz8kwK5cNZ4Pd4tv6n83XK5+NlW37sd8Jtc5nF981Burj6V3Pj1DBwFeH0Csr+Z0rVJ+IP1Fdc88l6h4R0Bj2jx8Wm23vts3WLFjDBh+rAX+ZwdrEMuvmS97he/FHxeHA9/e38sCNJ46WncfwnuyWYjbNnhvY118NJ2rbnB8T/fLCjSm/g4AX3aAMU9XBGhMfAOArxjAmJd35d5oNr+Ab/YPzi4v2vTFOra9G0z8D6IYULbtPkDeAAAAAElFTkSuQmCC";
  const POMATOOLS_SKILL_ABBR = Object.freeze({ "en": { "1101190": "Team Fighting-Z Triage Tank {{value}}", "1101230": "Fighting-Z Triage Tank {{value}}", "1101350": "Hit PAR Opp: HP Recovery {{value}}", "1101370": "Normal-Z: HP Recovery {{value}}", "1101410": "Poison-Z: HP Recovery {{value}}", "1101420": "Use Move w/Ice-Z: Team HP Recovery {{value}}", "1101460": "Pinch-BRN Hit: HP Recovery (M) {{value}}", "1101470": "Hit PSN Opp: HP Recovery {{value}}", "1101490": "Flying-Z: HP Recovery {{value}}", "1101500": "Hit PAR Opp: Team HP Recovery {{value}}", "1101520": "M-Move: Team HP Recovery {{value}}", "1101570": "Normal-Z & Take Hit: Team HP Recovery {{value}}", "1101580": "Normal-Z & Take S-Move Hit: HP Recovery {{value}}", "1101620": "Ice-Z: HP Recovery {{value}}", "1101630": "Dragon-Z: HP Recovery {{value}}", "1201220": "Normal-Z: MG → {{value}}", "1201230": "Ice-Z: MG → {{value}}", "1202010": "MGR{{value}}", "1202230": "BRN Hit: MG ↑2 {{value}}", "1202250": "Hit Rest. Opp: MG ↑2 {{value}}", "1202260": "Ally Hits Conf. Opp: MG ↑2 {{value}}", "1202270": "Ally Hits Conf. Opp: MG ↑ {{value}}", "1202280": "Hit Conf. Opp: MG ↑ {{value}}", "1202290": "Hit PSN Opp: MG ↑ {{value}}", "1301180": "Conf. Synergy {{value}}", "1301940": "Spd ↑: Moves ↑ {{value}}", "1301950": "Def. ↑: Moves ↑ {{value}}", "1301960": "S.Def ↑: Moves ↑ {{value}}", "1301970": "Opp Trap.: Team Moves ↑ {{value}}", "1302210": "Dark-Z: Attack Move DR {{value}}", "1302220": "Bug-Z: Team Attack Move DR {{value}}", "1302230": "Dragon-Z: Attack Move DR {{value}}", "1302260": "Fairy-Z: Team Attack Move DR {{value}}", "1302270": "Ground-Z: Attack Move DR {{value}}", "1302290": "Rock-Z: Team Physical DR {{value}}", "1302300": "Rock-Z: Team Special DR {{value}}", "1302330": "Ice-Z: Team Special DR {{value}}", "1302340": "Sunny: Team Spec. DR {{value}}", "1302350": "Opp PSN: Team P-Moves & S-Moves DR {{value}}", "1302370": "Team Phys. DR {{value}}", "1302390": "Grassy-T: Team Attack Move DR {{value}}", "1302420": "EX Sunny: Water P-, S-, M-Moves DR {{value}}", "1302430": "EX Rain: Fire P-, S-, M-Moves DR {{value}}", "1302460": "Fairy-Z: Move DR {{value}}", "1306110": "1st S-Move: B-Move MP+{{value}}", "1306120": "“Quick Move”: T-Move MP+1 {{value}}", "1306130": "1st Half HP: MP+1 {{value}}", "1306140": "S-Move: “Berry” MP+{{value}}", "1306150": "Team S-Move: B-Move MP+1 {{value}}", "1306160": "B-Move: T-Move MP+1 {{value}}", "1306170": "1st S-Move: “Berry” MP+{{value}}", "1306180": "1st S-Move: Status P-Move MP+{{value}}", "1306190": "1st Use Electric-T: B-Move MP+{{value}}", "1306200": "1st Hit: Status P-Move MP+1 {{value}}", "1306210": "1st “Berry” MP 0: “Berry” MP+{{value}}", "1306220": "Hit: “Berry” MP+1 {{value}}", "1306230": "S-Move: B-Move MP+{{value}}", "1306270": "Use Unova Analysis: B-Move MP+{{value}}", "1306280": "Take Hit: “Berry” MP+1 {{value}}", "1306290": "1st Use Status P-Move: B-Move MP+{{value}}", "1306300": "1st Kanto Analysis MP 0: MPR{{value}}", "1306320": "1st S-Move: “Super Effective ↑” MPR{{value}}", "1306330": "1st “Mini Potion All” MP 0: MPR{{value}}", "1308010": "Poison-Z: Moves ↑ {{value}}", "1308030": "Opp PAR: Team Moves ↑ {{value}}", "1308050": "Rock-Z: Moves ↑ {{value}}", "1308090": "Pasio C (Def): Team P-Moves ↑ & S-Moves ↑ {{value}}", "1308110": "Ally Spd. ↑: Moves ↑ {{value}}", "1308130": "Def. ↑: P-Moves ↑ & S-Moves ↑ {{value}}", "1308140": "Opp PSN: Team Moves ↑ {{value}}", "1308180": "Paldea C (Defe): Team Moves ↑ {{value}}", "1308200": "Unova C (Def): Team Moves ↑ {{value}}", "1308220": "Opp SLP: Team Moves ↑ {{value}}", "1308230": "Opp Conf.: Team Moves ↑ {{value}}", "1308240": "Opp BRN: Team Moves ↑ {{value}}", "1308250": "Fairy-Z: Team Moves ↑ {{value}}", "1308270": "Opp Spd ↓: Team P-, S-, M-Moves ↑ {{value}}", "1308320": "Ice-Z: Moves ↑ {{value}}", "1308370": "Dragon-Z: Team Moves ↑ {{value}}", "1308400": "Fighting-Z: Team Moves ↑ {{value}}", "1308430": "Dragon-Z: P-Moves ↑ & S-Moves ↑ {{value}}", "1308450": "Rock DF Opp: Team Moves ↑ {{value}}", "1308470": "Poison-Z: Team Moves ↑ {{value}}", "1308490": "Johto C (Def): Team Moves ↑ {{value}}", "1308510": "Rock-Z: P-Moves ↑ & S-Moves ↑ {{value}}", "1308520": "Ground-Z: P-Moves ↑ & S-Moves ↑ {{value}}", "1308560": "Normal-Z: Team Moves ↑ {{value}}", "1308580": "Normal-Z: Moves ↑ {{value}}", "1308590": "Opp Def. ↓: Moves ↑ {{value}}", "1501390": "1st Use Electric-T: Sync CD ↓ {{value}}", "1501460": "1st PM⇑ ≧ 6: Sync CD ↓ {{value}}", "1501510": "User Sets Kanto C (Spec): CD ↓ {{value}}", "1501530": "Debut: Sync CD ↓ & S.Atk ↑{{value}}", "1501550": "Debut: Sync CD ↓3 & Normal-Z", "1501570": "1st Ghost Wish MP 0: CD ↓ {{value}}", "1501580": "1st Kanto Analysis MP 0: CD ↓ {{value}}", "1501590": "User Sets Circle: CD ↓ {{value}}", "1501600": "User Sets Steel Zone: CD ↓ {{value}}", "1601590": "Scholar’s Sync (S.Def) {{value}}", "1601650": "Steel DF Opp: Sync Power ↑ {{value}}", "1601680": "Dark-Z: S-Moves ↑ {{value}}", "1601690": "Grassy-T: S-Moves ↑ {{value}}", "1601700": "Poison-Z: S-Moves ↑ {{value}}", "1601750": "Rock-Z: S-Moves ↑ {{value}}", "1601760": "Unova C (Def): S-Moves ↑ {{value}}", "1601780": "Opp PSN: M-Moves ↑ {{value}}", "1601810": "Opp S.Def ↓: S-Moves ↑ {{value}}", "1601820": "Flying-Z: S-Moves ↑ {{value}}", "1601830": "Opp Trap.: Team S-Moves ↑ {{value}}", "1601840": "Normal-Z: S-Moves ↑ {{value}}", "1601860": "Paldea C (Def): Team S-Moves ↑ {{value}}", "1601880": "Unova C (Def): Team S-Moves ↑ {{value}}", "1601890": "Psychic-T: S-Moves ↑ {{value}}", "1601900": "S.Atk ↑: M-Moves ↑ {{value}}", "1601930": "Ground-Z: S-Moves ↑ {{value}}", "1601960": "Ice-Z: S-Moves ↑ {{value}}", "1601980": "Normal-Z: Team S-Moves ↑ {{value}}", "1602070": "1st S-Move: “Quick Move” MP+{{value}}", "1602080": "1st Pinch: “Quick Move” MP+1 {{value}}", "1602090": "S-Move: T-Move MP+1 {{value}}", "1602100": "M-Move: B-Move MP+{{value}}", "1602110": "M-Move: Status P-Move MP+{{value}}", "1602120": "1st Move: MP+{{value}}", "1602130": "Team S-Move: Wide Guard MP+{{value}}", "1602140": "1st Use Status P-Move: Baneful Bunker MP+{{value}}", "1602150": "M-Move: “Super Effective ↑” MPR{{value}}", "1603010": "Rainy: M-Moves ↑ {{value}}", "1603040": "Bug-Z: Team S-Moves ↑ {{value}}", "1603060": "Ally Spd. ↑: S-Moves ↑ {{value}}", "1603080": "Fighting-Z: S-Moves ↑ {{value}}", "1603090": "Sunny: S-, M-Moves ↑ {{value}}", "1603100": "Rock DF Opp: Team S-Moves ↑ {{value}}", "1603120": "Fighting-Z: Team S-Moves ↑ {{value}}", "1603150": "Grassy-T: M-Moves ↑ {{value}}", "1603160": "Dark-Z: Team S-Moves ↑ {{value}}", "1701270": "Rock-Z Status Immunity", "1701310": "Take Hit: Ignore Atk. ↑ & S.Atk ↑", "1701320": "Psychic-T: Team Condition Nullification", "1701330": "Team Takes Hit From P-, S-, M-Move: Ignore WTZ Power ↑", "1701340": "Dragon-Z: Interference Immunity", "1701360": "Ice-Z: Team Status Immunity", "1701370": "Steel-Z: Team Condition Nullification", "1701380": "Ground-Z: Team Condition Nullification", "1701420": "Grassy-T: Team Condition Nullification", "1701450": "Poison-Z: Team Status Immunity", "1701490": "Bug-Z: Status Immunity", "1701510": "Fairy-Z: Team Condition Nullification", "1702060": "Lessen Conf. {{value}}", "1704230": "Move on Opp: SLP {{value}}", "1704910": "Team Limited SM⇑1 {{value}}", "1704940": "Initial Pinch SM⇑{{value}}", "1705050": "Condition Nullification Ext. {{value}}", "1705060": "PAR Opp Fail ↑ {{value}}", "1706030": "PM⇑2 {{value}}", "1706040": "Initial Pinch PM⇑1 {{value}}", "1706180": "Team Def. Posture PM⇑1 {{value}}", "1706250": "Team MAX/Sync PM⇑1 {{value}}", "1706450": "M-Move Hit: Team Poison Rebuff ↓ {{value}}", "1706490": "Move: PM⇑3 {{value}}", "1706500": "Sta. P-Move: PM⇑2 {{value}}", "1706510": "Steel DF on Opp & Hit: FMN {{value}}", "1706520": "Sync Buff & Hit: PM⇑3 {{value}}", "1706530": "M-Move: FMN", "1706540": "Use Status P-Move: Team PM⇑1 {{value}}", "1706550": "“Quick Move”: PM⇑1 {{value}}", "1706560": "Hit BRN Opp: Supereffective ↑ Next {{value}}", "1706570": "S-Move: PM⇑2 {{value}}", "1706580": "Opp Fail: PM⇑2 {{value}}", "1706600": "S-Move: Team FMN {{value}}", "1706620": "Take Hit: Opp PSN {{value}}", "1706630": "Hit FRZ Opp: SM⇑1 {{value}}", "1706640": "Move: SM⇑2 {{value}}", "1706650": "M-Move: Team FMN", "1706680": "S-Move: Team SM⇑2 Once {{value}}", "1706690": "Hit Restrained Opp: FMN {{value}}", "1706710": "Dark DF on Opp & Hit: FMN {{value}}", "1706720": "Hit PAR Opp: SM⇑1 {{value}}", "1706730": "S-Move: Team PM⇑2 {{value}}", "1706760": "Hit PSN Opp: SM⇑1 {{value}}", "1706770": "Ally Sets WTZ: SM⇑1 {{value}}", "1706780": "Hit Status Cond Opp: FMN {{value}}", "1706790": "S-, M-Move: SM⇑2 {{value}}", "1706810": "T-Move: Team FMN {{value}}", "1706820": "KO Opp: SM⇑2 {{value}}", "1706830": "Stat ↓: PM⇑1 {{value}}", "1706840": "T-Move: Team P&SM⇑1 Once {{value}}", "1706870": "T-Move: SM⇑1 {{value}}", "1706880": "Hit: FMN / SM⇑{{value}}", "1706890": "M-Move Hit: Team Same-Type Rebuff ↓ {{value}}", "1706900": "Hit: PM⇑1 {{value}}", "1706910": "1st S-Move: Team SM⇑{{value}}", "1706920": "Ally Sets WTZ: PM⇑1 {{value}}", "1706930": "BRN Hit: PM⇑1 {{value}}", "1706950": "Hit: SM⇑1 {{value}}", "1706960": "Strike: PM⇑1 {{value}}", "1706970": "Sandstorm Hit: PM⇑1 {{value}}", "1706980": "Entry: PM⇑{{value}}", "1706990": "M-Move: Team P&SM⇑{{value}}", "1707010": "Allied Field Effect & Hit: FMN {{value}}", "1707020": "Hit Rebuff ↓ Opp: FMN {{value}}", "1707040": "Move on Ally: P&SM⇑1 {{value}}", "1707050": "S-Move: P&SM⇑2 {{value}}", "1707060": "Set Allied/Entire Field Effect: FMN {{value}}", "1707070": "M-Move: SM⇑{{value}}", "1707090": "S-Move: P&SM⇑1 {{value}}", "1707100": "Phys. M-Move: PM⇑{{value}}", "1707110": "Spec. M-Move: SM⇑{{value}}", "1707120": "Circle Hit: PM⇑1 {{value}}", "1707130": "Debut: Team PM⇑{{value}}", "1707140": "Hit No-Stat ↑ Opp: PM⇑1 {{value}}", "1707160": "Set Allied/Entire Field Effect: SM⇑1 {{value}}", "1707170": "Use Status P-Move: SM⇑1 {{value}}", "1707180": "Debut: PM⇑{{value}}", "1707190": "Debut: SM⇑{{value}}", "1707200": "S-Move: SM⇑2 {{value}}", "1707220": "Debut: Team SLP", "1707230": "P-Move: PM⇑1 {{value}}", "1707240": "1st S-Move: Team PM⇑{{value}}", "1707250": "Prep/Posture: SM⇑2 {{value}}", "1707260": "Ally Sets Circle: SM⇑1 {{value}}", "1707270": "Prep/Posture: SM⇑1 {{value}}", "1707280": "Ally Faints: PM⇑{{value}}", "1707300": "Hit: Flinch & PAR {{value}}", "1707310": "Hit: “Berry” MP ↓ & SM⇑3 {{value}}", "1707320": "Circle Hit: FMN {{value}}", "1707330": "Move: Sync⇑4 {{value}}", "1707340": "Stat ↓: PM⇑2 {{value}}", "1707350": "Move: Sync⇑3 {{value}}", "1707360": "S-Move: Sync⇑5 {{value}}", "1707370": "T-Move: Team PM⇑1 {{value}}", "1707380": "User Sets Circle: Team P&SM⇑1  {{value}}", "1707390": "“Quick Move”: Team PM⇑1 {{value}}", "1707400": "Entry: SM⇑{{value}}", "1707410": "Entry: Sync⇑{{value}}", "1707430": "1st S-Move: PM⇑{{value}}", "1707440": "Use Status Move: Team P&SM⇑1 {{value}}", "1707450": "1st “Berry” MP 0: SM⇑{{value}}", "1707470": "M-Move: PM⇑{{value}}", "1707480": "T-Move: Team Sync⇑1 {{value}}", "1707510": "1st P-Move: SM⇑{{value}}", "1707520": "Hit: Sync⇑1 {{value}}", "1707530": "M-Move Hit: Team Interference {{value}}", "1707550": "M-Move Hit: Team Apply PAR  {{value}}", "1707560": "Move on Ally: Sync⇑2 {{value}}", "1707570": "Ally Sets Circle: Team P&SM⇑1 {{value}}", "1707580": "S-, M-Move: PM⇑2 {{value}}", "1707590": "M-Move: Team Sync⇑{{value}}", "1707610": "Hit: Team “Berry” MP ↓ & PM⇑1 {{value}}", "1707620": "Opp Fail: Team P&SM⇑1 {{value}}", "1707630": "Steel-Z Hit: FMN {{value}}", "1707650": "Strike: SM⇑1 {{value}}", "1707660": "Strike: Sync⇑1 {{value}}", "1707670": "User Sets Flying-Z: Team SM⇑1 {{value}}", "1707680": "T-Move: PM⇑3 {{value}}", "1707690": "Ally Sets Weather: SM⇑2 {{value}}", "1707700": "M-Move: Sync⇑{{value}}", "1707720": "T-Move: Team P&SM⇑1 {{value}}", "1707730": "Half HP: Team P&SM⇑2 Once {{value}}", "1707740": "Use Psychic Wish: Team SM⇑1 {{value}}", "1707750": "Take Hit: SM⇑1 {{value}}", "1707760": "M-Move Hit: Same-Type Rebuff ↓ {{value}}", "1707770": "Fire DF on Opp & Hit: SM⇑1 {{value}}", "1707780": "Hit: Sync⇑2 {{value}}", "1707790": "M-Move Hit: BRN {{value}}", "1707800": "Rainy Hit: FMN {{value}}", "1707810": "Grassy-T Hit: FMN {{value}}", "1707830": "M-Move: Team PM⇑{{value}}", "1707840": "Sunny Hit: FMN {{value}}", "1707850": "Move on Ally: Sync⇑4 {{value}}", "1707860": "Move: Team Sync⇑1 {{value}}", "1707870": "1st S-Move: SM⇑{{value}}", "1707880": "B-Move MP 0 & Non-B-Move Hit: SM⇑1 {{value}}", "1707900": "Ground-Z Hit: FMN {{value}}", "1707910": "Move: Team SM⇑2 {{value}}", "1707920": "Move: Team PM⇑2 {{value}}", "1707930": "Ground-Z: HP Recovery {{value}}", "1707940": "Use Ground Wish: PM⇑2 {{value}}", "1707950": "Rainy Strike: Sync⇑1 {{value}}", "1707960": "Take Hit: Team PM⇑1 {{value}}", "1707970": "Take Hit: Team SM⇑1 {{value}}", "1708020": "User Sets Sunny: FMN {{value}}", "1708030": "Electric-T Hit: Special Boost ↑1 {{value}}", "1708050": "T-Move MP 0 & Hit: FMN {{value}}", "1708060": "T-Move MP 0 & Hit: SM⇑2 {{value}}", "1708070": "Ally Hits BRN Opp: SM⇑1 {{value}}", "1708080": "1st “Berry” MP 0: Team PM⇑{{value}}", "1708090": "Hit BRN Opp: FMN {{value}}", "1708100": "S-Move: Team SM⇑1 {{value}}", "1708110": "Use Steel Wish: SM⇑2 {{value}}", "1708120": "Debut: Team SM⇑{{value}}", "1708130": "Take S-Move Hit: PM⇑2 {{value}}", "1708140": "Fire DF on Opp & Hit: FMN {{value}}", "1708150": "Take Hit: Team Sync⇑1 {{value}}", "1708160": "Rainy Hit: SM⇑2 {{value}}", "1708170": "Ally Sets WTZ: Team SM⇑1 {{value}}", "1708220": "Strike: PM⇑1 & SM⇑1 {{value}}", "1708230": "1st SM⇑ ≧ 6: SM⇑{{value}}", "1708250": "Ally Sets Bug-Z: SM⇑1 {{value}}", "1708260": "S-Move: Team SM⇑2 {{value}}", "1708270": "Move: Team FMN {{value}}", "1708280": "1st Move Use: Team SM⇑{{value}}", "1708300": "Move: PM⇑2 & SM⇑2 {{value}}", "1708320": "Ally Sets Circle: PM⇑2 {{value}}", "1708330": "Ally Sets Circle: Sync⇑3 {{value}}", "1708340": "Ally Stat ↑: Sync⇑1 {{value}}", "1708350": "Take S-Move Hit: Team P&SM⇑1 {{value}}", "1708360": "Ally Hits Flinching Opp: P&SM⇑1 {{value}}", "1708390": "1 on Opp Field & Hit: P&SM⇑1 {{value}}", "1708400": "1 on Opp Field & Hit: FMN {{value}}", "1708410": "Debut or 1st S-Move: SM⇑{{value}}", "1708420": "P-Move: Sync⇑2 {{value}}", "1708430": "Use Status P-Move: SM⇑2 {{value}}", "1708440": "Sunny Ally Hit: SM⇑1 {{value}}", "1708450": "Ally Hits Flinching Opp: Sync⇑2 {{value}}", "1708460": "Fairy-Z: HP Recovery {{value}}", "1708470": "1 on Opp Field & Hit: SM⇑1 {{value}}", "1708480": "Ally Sets Circle: Team PM⇑1 {{value}}", "1708490": "Ally Sets Circle: FMN {{value}}", "1708500": "Ally Sets WTZ: Team P&SM⇑1 {{value}}", "1708510": "Team S-Move: Team P&SM⇑1 {{value}}", "1708550": "S-Move: Team P&SM⇑1 {{value}}", "1708560": "Debut: Sync⇑{{value}}", "1708570": "1st Use Status P-Move: Team SM⇑{{value}}", "1708590": "1st S-Move: Team P&SM⇑{{value}}", "1708600": "S-Move: PM⇑3 {{value}}", "1708610": "Ally Hits Status Cond Opp: P&SM⇑1 {{value}}", "1708620": "Ally Hits Status Cond Opp: Sync⇑2 {{value}}", "1708640": "1st T-Move: Sync⇑10", "1708650": "Ghost-Z & Hit: Interference {{value}}", "1708660": "Hit Inter Opp: FMN {{value}}", "1708670": "Hit Inter Opp: P&SM⇑1 {{value}}", "1708700": "P-Move: Team Sync⇑1 {{value}}", "1708710": "M-Move: P&SM⇑ {{value}}", "1708720": "Debut: Team P&SM⇑ {{value}}", "1708730": "Debut: Team Sync⇑ {{value}}", "1708740": "Use Fighting Wish: PM⇑2 {{value}}", "1708750": "Fighting-Z & Hit: FMN {{value}}", "1708760": "Ally Sets Grassy-T: Team P&SM⇑1 {{value}}", "1708780": "User Sets Dark-Z: Team SM⇑1 {{value}}", "1708790": "Rock DF Opp & Hit: FMN {{value}}", "1708800": "T-Move: SM⇑2 {{value}}", "1708820": "S-Move: Team P&SM⇑2 {{value}}", "1708840": "1st Hit: P&SM⇑{{value}}", "1708850": "Ghost-Z & Hit: P&SM⇑1 {{value}}", "1708860": "1st S-Move: Sync⇑10", "1708890": "Johto C (Spec) & Move: FMN {{value}}", "1708900": "Ally Sets Ghost-Z: Team P&SM⇑2 {{value}}", "1708910": "Move: Team P&SM⇑1 {{value}}", "1708920": "Ally Sets Circle: Team FMN {{value}}", "1708930": "Hit: P&SM⇑1 {{value}}", "1708940": "1st Use Status P-Move: Team FMN", "1708950": "Hit PSN Opp: Sync⇑2 {{value}}", "1708960": "Hit: SM⇑3 {{value}}", "1708980": "Entry: Team P&SM⇑{{value}}", "1708990": "User Sets Pasio C (Def): Team SM⇑{{value}}", "1709010": "Def Posture: Team PM⇑1 {{value}}", "1709020": "Def Posture: Team SM⇑1 {{value}}", "1709120": "1st Grass-Type Hit: Grassy-T & Grass Rebuff ↓", "1709130": "1st Rock-Type Hit: Rock-Z & Rock Rebuff ↓", "1709150": "1st Ghost Wish MP 0: PM⇑{{value}}", "1709160": "T-Move: PM⇑2 {{value}}", "1709170": "Hit Status Opp: Sync⇑ {{value}}", "1709180": "S-Move: Team-Synced SM⇑1–4 {{value}}", "1709190": "User Sets Kanto C (Spec): SM⇑1 {{value}}", "1709210": "Ally Hits: User P&SM⇑2", "1709220": "Team S-Move: PM⇑2 {{value}}", "1709240": "Move on Ally: FMN {{value}}", "1709250": "Ally Sets WTZ: Team PM⇑1 {{value}}", "1709270": "Faint: Team Sync⇑10", "1709280": "S-, M-Move: Team SM⇑2 {{value}}", "1709290": "Team S-Move: SM⇑2 {{value}}", "1709300": "Move: PM⇑2 & Sync⇑4", "1709310": "User Sets Steel-Z: Team P&SM⇑1 {{value}}", "1709370": "Grassy-T Hit: FNG & PSN", "1709380": "Ghost-Z Hit: FMN & BRN", "1709390": "Dragon-Z Hit: FMN & PAR", "1709400": "S-Tera & Hit: FMN {{value}}", "1709410": "User Sets Grassy-T: Supereffective ↑ Next", "1709420": "Team S-Move: PM⇑1 {{value}}", "1709430": "S-, M-Move: Team P&SM⇑1 {{value}}", "1709440": "Entry: P&SM⇑{{value}}", "1709470": "S-Move on Opp: BRN", "1709490": "1st S-Move: P&SM⇑{{value}}", "1709540": "Grassy-T Hit: Team PM⇑1 {{value}}", "1709550": "Circle Hit: Team PM⇑1 {{value}}", "1802180": "Team S.Atk ↓ Immunity", "1802190": "Team Atk. ↓ Immunity", "1802200": "Fairy-Z: Team All Stats ↓ Immunity", "1802220": "Rock-Z: Team All Stats ↓ Immunity", "1802230": "Bug-Z: All Stats ↓ Immunity", "1802240": "Dark-Z: All Stats ↓ Immunity", "1802250": "Normal-Z: Team All Stats ↓ Immunity", "1802270": "Dragon-Z: Team All Stats ↓ Imm.", "1807080": "Hit: Absorb Atk. Stat {{value}}", "1810240": "Team Weird S.Def Drain {{value}}", "1810380": "Team Limited Addition (S.Def) {{value}}", "1810390": "First Sync Def. ↓ All {{value}}", "1810630": "Burned Down (Atk. ↓, S.Def ↓) {{value}}", "1810680": "Toxic Hit (Atk. ↑) {{value}}", "1810690": "Toxic Hit (Spd. ↑) {{value}}", "1810770": "Sync Def. ↓ All {{value}}", "1810800": "P-Move on Opp: S.Def ↓2 {{value}}", "1810810": "Sta. P-Move on Poi. Opp: Stat ↓×{{value}}", "1810820": "P-Move: Spd. ↑2 {{value}}", "1810830": "Sync: Team Spd. ↑ {{value}}", "1810860": "S-Move: S.Def ↑ {{value}}", "1810870": "S-Move: Def. ↑ & S.Def ↑ {{value}}", "1810880": "Hit BRN Opp: S.Atk ↓ {{value}}", "1810890": "Hit Trap. Opp: S.Def ↓ {{value}}", "1810900": "“Absorbs” Hit: Atk. ↓ {{value}}", "1810920": "P-Move on Opp: Atk. ↓ {{value}}", "1810940": "Status P-Move: Stat ↑ {{value}}", "1810950": "M-Move: Team Def. ↓ {{value}}", "1810960": "Hit BRN Opp: Atk. ↓ {{value}}", "1810970": "Hit Trap. Opp: Spd. ↓ {{value}}", "1810980": "“Absorbs” Hit: S.Atk ↓ {{value}}", "1811010": "Hit BRN Opp: Stat ↓ {{value}}", "1811020": "Hit PAR Opp: Def. ↓ & S.Def ↓ {{value}}", "1811030": "M-Move: Atk. ↑ {{value}}", "1811040": "Hit PSN Opp: Stat ↓ {{value}}", "1811050": "Use Status P-Move on Opp: S.Def ↓ {{value}}", "1811060": "Hit: Team Atk. ↑ & S.Atk ↑ {{value}}", "1811070": "1st S-Move on Opp: Def. ↓ & S.Def ↓ {{value}}", "1811080": "P-Move on Opp: Def. ↓ {{value}}", "1811090": "P/S-Move Opp: Def. ↓2 {{value}}", "1811100": "Hit: Team Spd. ↑2 {{value}}", "1811110": "Hit PSN Opp: Atk. ↓ & Hit PAR Opp: S.Atk ↓ {{value}}", "1811120": "P/S-Move on Opp: S.Def ↓2 {{value}}", "1811130": "Dark DF on Opp & Hit: Def. ↓ & S.Def ↓ {{value}}", "1811140": "Dark DF on Opp & Hit: Spd. ↑ {{value}}", "1811150": "Hit: Team Atk. ↑ {{value}}", "1811160": "Hit: Team S.Atk ↑ {{value}}", "1811170": "Hit Trap. Opp: Atk. ↓ {{value}}", "1811180": "Move on Opp: Atk. ↓ & S.Atk ↓ {{value}}", "1811200": "Move: Team Atk. ↑ & S.Atk ↑ {{value}}", "1811210": "P/S-Move on Opp: Atk.↓2 {{value}}", "1811220": "P/S-Move on Opp: S.Atk ↓2 {{value}}", "1811240": "Ally Sets WTZ: Team Spd. ↑ {{value}}", "1811260": "1st T-Move: Team S.Atk ↑ {{value}}", "1811270": "Strike: Atk. ↓ {{value}}", "1811280": "Move: Team Def. ↑ & S.Def ↑ {{value}}", "1811290": "T-Move: Team Spd ↑ & Eva ↑ {{value}}", "1811300": "Move: Atk. ↑2 & S.Atk ↑2 {{value}}", "1811310": "M-Move Hit: 7 Stats ↓ {{value}}", "1811320": "Phys Hit: Def. ↓2 {{value}}", "1811330": "Spec Hit: S.Def ↓2 {{value}}", "1811340": "Use Status P-Move: Team Atk. ↓ {{value}}", "1811350": "Use Status P-Move: Team S.Atk ↓ {{value}}", "1811360": "Hit: Def. ↓ & S.Def ↓ {{value}}", "1811370": "S-Move on Opp: S.Atk ↓ {{value}}", "1811380": "S-Move: Team S.Atk ↑ {{value}}", "1811400": "Poison-Z Hit: Stat ↓ {{value}}", "1811420": "Entry: Atk. ↑ & Spd. ↑ {{value}}", "1811430": "Use Status P-Move on Opp: Def. ↓2 {{value}}", "1811440": "Hit PAR Opp: Def. ↓ {{value}}", "1811470": "Entry: S.Atk ↑ & Spd. ↑ {{value}}", "1811480": "Strike: S.Def ↓ {{value}}", "1811500": "T-Move: Atk. ↑ & S.Atk ↑ {{value}}", "1811510": "M-Move: Team Atk. ↑ & Team S.Atk ↑ {{value}}", "1811530": "Use Status P-Move on Opp: Atk. ↓2 {{value}}", "1811540": "Take Hit: Team S.Atk ↑ {{value}}", "1811550": "Circle Hit: Atk. ↓ & S.Atk ↓ {{value}}", "1811560": "S-Move on Opp: Atk. ↓ & S.Atk ↓ {{value}}", "1811590": "1st T-Move: Def. ↑ & S.Def ↑ {{value}}", "1811600": "Set Allied/Entire Field Effect: Team Atk. ↑ & S.Atk ↑ {{value}}", "1811610": "Use Status P-Move on Opp: Def ↓ {{value}}", "1811620": "Hit: Atk. ↓ & S.Atk ↓ {{value}}", "1811630": "M-Move Hit: Team S.Def ↓ {{value}}", "1811640": "Move on Ally: S.Def ↑ {{value}}", "1811650": "Use Status P-Move: S.Atk ↑ {{value}}", "1811660": "Entry: S.Atk ↑ & S.Def ↑ {{value}}", "1811670": "Hit PAR Opp: S.Def ↓ {{value}}", "1811680": "Take Hit: Opp Atk. ↓ & S.Atk ↓ {{value}}", "1811690": "Debut: Team Atk. ↓ {{value}}", "1811700": "Hit Restrained Opp: Atk. ↓ & S.Atk ↓ {{value}}", "1811710": "Sunny Hit: Atk. ↓ & Def. ↓ {{value}}", "1811750": "Move: S.Atk ↑2 & Crit Rate ↑1 {{value}}", "1811770": "Entry: S.Atk ↑ & Eva. ↑ {{value}}", "1811780": "Entry: S.Atk ↑4 & Crit Rate {{value}}↑", "1811790": "P-Move/S-Move on Opp: Def. ↓ {{value}}", "1811810": "Hail Hit: S.Def ↓ {{value}}", "1811820": "1st S-Move: Team Acc. ↓ & Eva. ↓ {{value}}", "1811830": "User Sets Circle: Team Def. & S.Def ↑2 {{value}}", "1811840": "Debut: Def. ↑ & S.Def ↑ {{value}}", "1811850": "Hit: S.Def ↓2 {{value}}", "1811860": "Move on Ally: S.Atk ↑ {{value}}", "1811870": "Hit PAR Opp: Atk. ↓2 {{value}}", "1811880": "Take Hit: Team Eva. ↑2 {{value}}", "1811890": "Use Status P-Move: Def. ↑ & S.Def ↑ {{value}}", "1811910": "Take Hit: Opp Spd. ↓2 {{value}}", "1811920": "Sunny Hit: Def- ↓ & S.Def ↓ {{value}}", "1811930": "M-Move Hit: S.Def ↓ {{value}}", "1811940": "1st Time User Sets Sinnoh C (Spec): S.Atk ↑ {{value}}", "1811950": "S-Move: User Def. ↓ & S.Def ↓ {{value}}", "1811960": "Move: User Def. ↓ & S.Def ↓ {{value}}", "1811970": "Hit BRN Opp: S.Atk ↓ & S.Def ↓ {{value}}", "1811980": "Hit PAR Opp: Team Atk. ↑ & S.Atk ↑ {{value}}", "1812010": "Move on Ally: Atk. ↑ {{value}}", "1812020": "Earthquake: Atk. ↓ {{value}}", "1812040": "Debut: Atk. ↑ {{value}}", "1812050": "Debut: S.Atk ↑ {{value}}", "1812060": "Hit: S.Atk ↓ & S.Def ↓ {{value}}", "1812070": "Fairy-Z Hit: Stat ↓ Twice {{value}}", "1812080": "Hit BRN Opp: Stat ↓2 {{value}}", "1812090": "Hit Trap. Opp: Spd. ↓2 {{value}}", "1812110": "T-Move MP 1 or More & Hit: S.Def ↓ {{value}}", "1812130": "Hit Conf. Opp: Acc. ↓ {{value}}", "1812150": "Hit BRN Opp: Atk. ↓ & S.Atk ↓ {{value}}", "1812160": "Hit: Atk. ↓2 {{value}}", "1812170": "Strike: Spd. ↑ {{value}}", "1812180": "Hit: S.Atk ↓4 {{value}}", "1812190": "1st Use Status P-Move: S.Atk ↑ {{value}}", "1812210": "Hit: S.Def ↓3 {{value}}", "1812270": "Sunny Ally Hit: Team Spd. ↑ {{value}}", "1812290": "P-Move on Opp: S.Atk ↓ {{value}}", "1812300": "Hit: Acc. ↓3 {{value}}", "1812310": "M-Move: Def. ↑ & S.Def ↑ {{value}}", "1812330": "Fighting-Z & Hit: S.Def ↓ {{value}}", "1812340": "User Sets Unova C (Spec): Team Def. & S.Def ↑2 {{value}}", "1812350": "Hit: Team Def. ↑2 & S.Def ↑2 {{value}}", "1812370": "Close Combat: Atk. ↓ & S.Atk ↓ {{value}}", "1812380": "Hit BRN Opp: Def. ↓ & S.Def ↓ {{value}}", "1812390": "User Sets Unova C (Spec): Team Atk. ↑2 {{value}}", "1812400": "User Sets Unova C (Spec): Team S.Atk ↑2 {{value}}", "1812410": "S-Tera: Atk. ↑ {{value}}", "1812430": "1st Time User Sets Rock DF: Atk. ↑ {{value}}", "1812450": "Rock DF Opp & Hit: Stat ↓2 {{value}}", "1812460": "Move: Team Atk. ↑ & Spd. ↑ {{value}}", "1812470": "Hit BRN Opp: Atk. & Def. ↓2 {{value}}", "1812480": "Hit PSN Opp: Def. & S.Def ↓ {{value}}", "1812490": "Hit: Def. ↓6 {{value}}", "1812500": "Hit: S.Def ↓6 {{value}}", "1812510": "Ally Sets Circle: Team Spd. ↑2 {{value}}", "1812520": "1st Time User Sets Johto C (Spec): Team S.Atk ↑ {{value}}", "1812540": "Phys Hit: PM⇑3 {{value}}", "1812550": "Spec Hit: SM⇑3 {{value}}", "1812560": "Debut: Team Atk. & S.Atk ↓ {{value}}", "1812570": "Hit: S.Atk ↓2 {{value}}", "1812580": "Hit: Def. & Spd. ↓ {{value}}", "1812590": "Hit Conf. Opp: S.Def ↓2 {{value}}", "1812620": "Def Posture: Team Def ↓4 {{value}}", "1812630": "Def Posture: Team S.Def ↓4 {{value}}", "1812640": "P/S-Move on Opp: Def & S.Def ↓2 {{value}}", "1812670": "Debut: Team Def. ↑ & S.Def ↑ {{value}}", "1812680": "Entry: Atk. ↑6 & Crit ↑{{value}}", "1812690": "Move on Opp: Atk. ↓2 {{value}}", "1812700": "Move on Opp: S.Atk ↓2 {{value}}", "1812710": "Hit: Atk. & Def. ↓2 {{value}}", "1812720": "Debut: S.Atk ↑{{value}} & Crit ↑3", "1812730": "Use Status P-Move on Opp: Atk. ↓ & S.Atk ↓ {{value}}", "1812740": "Grassy-T & Hit: Def. ↓2 {{value}}", "1812750": "Rock-Z & Hit: Atk. ↓2 {{value}}", "1812760": "Hit Conf. Opp: Stat ↓2 {{value}}", "1812770": "Hit: Atk. ↓ & Def. ↓ {{value}}", "1812790": "User Sets Circle: Team Spd. ↑2 {{value}}", "1812810": "Electric-T Hit: Stat ↓ {{value}}", "1812820": "Debut: Sync CD ↓1 & Crit ↑3", "1812840": "Hit: Team Atk. ↑2 {{value}}", "1812850": "Hit: Team S.Atk ↑2 {{value}}", "1902310": "Fairy-Z Ext. {{value}}", "1902380": "Rock-Z Ext. {{value}}", "1902420": "Electric-T Debut & Ext. {{value}}", "1902430": "Fairy-Z Debut & Ext. {{value}}", "1902440": "Grassy-T Debut & Ext. {{value}}", "1902450": "Psychic-T Debut & Ext. {{value}}", "1902460": "Buff Block Ext. {{value}}", "1902530": "Ice-Z Ext. {{value}}", "1902550": "Debut: Ghost-Z", "1902580": "Dragon-Z Ext. {{value}}", "1902590": "S-Move: Dark-Z", "1902610": "Dark DF Ext. {{value}}", "1902620": "1st S-Move: No Stat ↑", "1902640": "Poison-Z Ext. {{value}}", "1902650": "1st S-Move: Poison-Z", "1902660": "Electric-T Ext. {{value}}", "1902670": "1st S-Move: Normal-Z", "1902680": "Unova C (Phys) Ext. {{value}}", "1902690": "S-Move: Flying-Z", "1902700": "Flying-Z Ext. {{value}}", "1902710": "Kanto C (Spec) Ext. {{value}}", "1902730": "Johto C (Phys) Ext. {{value}}", "1902740": "Grassy-T Ext. {{value}}", "1902760": "Debut: Rock-Z", "1902770": "S-Move: Rock-Z", "1902780": "Steel-Z Ext. {{value}}", "1902790": "Sinnoh C (Def) Ext. {{value}}", "1902800": "Debut: Electric-T", "1902810": "Debut: Poison-Z", "1902820": "Ground-Z Ext. {{value}}", "1902830": "Move: No Stat ↑ {{value}}", "1902840": "1st Use Status P-Move: Steel-Z", "1902850": "Unova C (Def) Ext. {{value}}", "1902860": "1st Hit: No Stat ↑", "1902870": "Debut: Dark-Z", "1902880": "Galar C (Spec) Ext. {{value}}", "1902900": "M-Move: Allied Field MG →+", "1902910": "Ghost-Z Ext. {{value}}", "1902920": "Dark-Z Ext. {{value}}", "1902930": "Alola C (Spec) Ext. {{value}}", "1902940": "Alola C (Def) Ext. {{value}}", "1902960": "Pasio C (Def) Ext. {{value}}", "1902970": "S-Move: Ice-Z", "1902980": "Debut: Grassy-T", "1902990": "G-Max Drum Solo: Grassy-T", "1905010": "1st Use Rain Dance: Fairy-Z", "1905030": "Max Knuckle: Fighting-Z", "1905040": "Max Airstream: Flying-Z", "1905050": "M-Move: Sunny", "1905060": "1st S-Move: Ice-Z", "1905070": "1st S-Move: Dragon-Z", "1905080": "1st Use Sunny Day: Grassy-T", "1905090": "M-Move: Normal-Z", "1905100": "Normal-Z Ext. {{value}}", "1905110": "Paldea C (Def) Ext. {{value}}", "1905120": "M-Move: Ghost-Z", "1905130": "Debut: Psychic-T", "1905140": "1st P-Move: Fighting-Z", "1905150": "M-Move: Poison-Z", "1905160": "1st P-Move: Psychic-T", "1905170": "Psychic-T Ext. {{value}}", "1905190": "1st S-Move: Rock-Z", "1905210": "1st “Berry” MP 0: Steel-Z", "1905230": "G-Max Smite: Fairy-Z", "1905240": "1st Use Fairy Wish: Electric-T", "1905250": "Max Rockfall: Rock-Z", "1905260": "Debut: Bug-Z", "1905270": "Bug-Z Ext. {{value}}", "1905290": "Max Quake: Ground-Z", "1905300": "Use Electric-T: Poison-Z", "1905310": "1st S-Move: Grassy-T", "1905320": "Debut: Normal-Z", "1905330": "1st T-Move: Grassy-T", "1905340": "Debut: Alola C (Spec)", "1905360": "User Sets Rain: Galar C (Spec)", "1905370": "User Sets Grassy-T: Galar C (Phys)", "1905380": "User Sets Sunny W: Galar C (Def)", "1905400": "Debut: Paldea C (Spec)", "1905410": "1st S-Move: Paldea C (Spec)", "1905420": "Ground-Z: MG → {{value}}", "1905440": "Poison DF Ext. {{value}}", "1905470": "Entry: No Stat ↑", "1905480": "Kanto C (Def) Ext. {{value}}", "1905490": "Hoenn C (Def) Ext. {{value}}", "1905500": "1st S-Move: Kanto C (Def)", "1905510": "1st S-Move: Hoenn C (Def)", "1905520": "1st S-Move: Paldea C (Def)", "1905530": "Sinnoh C (Spec) Ext. {{value}}", "1905540": "MG → Field Ext. {{value}}", "1905550": "Hoenn C (Phys) Ext. {{value}}", "1905560": "Johto C (Def) Ext. {{value}}", "1905570": "1st Use Paldea Solidarity: Fairy-Z", "1905580": "M-Move: EX Bug-Z", "1905590": "Johto C (Spec) Ext. {{value}}", "1905600": "Debut: Johto C (Spec)", "1905610": "1st T-Move: Paldea C (Def)", "1905620": "Debut: Unova C (Def)", "1905630": "1st S-Move: Unova C (Def)", "1905640": "M-Move: Dragon-Z", "1905650": "Fighting-Z Ext. {{value}}", "1905660": "1st S-Move: Johto C (Def)", "1905670": "1st S-Move: Kalos C (Def)", "1905680": "1st S-Move: Galar C (Def)", "1905690": "Kalos C (Def) Ext. {{value}}", "1905700": "Galar C (Def) Ext. {{value}}", "1905720": "1st Hit: EX Flying-Z", "1905730": "Debut: Field Special DR & Ext. {{value}}", "1905740": "1st Hit: Ghost-Z", "1905750": "1st Hit: Ghost-Z & Ext. {{value}}", "1905770": "User Sets Sunny: Fighting-Z", "1905780": "Debut: Paldea C (Def)", "1905800": "Entry: Johto C (Phys) & Team PM⇑{{value}}", "1905810": "1st Hit: Rock-Z", "1905820": "1st Hit: Dragon-Z", "1905840": "1st Hit: EX Poison-Z", "1905860": "1st T-Move: EX Ghost-Z", "1905870": "1st Hit: EX Electric-T", "1905880": "1st Hit: EX Ground-Z", "1905890": "1st S-Move: Fairy-Z", "1905900": "Sun & Fighting-Z Ext. {{value}}", "1905950": "Rock DF Ext. {{value}}", "1905960": "S-Tera: Dark-Z", "1905970": "Unova C (Spec) Ext. {{value}}", "1905980": "Debut: Fighting-Z", "1906000": "Debut: Galar C (Def) on Field & Ext. {{value}}", "1906020": "Debut: Sinnoh C (Spec) on Field & Ext. {{value}}", "1906030": "Debut: Kanto C (Phys) & Ext. {{value}}", "1906060": "Ally Sets Sunny: Ground-Z", "1906070": "1st S-Move: Ghost-Z", "1906080": "1st Hit: Psychic-T & Ext. {{value}}", "1906140": "1st S-Move: Flying-Z", "1906150": "1st Hit: Poison-Z", "1906160": "1st T-Move: Bug-Z", "1906190": "S-Move: Normal-Z", "1906200": "B-Move Hit: Grassy-T", "1906210": "B-Move Hit: Grassy-T & Extension {{value}}", "1906230": "1st Hit: Bug-Z", "1906240": "1st S-Move: Psychic-T", "1906270": "Debut: Continuous Flying-Z", "1906310": "1st Hit: Ice-Z", "1906320": "1st Use Status P-Move: Ground-Z", "1906330": "1st T-Move: Flying-Z", "1906340": "1st S-Move: Poison-Z & Ext. {{value}}", "1906360": "M-Move: Dark-Z", "1906370": "1st Hit: Fairy-Z", "1906390": "Grassy-T & Rock-Z Ext. {{value}}", "1906410": "Move: Dark-Z", "1906420": "Move: Rainy & Dark-Z", "1906430": "Rain & Dark-Z Ext. {{value}}", "1906440": "1st S-Move: Rainy & Ext. {{value}}", "1906450": "Sinnoh C (Phys) Ext. {{value}}", "1906460": "1st Hit: Rock-Z & Ext. {{value}}", "1906470": "1st B-Move Hit: EX Fighting-Z", "1906480": "Kalos C (3 Kinds) Ext. {{value}}", "1906490": "Paldea C (Phys) Ext. {{value}}", "1906500": "User Sets Steel-Z: Galar C (Def) on Field", "1906560": "Kanto C (Phys) Ext. {{value}}", "1906570": "Galar C (Phys) Ext. {{value}}", "1906620": "1st “Rainbow Jewel Tera Blast”: Normal-Z", "1906630": "1st S-Move: Kanto C (3 Kinds) on Field & Ext. {{value}}", "1906640": "1st Hit: Electric-T", "1906670": "1st Hit: Dark-Z & Ext. {{value}}", "1906680": "Debut: Continuous Fairy-Z", "1906710": "Debut: Continuous Dark-Z", "1906720": "1st S-Move: Fighting-Z ｜ Fighting-Z: Team Crit Imm.", "1906730": "1st “A Aura Sphere” MP 0: Kalos C (Spec)", "1906740": "Kalos C (Spec) Ext. {{value}}", "1906750": "1st “A Rock Smash” MP 0: Kalos C (Phys)", "1906760": "Kalos C (Phys) Ext. {{value}}", "1906770": "Physical & Special DR Ext. {{value}}", "1906780": "Move: Phys. & Spec. DR on Field {{value}}", "1906790": "1st Hit: Flying-Z", "1906830": "1st S-Move: Normal-Z & Ext. {{value}}", "1906840": "Entry: Psychic-T", "1906850": "1st Hit: Grassy-T", "1906860": "1st Hit: Grassy-T & Ext. {{value}}", "1906880": "1st Hit: Fighting-Z", "2101030": "Dark-Z: Team Crit Immunity", "2101040": "Ice-Z: Team Crit Immunity", "2101050": "Paldea C (Def): Team Crit Immunity", "2101060": "Psychic-T: Crit Immunity", "2101110": "Rock-Z: Team Crit Immunity", "2101130": "Normal-Z: Team Crit Immunity", "2101150": "Flying-Z: Crit Immunity", "2101160": "Dragon-Z: Team Crit Immunity", "2301170": "P-, M-Moves Expansion", "2301190": "Sunny: Atk. ↑ {{value}}", "2301200": "Electric-T: S.Atk ↑ {{value}}" }, "fr": { "1101280": "Obst. de Smashings", "1101350": "Enn. Para. Capa. Off. Soin {{value}}", "1101380": "Prem. Act. Stat. Util. Soin {{value}}", "1101390": "Capa. Off. Soin {{value}}", "1101400": "C. Dress. Soin Moyen {{value}}", "1101420": "Z. Glace C. Util. Coa. Soin {{value}}", "1101430": "Prem. Capa. Duo Soin Moyen {{value}}", "1101450": "Enn. Tour. Capa. Off. Soin {{value}}", "1101460": "Désesp. Brûl. C.O. Soin Moyen {{value}}", "1101470": "Enn. Empois. C. Off. Soin {{value}}", "1101500": "Enn. Para. C.Off. Coa. Soin {{value}}", "1101520": "Capa. D.D. Coach Soin {{value}}", "1101530": "Prem. Réflexe C.Duo Coa. Soin {{value}}", "1101540": "Enn. Ligoté Allié C.Off. Soin {{value}}", "1101550": "Coéquipier C.Duo Coach Soin {{value}}", "1101560": "Fatigue Soin Conso PPC Soin 5", "1101570": "Z. Normal Réf. Coa. Soin {{value}}", "1101580": "Z. Normal Réf. C.D. Coa. Soin {{value}}", "1101590": "Réf. Act. C.D. Fat. Conso. Baie Soin {{value}}", "1201030": "Turbo Alter. {{value}}", "1201250": "Turbo Changement MZC {{value}}", "1202010": "Rcp'Jge {{value}}", "1202230": "Brûlure Capa. Off. Jauge 2↑ {{value}}", "1202240": "Pluie C.Off. Touche Jauge ↑ {{value}}", "1202250": "Enn. Carcan C.Off. Jauge 2↑ {{value}}", "1202260": "Enn. Confus Allié C.Off. Jauge 2↑ {{value}}", "1202270": "Enn. Confus Allié C.Off. Jauge ↑ {{value}}", "1301030": "Puissance Alter. {{value}}", "1301040": "Ult.-Eff. {{value}}", "1301050": "Condens. {{value}}", "1301070": "Renforce Combo {{value}}", "1301210": "Alter. E. Pui. ↑ {{value}}", "1301270": "Puissance Empois. {{value}}", "1301310": "Déf. Spé. ↑ ⇒ Pui. Capa. ↑", "1301500": "Pleine Forme C. Suiv. Ult.-Eff.", "1301590": "Action Cons. ↓ {{value}}", "1301600": "Tête de Gel Ult.-Eff. {{value}}", "1301640": "Action Capa. Duo Ult.-Eff. {{value}}", "1301710": "Act. C. D. C.DD. Ult.-Eff. {{value}}", "1301780": "Enn. A.D. Roche Puis. ↑ {{value}}", "1301950": "Déf. ↑ Puis. ↑ {{value}}", "1301960": "Déf. Spé. ↑ Puis. ↑ {{value}}", "1301970": "Enn. Ligoté Coach Puis. {{value}}", "1301990": "A. D. Ténèbres Enn. Puis. ↑ {{value}}", "1302040": "Attén. {{value}}", "1302210": "Zone Ténèbres Stoïcisme C. Off. {{value}}", "1302220": "Z. Insecte Coa. Stoic. C. Off. {{value}}", "1302230": "Z. Dragon Stoic. C. Off. {{value}}", "1302240": "Cercle Stoïcisme Capa. Off. {{value}}", "1302250": "Sable Coach Stoïcisme Spé. {{value}}", "1302260": "Z. Fée Coa. Stoïc. C. Off. {{value}}", "1302270": "Z. Sol Stoïc. C. Off. {{value}}", "1302280": "Grêle Coa. Stoïc. Phys. {{value}}", "1302290": "Z. Roche Coa. Stoïc. Phy. {{value}}", "1302300": "Z. Roche Coa. Stoïc. Spé. {{value}}", "1302310": "A.D. Tén. Enn. Coa. Stoï. C.O. {{value}}", "1302320": "Enn. Résil. ↓ Coa. Stoï. C.O. {{value}}", "1302330": "Z. Glace Coa. Stoïc. Spé. {{value}}", "1302340": "Soleil Coach Stoïc. Spé. {{value}}", "1302350": "Enn. Empois. Coa. Stoï. A.C.D. {{value}}", "1302360": "S.E. Réflexe Coa. Stoï. A.C.D. {{value}}", "1302370": "Coach Stoïc. Dégâts Phy. {{value}}", "1302380": "Ciblé par ETA Coa. Stoï. C.O. {{value}}", "1302390": "Ch. Herbu Coa. Stoï. C.Off. {{value}}", "1302400": "Éq. Tur. Coa. Stoï. A. C.D. {{value}}", "1302410": "S.E. Réfl. Stoï. Act. C.D. {{value}}", "1302420": "Sol.EX Stoï. Act. C.D. C.DD. Eau {{value}}", "1302430": "Plu.EX Stoï. Act. C.D. C.DD. Feu {{value}}", "1302440": "Éq. Tur. Stoï. Capa. Off. {{value}}", "1302450": "Soleil Coach Stoï. Capa. Off. {{value}}", "1303050": "Aiguisé Action Capa. Duo Crit.", "1306090": "Enseign. de Corrifey", "1306110": "Prem. C.D. Récup'PPC C. Synchro {{value}}", "1306120": "Atq. PPC Capa. Dr. Récup'PPC {{value}}", "1306140": "C. D. Baie Récup'PPC {{value}}", "1306150": "Coéq. C.D. Récup'PPC C.S. {{value}}", "1306160": "C.S. Récup'PPC Capa. Dress. {{value}}", "1306170": "Prem. C.D. Récup'PPC Baie {{value}}", "1306180": "Prem. C.D. Récup'PPC Act. Sta. {{value}}", "1306190": "Prem. Ch.É. Util. Réc.PPC C.S. {{value}}", "1306200": "1× C.O. Récup'PPC Act. Sta. {{value}}", "1306210": "Prem. Pénurie Réc.PPC Baie {{value}}", "1306220": "Capa. Off. Récup'PPC Baie {{value}}", "1306230": "C.Duo Récup'PPC C.Synchro {{value}}", "1306240": "Châtiment Récup'32 PPC C.S.", "1306250": "C.D. Récup'50 PPC C.S. {{value}}", "1306260": "C. Off. Récup'32 PPC C.S. {{value}}", "1306270": "Ana.Unys Util. Récup'PPC C.S. {{value}}", "1306290": "1e Act. Sta. Util. PPC+1 C.S. {{value}}", "1307030": "Prem. Exténuation Persistance", "1308010": "Zone Poison Puis. ↑ {{value}}", "1308020": "C. Unys Phys. Puis. ↑ {{value}}", "1308030": "Enn. Para. Coach Puis. {{value}}", "1308040": "Chgt. MZC Coa. Puiss. {{value}}", "1308050": "Z. Roche Puissance ↑ {{value}}", "1308060": "Non S. Efficace Puis. ↑ {{value}}", "1308070": "Grêle Coa. Puissance {{value}}", "1308080": "Sable Action C. Duo ↑ {{value}}", "1308090": "C. Passio Déf. Coa. Act. C.D. {{value}}", "1308100": "Soleil Coa. Puis. {{value}}", "1308110": "Allié Vitesse ↑ Pui. ↑ {{value}}", "1308120": "A.D. Ténèbres Enn. Coa. Pui. {{value}}", "1308130": "Déf. ↑ Action Capa. Duo ↑ {{value}}", "1308140": "Enn. Empois. Coa. Puis. {{value}}", "1308150": "Enn. Tourm. Coach Puis. {{value}}", "1308160": "Changement Météo Coa. Puis. {{value}}", "1308170": "Enn. Aucune Stat ↑ Coa. Puis. {{value}}", "1308180": "C. Paldea Déf. Coach Puis. {{value}}", "1308190": "Ennemi Altér. Coach Puis. {{value}}", "1308200": "C. Unys Déf. Coach Puis. {{value}}", "1308210": "Enn. A.D. Poison Coa. Puis. {{value}}", "1308220": "Ennemi Endormi Coach Pui. {{value}}", "1308230": "Ennemi Confus Coach Pui. {{value}}", "1308240": "Ennemi Brûlé Coach Pui. {{value}}", "1308250": "Zone Fée Coa. Puissance {{value}}", "1308270": "Enn. Vit.↓ Coa. Act. C.D.DD. {{value}}", "1308280": "Soleil Coach Action Capa. Duo {{value}}", "1308300": "Enn. Stat ↓ Pui. ↑ {{value}}", "1308310": "Soleil Coa. Action C.Duo Sol {{value}}", "1308330": "Enn. Altér. Pui. Châtiment × 2", "1308350": "Enn. Résil. ↓ Action C.Duo ↑ {{value}}", "1308370": "Zone Dragon Coach Pui. {{value}}", "1308400": "Zone Combat Coach Pui. {{value}}", "1308420": "C.Unys Spé. Coach Pui. {{value}}", "1308430": "Z. Dragon Action C.Duo ↑ {{value}}", "1308450": "Ennemi A.D. Roche Coa. Pui. {{value}}", "1308530": "Première Capacité Duo Capacité Duo × {{plus}}", "1401040": "Action Util. × 2 Vœu Destr.", "1501180": "Contre Attaque Compteur ↓ {{value}}", "1501260": "Pattes Fulgur.", "1501270": "Ailes Manip.", "1501280": "Aura Malfais.", "1501320": "Capa. Dress. Compteur ↓ {{value}}", "1501330": "Prem. Pénurie Compteur ↓ {{value}}", "1501340": "Act. Sta. Util. Compteur ↓ {{value}}", "1501350": "S. Dragon Util. Compteur ↓ {{value}}", "1501360": "Prem. Capa. Dres. Compteur ↓ {{value}}", "1501370": "S. Ténèbres Util. Compteur ↓ {{value}}", "1501380": "S. Vol Util. Compteur ↓ {{value}}", "1501390": "Prem. Ch.É. Util. Compteur ↓ {{value}}", "1501400": "Prem. A.Décl. C.S.Spé. Compt. ↓ {{value}}", "1501420": "Prem. Act. Sta. Épui. Compt. ↓ {{value}}", "1501430": "S.Acier Util. Compteur ↓ {{value}}", "1501440": "Prem. U.Paldea Util. Compt. ↓ {{value}}", "1501450": "Intro Prem. C.D. Compt. ↓ {{value}}", "1501460": "Prem. Boost Phy. ≥ 6 Compt. ↓ {{value}}", "1501470": "S. Combat Util. Compteur ↓ {{value}}", "1501480": "Duo-Téra. Compteur ↓ {{value}}", "1501490": "Passion pour Unys Util. Compt. ↓ {{value}}", "1502010": "Combat. {{value}}", "1601030": "Capa. Duo Ult.-Eff. {{value}}", "1601460": "Capa. D D. Ult.-Eff. {{value}}", "1601650": "A.D. Acier Enn. Pui. Capa. Duo ↑ {{value}}", "1601680": "Zone Ténèbres Puis. C. D. ↑ {{value}}", "1601690": "Champ Herbu Puis. C.D. ↑ {{value}}", "1601700": "Zone Poison Puis. C.D. ↑ {{value}}", "1601710": "C. Unys Phys. Puis. C.D. ↑ {{value}}", "1601720": "Altération Puis. C. D. ↑ {{value}}", "1601730": "Cercle Coa. C. D. {{value}}", "1601740": "C. Johto Phy. Puis. C. D. ↑ {{value}}", "1601750": "Z. Roche Puis. C. D. ↑ {{value}}", "1601760": "C. Unys Déf. Puis. C.D. ↑ {{value}}", "1601770": "Enn. Résil. ↓ Coa. Puis. {{value}}", "1601780": "Enn. Empois. C.D. D. ↑ {{value}}", "1601790": "C. Paldea Phy. Pui. C.D. ↑ {{value}}", "1601800": "C. Alola Spé. Pui. C.D ↑ {{value}}", "1601810": "Déf. Spé. Enn. ↓ C.D. ↑ {{value}}", "1601820": "Z. Vol Puis. Capa. Duo ↑ {{value}}", "1601830": "Enn. Ligoté Coach Capa. Duo {{value}}", "1601840": "Zone Normal Capa. Duo ↑ {{value}}", "1601850": "Grêle Coa. Pui. Capa. Duo {{value}}", "1601860": "C. Paldea Déf. Coach C. Duo {{value}}", "1601880": "C. Unys Déf. Coach C. Duo {{value}}", "1601890": "Ch. Psy. Puis. Capa. Duo ↑ {{value}}", "1601900": "A.Spé. ↑ Puis. Capa. D.D. ↑ {{value}}", "1601910": "Enn. Carcan Coa. Capa. Duo {{value}}", "1601920": "Enn. Carcan Coa. Puis. {{value}}", "1601930": "Zone Sol Capa. Duo ↑ {{value}}", "1601940": "Enn. A.D. Poison Coa. C.D. {{value}}", "1601950": "Enn. Stat ↓ Capa. Duo ↑ {{value}}", "1601960": "Zone Glace Capa. Duo ↑ {{value}}", "1601970": "C.Sinnoh Spé. Coach Capa. Duo {{value}}", "1601980": "Z. Normal Coach Capa. Duo {{value}}", "1601990": "Pluie Coa. Puis. Capa. Duo {{value}}", "1602070": "Prem. C.D. Attaque PPC Récup'PPC {{value}}", "1602080": "1× Désep. Att. PPC Récup'PPC {{value}}", "1602090": "C.D. Récup'PPC C. Dress. {{value}}", "1603010": "Pluie Pui. C.Duo Dynamax ↑ {{value}}", "1603020": "Éq. Turbo Coa. C. Duo {{value}}", "1603030": "Éq. Turbo C. Duo ↑ {{value}}", "1603040": "Z.Insecte Coach Capa. Duo {{value}}", "1603050": "Cercle Puissance Capa. Duo ↑ {{value}}", "1603060": "Allié Vit. ↑ Capa. Duo ↑ {{value}}", "1603070": "Changem. MZC Coach C.D. {{value}}", "1603100": "Enn. A.D. Roche Coa. C. Duo {{value}}", "1603120": "Z. Combat Coach Capa. Duo {{value}}", "1701010": "Immu. Empois.", "1701170": "Immunité Altér.", "1701180": "Champ Psy. Immunité Altér.", "1701190": "Champ Herbu Immu. Altér.", "1701210": "Champ Électrifié Immu. Altér.", "1701240": "Coach Immunité Empois.", "1701250": "Pluie Immunité Altér.", "1701270": "Zone Roche Immunité Altér.", "1701290": "Zone Fée Coach Immunité Altér.", "1701300": "Grêle Immunité Altér.", "1701320": "Ch. Psy. Coach Immu. Alt. Tour.", "1701330": "Coa. Réf. Act. Capa. ↑Pui. MZC Igno.", "1701340": "Z. Dragon Immu. Tourment", "1701350": "Immunité Alt. Tour.", "1701360": "Z. Glace Coa. Immu. Altér.", "1701370": "Z. Acier Coa. Immu. Alt. Tour.", "1701380": "Z. Sol Coa. Immu. Altér. Tourm.", "1701420": "Ch. Herbu Coach Immu. Alt. Tour.", "1701450": "Zone Poison Coa. Immu. Altér.", "1701460": "Enn. A.D. Poison Coa. Immu. Alt. Tour.", "1701470": "Cercle Coa. Immu. Altér. Tourm.", "1701480": "Éq. Tur. Coa. Immu. Alt. Tour.", "1701490": "Z.Insecte Immunité Altérations", "1702010": "Résist. Empois. {{value}}", "1703010": "Restaur.", "1703150": "Capa. Tour. Traitement {{value}}", "1703160": "C.D. Coa. Ch. Nég. Traite. {{value}}", "1703170": "Capa. Dr. Coa. Alt. Trait. {{value}}", "1704050": "Soleil Régén. {{value}}", "1704090": "Sable Régén. {{value}}", "1704110": "Propag. Statut {{value}}", "1704150": "Pluie Régén. {{value}}", "1704160": "Pleine Forme Régén.", "1704210": "Prem. C. D. Coach Encaiss.", "1704220": "Capacité Empois. Grave {{value}}", "1704230": "Capa. Ennemi Sommeil {{value}}", "1704260": "Capacité Régén. {{value}}", "1704280": "Champ Élec. Régén. {{value}}", "1704290": "Champ Psy. Régén. {{value}}", "1704300": "Capa. Coach Régén. {{value}}", "1704310": "Arrivée Cons. 0", "1704320": "Capacité Duo Cons. 0", "1704330": "Duo Coach Régén.", "1704340": "Première Capa. D. Encaiss.", "1704350": "Capa. Capa. Suiv. Ult.-Eff. {{value}}", "1704370": "Arrivée Capa. Suiv. Ult.-Eff.", "1704380": "Carcan Régén. {{value}}", "1704390": "Critique Cons. 0 {{value}}", "1704410": "Action Cons. 0 {{value}}", "1704420": "Action Statut Util. Suiv. Ult.-Eff. {{value}}", "1704430": "Soleil Action C. Suiv. Ult.-Eff. {{value}}", "1704440": "Pluie Action C. Suiv. Ult.-Eff. {{value}}", "1704460": "Réflexe Cons. 0 {{value}}", "1704470": "Capa. D D. Régén.", "1704480": "Capa. Off. Cons. 0 {{value}}", "1704490": "Prem. Désesp. C. Suiv. Ult.-Eff.", "1704510": "Prem. C. D. C. Suiv. Ult.-Eff.", "1704530": "Capa. D D. C. Suiv. Ult.-Eff.", "1704550": "Capacité Duo Régén.", "1704570": "Capacité Offensive Propag. {{value}}", "1704580": "Coup de Grâce C. Suiv. Ult.-Eff.", "1704600": "Sup.-Eff. Cons. 0 {{value}}", "1704610": "Revenant C. Suiv. Ult.-Eff.", "1704630": "Capacité Dr. Cons. 0 {{value}}", "1704640": "Sup.-Eff. C. Suiv. Ult.-Eff. {{value}}", "1704680": "Fat. A. St. Util. Coa. Boost Spé. +1 {{value}}", "1704710": "Capacité Dr. Suiv. Ult.-Eff. {{value}}", "1704750": "A. St. Util. Coa. Boost Phy. Spé. +1 {{value}}", "1704850": "Capa. Duo C. Suiv. Ult.-Eff. {{value}}", "1704890": "Champ Herbu Régén. {{value}}", "1704990": "Intro Régén.", "1705030": "Empois. Virulent {{value}}", "1705050": "Immu. Alt. Tour. Prolongée {{value}}", "1705060": "Enn. Para. Fiasco ↑ {{value}}", "1706060": "Prép. Boost Phys. +1 {{value}}", "1706110": "Intro Coach Encaiss.", "1706180": "1× En Déf. Succès Coa. Boost Phys. +1 {{value}}", "1706190": "Stat ↓ Cons. 0 {{value}}", "1706240": "Enn. Emp. C. Off. C. Suiv. Ult.-Eff. {{value}}", "1706250": "C. D. C.DD. Coach Boost Phy. +1 {{value}}", "1706280": "Prem. C. D. Coach C. Suiv. Ult.-Eff.", "1706300": "Arrivée Coach Régén.", "1706450": "C.DD. Enn. Ty. Resil. Poison {{value}}", "1706460": "Allié Empois. Ennemi Empoisonné Grave.", "1706510": "A.D. Acier Enn. C. Off. Conso. 0 {{value}}", "1706520": "Déterm. ↑ C. Off. Boost Phys. +3 {{value}}", "1706600": "C. D. Coach Conso. 0 {{value}}", "1706610": "C. Off. Transmission {{value}}", "1706620": "Réflexe Empois. Enn. {{value}}", "1706660": "Capa. Off. 1 Tourment {{value}}", "1706670": "Prem. Capa. Off. Résil. Fée ↓", "1706680": "1× C.D. Coa. Boost Spé. +2 {{value}}", "1706690": "Carc. Enn. C. Off. Conso. 0 {{value}}", "1706700": "Carc. Enn. C. Off. C. Suiv. U.-Eff. {{value}}", "1706710": "A.D. Ténèbres Enn. C. Off. Conso. 0 {{value}}", "1706720": "Enn. Para. C. Off. Boost Spé. +1 {{value}}", "1706730": "C.D. Coach Boost Phys. +2 {{value}}", "1706740": "Prem. C.D. Enn. Résil. Fée ↓", "1706770": "Déclen. Allié MZC Boost Spé. +1 {{value}}", "1706790": "C.D. C.DD. Boost Spé. +2 {{value}}", "1706800": "C.D. Détermination ↑ {{value}}", "1706810": "Capa. Dr. Coa. Conso. 0 {{value}}", "1706820": "Cp. de Grâce Boost Spé. +2 {{value}}", "1706830": "Stat ↓ Boost Phys. +1 {{value}}", "1706840": "1× C.Dr. Coa. Bst. Phys. Spé. +1 {{value}}", "1706850": "Intro Résil. Plante ↑ {{value}}", "1706860": "Capa. Duo Paralysie Enn.", "1706870": "Capa. Dr. Boost Spé. +1 {{value}}", "1706880": "C. Off. Cons. 0 ou Bst. Spé. +{{value}}", "1706890": "C.D.D. Enn. Tyr. Résil. Même Type {{value}}", "1706900": "Capa. Off. Boost Phy. +1 {{value}}", "1706910": "Prem. C.D. Coa. Boost Spé. {{value}}", "1706920": "Déclen. Allié MZC Bst. Phy. +1 {{value}}", "1706930": "Brûl. C. Off. Bst. Phy. +1 {{value}}", "1706940": "Enn. Tourm. C.O. Suiv. U.-E. {{value}}", "1706950": "Capa. Off. Boost Spé. +1 {{value}}", "1706960": "C. O. Touche Bst. Phy. +1 {{value}}", "1706970": "Sable C. Off. Bst. Phy. +1 {{value}}", "1706980": "Arrivée Boost Phy. {{value}}", "1706990": "C.D. D. Coach Bst. Phy. Spé. {{value}}", "1707010": "Cib. par ETA C.O. Conso. 0 {{value}}", "1707020": "E. Résil. ↓ C.O. Conso. 0 {{value}}", "1707030": "C. Off. Touche Peur {{value}}", "1707040": "Faveur Bst. Phy. Spé. +1 {{value}}", "1707050": "C. Duo Boost Phy. Spé. +2 {{value}}", "1707060": "Auto-Décl. ET Cons. 0 {{value}}", "1707070": "C.D. Dynamax Boost Spé. {{value}}", "1707080": "Capa. Soin Coa. Régén.", "1707090": "C.D. Boost Phys. Spé. +1 {{value}}", "1707100": "C.D. D. Phys. Boost Phys. {{value}}", "1707110": "C.D. D. Spé. Boost Spé. {{value}}", "1707120": "C. Capa. Off. Bst. Phy. +1 {{value}}", "1707130": "Intro Coach Boost Phy. {{value}}", "1707140": "E. Pas ↑Stat C.O. B.Phy. +1 {{value}}", "1707150": "Capa. Off. Poison Empois. {{value}}", "1707160": "Auto-Décl. ET Boost Spé. +1 {{value}}", "1707170": "A. Sta. Util. Boost Spé. +1 {{value}}", "1707180": "Intro Boost Phys. {{value}}", "1707190": "Intro Boost Spé. {{value}}", "1707200": "C.D. Boost Spé. +2 {{value}}", "1707230": "Action Boost Phys. +1 {{value}}", "1707240": "Prem. C.D. Coa. Boost Phy. {{value}}", "1707250": "Prép. Boost Spé. +2 {{value}}", "1707260": "Décl. C. Allié Boost Spé. +1 {{value}}", "1707270": "Prép. Boost Spé. +1 {{value}}", "1707280": "Camarade K.O. Boost Phy. {{value}}", "1707290": "Prem. C.D. Enn. Rés. Dragon ↓ {{value}}", "1707300": "Capa. Off. Peur Para. {{value}}", "1707310": "C.O. Conso. Baie Bst. Spé. +3 {{value}}", "1707320": "Cercle Capa. Off. Conso. 0 {{value}}", "1707330": "Capa. Boost C. Duo +4 {{value}}", "1707340": "Stat ↓ Boost Phy. +2 {{value}}", "1707350": "Capa. Boost C. Duo +3 {{value}}", "1707360": "C. Duo Boost C. Duo +5 {{value}}", "1707370": "C.Dr. Coa. Boost Phy. +1 {{value}}", "1707380": "Auto-Décl. C. Coa. Bst. P.S. +1 {{value}}", "1707390": "Atq. PPC Coa. Boost Phy. +1 {{value}}", "1707410": "Arrivée Boost Capa. Duo {{value}}", "1707420": "Prem. Capa. Off. Résil. Plante ↓", "1707430": "Prem. C.D. Boost Phy. {{value}}", "1707440": "C. Sta. Coa. Bst. Phy.Spé. +1 {{value}}", "1707450": "Prem. Pénurie Boost Spécial {{value}}", "1707460": "Prem. Capa. Off. Résil. Poison ↓", "1707470": "C. Duo Dynamax Boost Physique {{value}}", "1707480": "C. Dresseur Boost C. Duo +1 {{value}}", "1707510": "Première Act. Boost Spé. {{value}}", "1707520": "Capa. Off. Boost Capa. Duo +1 {{value}}", "1707530": "C.D.D. Enn. Tyran Tourment {{value}}", "1707540": "Capa. Statut Contagion {{value}}", "1707550": "C.D.D. Enn. Tyran Paralysie {{value}}", "1707560": "Faveur Boost Capa. Duo +2 {{value}}", "1707570": "Cer. Coa. Bst. Phy.Spé. +1 {{value}}", "1707580": "C.D. C.D.D. Boost Physique +2 {{value}}", "1707590": "C.D.D. Coach Boost Capa. Duo {{value}}", "1707600": "Capa. Prochain Garde {{value}}", "1707610": "C.O. Conso. PPC Baie B.Phy. +1 {{value}}", "1707620": "Fiasco Enn. Coa. B.Phy.Spé. +1 {{value}}", "1707630": "Zone Acier Capa. Off. Conso. 0 {{value}}", "1707640": "Coa. Puissance Électrik {{value}}", "1707650": "C. Off. Touche Boost Spé. +1 {{value}}", "1707660": "C. Off. Touche Boost C. Duo +1 {{value}}", "1707670": "A.-Décl. Z.Vol Coa. Bst. Spé. +1 {{value}}", "1707680": "Capa. Dress. Boost Physique +3 {{value}}", "1707690": "Allié Décl. Météo Bst. Spé. +2 {{value}}", "1707700": "Capa. D.D. Boost Capa. Duo {{value}}", "1707720": "C.Dr. Coa. Boost Phy. Spé. +1 {{value}}", "1707730": "1× Fatigue Coa. B.Phy.Spé. +2 {{value}}", "1707740": "Inc.Psy. Util. Coa. B.Spé. +1 {{value}}", "1707760": "C.D.D. Enn. Résil. Même Type ↓ {{value}}", "1707770": "Enn. A.D.Feu C.Off. Bst. Spé. +1 {{value}}", "1707780": "Capa. Off. Boost Capa. Duo +2 {{value}}", "1707790": "Capa. Duo Dyn. Enn. Brûlure {{value}}", "1707800": "Pluie Capa. Off. Conso. 0 {{value}}", "1707810": "Ch. Herbu Capa. Off. Cons. 0 {{value}}", "1707830": "Capa. Duo Dyn. Coa. Boost Phy. {{value}}", "1707840": "Soleil Capa. Off. Conso. 0 {{value}}", "1707850": "Faveur Boost Capa. Duo +4 {{value}}", "1707860": "Capa. Coa. Boost Capa. Duo +1 {{value}}", "1707870": "Prem. C.D. Boost Spé. {{value}}", "1707880": "C.S. Épuisée C.O. B.Spé. +1 {{value}}", "1707900": "Zone Sol Capa. Off. Conso. 0 {{value}}", "1707910": "Capa. Coa. Boost Spécial +2 {{value}}", "1707920": "Capa. Coa. Boost Physique +2 {{value}}", "1707940": "S. Sol Util. Boost Phy. +2 {{value}}", "1707950": "Plu. C.Off. Touche Boost C.D. +1 {{value}}", "1707960": "Réflexe Coa. Boost Phy. +1 {{value}}", "1707970": "Réflexe Coa. Boost Spé. +1 {{value}}", "1708010": "Prem. A.Sta. Épui. Boost Phy. {{value}}", "1708020": "Auto-Décl. Soleil Conso. 0 {{value}}", "1708030": "Ch.É. Capa. Off. Boost Spé. +1 {{value}}", "1708040": "Capa. Coa. Suiv. Ultra-Eff. {{value}}", "1708050": "C.Dr. Épui. C.O. Cons. 0 {{value}}", "1708060": "C.Dr. Épui. C.O. Bst Spé. +2 {{value}}", "1708070": "Enn. Brû. All. C.O. B.Spé. +1 {{value}}", "1708080": "Prem. Pén. Coa. Bst. Phy. {{value}}", "1708090": "Enn. Brû. C.Off. Cons. 0 {{value}}", "1708100": "Capa. Duo Coach Boost Spé. +1 {{value}}", "1708110": "S.Acier Util. Boost Spé. +2 {{value}}", "1708120": "Intro Coa. Boost Spé. {{value}}", "1708130": "Réflexe C.Duo Boost Phy. +2 {{value}}", "1708140": "Enn. A.Dég. Feu C.Off. Conso. 0 {{value}}", "1708150": "Réflexe Coa. Boost Capa. Duo +1 {{value}}", "1708160": "Pluie Capa. Off. Boost Spé. +2 {{value}}", "1708170": "Allié Décl. MZC Coa. B.Spé. +1 {{value}}", "1708220": "C.Off. Touche B.Phy. Spé. +1 {{value}}", "1708230": "Prem. B.Spé. ≥ 6 B.Spé. {{value}}", "1708250": "Allié Décl. Z.Insecte B.Spé. +1 {{value}}", "1708260": "C.Duo Coach Boost Spé. +2 {{value}}", "1708270": "Capa. Coach Cons. 0 {{value}}", "1708280": "Prem. C. Util. Coa. B.Spé. {{value}}", "1708290": "Prem. C.Off. Résil. Normal ↓", "1708300": "Capa. Boost Phy. Spé. +2 {{value}}", "1708310": "Prem. C.D. Déter. ↑ {{value}}", "1708320": "Allié Décl. Cercle Boost Phys. +2 {{value}}", "1708330": "Allié Décl. Cercle Boost C.Duo +3 {{value}}", "1708340": "Allié Stat ↑ Boost Capa. Duo +1 {{value}}", "1708350": "Réfl. C.Duo Coa. Boost Phy. Spé. +1 {{value}}", "1708360": "Enn. Apeuré All. C.O. Boost P.S. +1 {{value}}", "1708380": "Prem. Act. Sta. Util. Prochain Garde", "1708390": "1 Enn. C.Off. B.Phy. Spé. +1 {{value}}", "1708400": "1 Ennemi Capa. Off. Conso. 0 {{value}}", "1708410": "Intro Prem. C.D. Boost Spé. {{value}}", "1708430": "Action Statut Boost Spé. +2 {{value}}", "1708440": "Soleil All. C.O. Boost Spé. +1 {{value}}", "1708450": "Enn. Apeuré All. C.O. Boost C.D. +2 {{value}}", "1708470": "1 Ennemi Capa. Off. Boost Spé. +1 {{value}}", "1708480": "All. Décl. Cercle Coa. Bst. Phy. +1 {{value}}", "1708490": "All. Décl. Cercle Conso. 0 {{value}}", "1708500": "All. MZC Coa. Boost P.S. +1 {{value}}", "1708510": "Coéqu. C.D. Coa. Boost P.S. +1 {{value}}", "1708550": "C.Duo Coach Boost Phy. Spé. +1 {{value}}", "1708570": "1er A.Sta. Util. Coa. Bst.S. {{value}}", "1708580": "Capa. Enc. Pro. Dég. Pour Tous {{value}}", "1708590": "Prem. C.D. Coa. Boost Phy. Spé. {{value}}", "1708600": "Capa. Duo Boost Physique +3 {{value}}", "1708610": "Enn. Alt. Al. C.O. Boost P.S. +1 {{value}}", "1708620": "Enn. Alt. Al. C.O. Boost C.D. +2 {{value}}", "1708630": "Intro Tyran Résil. Spectre {{value}}", "1708640": "Première Capa. Dr. Boost Capa. Duo 10", "1708650": "Z. Spectre Capa. Off. Tourment {{value}}", "1708660": "Enn. Tourm. C.Off. Conso. 0 {{value}}", "1708670": "Enn. Tourm. C.Off. Boost P.S. +1 {{value}}", "1708680": "Prem. C.D. Tyran Résil. Spectre {{value}}", "1708690": "Intro Coa. Suiv. Ultra-Efficace", "1708700": "Action Boost Capa. Duo +1 {{value}}", "1708710": "Capa. Duo Dyn. Boost Phy. Spé. {{value}}", "1708720": "Intro Coach Boost Phy. Spé. {{value}}", "1708730": "Intro Coach Boost Capa. Duo {{value}}", "1708740": "S. Combat Util. Boost Phy. +2 {{value}}", "1708750": "Z. Combat Capa. Off. Conso. 0 {{value}}", "1708760": "All. Ch. Her. Coa. Boost P.S. +1 {{value}}", "1708780": "A.-Décl. Z.Ténèbres Coa. B.Spé. +1 {{value}}", "1708790": "Enn. A.D. Roche C.Off. Conso. 0 {{value}}", "1708800": "Capa. Dres. Boost Spécial +2 {{value}}", "1708810": "Prem. C.D. Coach Prochain Garde", "1708820": "C.Duo Coach Boost Phy. Spé. +2 {{value}}", "1708840": "Prem. C.Off. Boost Phy. Spé. {{value}}", "1708850": "Z. Spectre C.Off. Boost P.S. +1 {{value}}", "1708860": "Prem. C.D. Boost Capa. Duo 10", "1708900": "Al. Décl. Z.Sp. Coa. Boost P.S. +2 {{value}}", "1708910": "Capa. Coach Boost Phy. Spé. +1 {{value}}", "1708920": "Allié Décl. Cercle Coa. Conso. 0 {{value}}", "1708930": "Capa. Off. Boost Phy. Spé. +1 {{value}}", "1708940": "Prem. A. Sta. Util. Coa. Conso. 0", "1708980": "Arrivée Coa. Boost Phy. Spé. {{value}}", "1708990": "A.-Décl. C.Passio Déf. Coa. B.Spé. {{value}}", "1709030": "Prem. C.D. Tyran Résilience Normal {{value}}", "1709040": "Prem. C.D. Tyran Résilience Feu {{value}}", "1709050": "Prem. C.D. Tyran Résilience Eau {{value}}", "1709060": "Prem. C.D. Tyran Résilience Électrik {{value}}", "1709070": "Prem. C.D. Tyran Résilience Plante {{value}}", "1709080": "Prem. C.D. Tyran Résilience Glace {{value}}", "1709090": "Prem. C.D. Tyran Résilience Psy {{value}}", "1709100": "Prem. C.D. Tyran Résilience Ténèbres {{value}}", "1709110": "Prem. C.D. Tyran Résilience Fée {{value}}", "1802100": "Balaie Sable", "1802200": "Z. Fée Coach Immunité ↓Stats", "1802220": "Z. Roche Coa. Immunité ↓Stats", "1802260": "Immu. ↓Stats Action C.Duo Critique", "1803010": "Passe Bâton", "1804070": "Déstab. {{value}}", "1805120": "Sup.-Eff. Critique ↑ {{value}}", "1805130": "Sup.-Eff. Atq. Spé. ↑ {{value}}", "1805160": "Sable Act. C. D. Crit. ↑ {{value}}", "1806020": "Persév. de Paddoxton", "1807080": "Capa. Off. Drain Attaque {{value}}", "1808050": "C. D. Tyran Inversion Stats ↑", "1808060": "C.D. Coach Stats Restaur. {{value}}", "1809090": "Anti Brume Esquive Enn. ↓ {{value}}", "1809410": "Prem. Act. Sta. Coa. Atq. Atq. Spé. {{value}}", "1809990": "Prem. A. St. Util. Coa. Déf. D.Spé. {{value}}", "1810160": "Act. C.D. C.DD. Déf. Spé. Enn. ↓ {{value}}", "1810170": "Act. C.D. C.DD. A.Spé. D.Spé. Enn. ↓ {{value}}", "1810180": "Act. C.D. C.DD. Enn. Stat ↓ {{value}}", "1810240": "Ch. Psy. C. Off. Coa. D.Spé. Ty. D.Spé. {{value}}", "1810500": "Auto Double ↑Stats", "1810780": "Décl. Météo Zone Champ Coa. Esq. {{value}}", "1810790": "Vœu Destr. Util. Coach Stat Identique 2", "1810810": "Enn. Emp. Act. Sta. ↓Stat × {{value}}", "1810860": "C. D. Déf. Spé. ↑ {{value}}", "1810870": "C. D. Déf. Déf. Spé. ↑ {{value}}", "1810930": "Vœu Destr. Util. Coach Stat Identique", "1811050": "Act. Sta. Enn. Util. Déf. Spé. ↓ {{value}}", "1811070": "Prem. C.D. Enn. Déf. Déf. Spé. ↓ {{value}}", "1811090": "Act. C.D. Enn. Déf. 2↓ {{value}}", "1811100": "C. Off. Coach Vit. 2 {{value}}", "1811110": "Enn. Emp. C. O. Atq. Atq.Spé. ↓ {{value}}", "1811120": "Act. C.D. Enn. Déf. Spé. 2↓ {{value}}", "1811130": "A.D. Ténèbres Enn. C.Off. D. D.Spé. ↓ {{value}}", "1811140": "A.D. Ténèbres Enn. C.Off. Vit. ↑ {{value}}", "1811150": "C. Off. Coach Att. {{value}}", "1811160": "C. Off. Coach Atq. Spé. {{value}}", "1811170": "Enn. Ligoté C. Off. Att. ↓ {{value}}", "1811180": "Capa. Enn. Atq. Atq. Spé. ↓ {{value}}", "1811190": "C. Off. Esquive ↑ {{value}}", "1811200": "Capa. Coach Atq. Atq. Spé. {{value}}", "1811210": "Act. C.D. Enn. Atq. 2↓ {{value}}", "1811220": "Act. C.D. Enn. Atq. Spé. 2↓ {{value}}", "1811240": "Déclen. MZC Coach Vit. {{value}}", "1811250": "Enn. Altér. C. Off. Stat 2↓ {{value}}", "1811260": "1ère C. Dr. Coa. Atq. Spé. {{value}}", "1811270": "C. Off. Touche Atq. ↓ {{value}}", "1811280": "Capa. Coa. Déf. Déf. Spé. {{value}}", "1811290": "Capa. Dr. Coa. Vit. Esq. {{value}}", "1811300": "Capa. Atq. Atq. Spé. 2↑ {{value}}", "1811310": "C.DD. Ennemi 7 Stats ↓ {{value}}", "1811320": "Capa. Off. Phy. Déf. 2↓ {{value}}", "1811330": "C. O. Spé. Déf. Spé. 2↓ {{value}}", "1811340": "Act. Stat. Util. Tyr. Atq. {{value}}", "1811350": "Act. Stat. Util. Tyr. Atq. Spé. {{value}}", "1811360": "Capa. Off. Déf. Déf. Spé. ↓ {{value}}", "1811370": "Capa. Duo Enn. Atq. Spé. ↓ {{value}}", "1811380": "Capa. Duo Coa. Atq. Spé. {{value}}", "1811390": "C.D. Coach 5 Stats {{value}}", "1811400": "Z. Poison C. Off. Stat ↓ {{value}}", "1811410": "C. Off. Touche Stat 2↑ {{value}}", "1811420": "Arrivée Atq. Vit. ↑ {{value}}", "1811430": "Act. Sta. Enn. Util. Déf. 2↓ {{value}}", "1811440": "E. Para. C.O. Déf. ↓ {{value}}", "1811450": "Réfl. E. 1/5 Stat 2↓ {{value}}", "1811460": "Prem. C.D. E. ↓Stats × 2", "1811470": "Arr. Atq. Spé. Vit. ↑ {{value}}", "1811480": "C. Off. Touche Déf. Spé. ↓ {{value}}", "1811490": "C. D. 7 Stats ↑ {{value}}", "1811500": "C. Dress. Atq. Atq. Spé. ↑ {{value}}", "1811510": "C.D. D. Coa. Atq. Atq. Spé. {{value}}", "1811520": "1ère A.St. Util. Coa. Crit. {{value}}", "1811530": "Act. Sta. Enn. Util. Atq. 2↓ {{value}}", "1811540": "Réfl. Coa. Atq. Spé. {{value}}", "1811550": "C. C.O. Atq. Atq. Spé. ↓ {{value}}", "1811560": "C.D. Enn. Atq. Atq. Spé. ↓ {{value}}", "1811570": "Arrivée Coa. Esquive {{value}}", "1811580": "Carcan Enn. C.O. Coa. 1/5 Stat {{value}}", "1811590": "Première C.Dr. Déf. Déf. Spé. ↑ {{value}}", "1811600": "A.-Décl. ET E/A Coa. Atq. A.Spé. {{value}}", "1811610": "Act. Sta. Enn. Util. Déf. ↓ {{value}}", "1811620": "Capa. Off. Atq. Atq. Spé. ↓ {{value}}", "1811630": "C.D. D. Enn. Tyr. Déf. Spé. {{value}}", "1811640": "Faveur Défense Spé. ↑ {{value}}", "1811650": "Act. Sta. Util. Atq. Spé. ↑ {{value}}", "1811660": "Arr. Atq. Spé. Déf. Spé. ↑ {{value}}", "1811670": "Enn. Para. C.O. Déf. Spé. ↓ {{value}}", "1811680": "Réfl. Atq. Atq. Spé. Enn. ↓ {{value}}", "1811700": "Carcan Enn. C.O. Atq. A.Spé. ↓ {{value}}", "1811710": "Soleil C.O. Atq. Déf. ↓ {{value}}", "1811730": "Capa. Off. Stat ↓ × 3 {{value}}", "1811740": "Atq. PPC Stat 2↓ {{value}}", "1811750": "Capa. Atq. Spé. 2↑ Crit. 1↑ {{value}}", "1811760": "Soleil C. Off. 2 Stats ↓ {{value}}", "1811770": "Arrivée Atq. Spé. Esq. ↑ {{value}}", "1811780": "Arrivée Atq. Spé. 4↑ Crit. {{value}}↑", "1811810": "Grêle C. Off. Déf. Spé. ↓ {{value}}", "1811820": "Prem. C.D. Tyran Pré. Esq. {{value}}", "1811830": "A.-Décl. C. Coa. Déf. D.Spé. 2 {{value}}", "1811840": "Intro Déf. Déf. Spé. ↑ {{value}}", "1811850": "Capa. Off. Déf. Spé. 2↓ {{value}}", "1811870": "Enn. Para. Capa. Off. Atq. 2↓ {{value}}", "1811880": "Réflexe Coa. Esquive 2 {{value}}", "1811890": "Act. Sta. Util. Déf. D.Spé. ↑ {{value}}", "1811920": "Soleil C.Off. Déf. Déf. Spé. ↓ {{value}}", "1811930": "Capa. DD. Enn. Déf. Spé. ↓ {{value}}", "1811940": "Prem. A.Décl. C.S.Spé. A.Spé. ↑ {{value}}", "1811950": "C.D. Lanceur Déf. D.Spé. ↓ {{value}}", "1811960": "Capa. Lanceur Déf. D.Spé. ↓ {{value}}", "1811970": "Enn. Brû. C.O. A.Spé. D.Spé. ↓ {{value}}", "1811980": "E. Para. C.O. Coa. Atq. A.Spé. {{value}}", "1811990": "Fiasco Enn. Coa. Stat 2 {{value}}", "1812060": "Capa. Off. A.Spé. D.Spé. ↓ {{value}}", "1812070": "Z.Fée C.Off. Stat ↓ × 2 {{value}}", "1812080": "Enn. Brû. C.Off. Stat 2↓ {{value}}", "1812090": "Enn. Ligoté Capa. Off. Vit. 2↓ {{value}}", "1812100": "Allié Décl. MZC Coa. 1/5 Stat 2 {{value}}", "1812110": "C.Dr. ≥1 C.Off. D.Spé. ↓ {{value}}", "1812120": "C.Dr. Épui. C.Off. Stat 2↓ {{value}}", "1812130": "Enn. Confus C.Off. Pré. ↓ {{value}}", "1812140": "Capa. Offensive Stat 2↓ {{value}}", "1812150": "Enn. Brû. C.O. Atq. A.Spé. ↓ {{value}}", "1812160": "Capa. Offensive Attaque 2↓ {{value}}", "1812170": "Capa. Off. Touche Vitesse ↑ {{value}}", "1812180": "Capa. Off. Attaque Spéciale 4↓ {{value}}", "1812190": "1er A. Sta. Util. Atq. Spé. ↑ {{value}}", "1812200": "1er A. Sta. Util. Critiques ↑ {{value}}", "1812210": "Capa. Off. Défense Spé. 3↓ {{value}}", "1812220": "Enn. Altér. All. C.Off. Stat ↓ {{value}}", "1812240": "Réfl. Coa. Stat Identique 2 {{value}}", "1812260": "Act. Statut Util. Vit. 6↑ {{value}}", "1812270": "Soleil All. C.Off. Coa. Vit. {{value}}", "1812280": "Enn. Ligoté All. Capa. Off. Stat ↑ {{value}}", "1812290": "Action Ennemi Atq. Spé. ↓ {{value}}", "1812310": "Capa. Duo Dynamax Déf. Déf. Spé. ↑ {{value}}", "1812320": "Soleil Capa. Off. Déf. ↓ {{value}}", "1812330": "Z. Combat C.Off. Déf. Spé. ↓ {{value}}", "1812340": "A.Décl. C.Unys Coa. D. Déf.S. 2 {{value}}", "1812350": "Capa. Off. Coach Déf. D.Spé. 2 {{value}}", "1812370": "Close Combat Atq. A.Spé. ↓ {{value}}", "1812380": "Enn. Brûlé C.Off. Déf. Déf.S. ↓ {{value}}", "1812390": "A.Décl. C.Unys Spé. Coa. Atq. 2 {{value}}", "1812400": "A.Décl. C.Unys Spé. Coa. Atq.S. 2 {{value}}", "1812410": "Duo-Téra. Attaque ↑ {{value}}", "1812420": "Pluie Capacité Off. Stat 2↓ {{value}}", "1812430": "Prem. A.-Décl. A.D. Roche Atq. ↑ {{value}}", "1812440": "Prem. A.-Décl. A.D. Roche Crit. ↑ {{value}}", "1812450": "Enn. A.D. Roche C.Off. Stat 2↓ {{value}}", "1812460": "Capa. Coach Attaque Vitesse {{value}}", "1812470": "Enn. Brûlé C.Off. Atq. Déf. 2↓ {{value}}", "1812480": "Enn. Emp. C.Off. Déf. D.Spé. ↓ {{value}}", "1812490": "Capa. Offensive Défense 6↓ {{value}}", "1812500": "Capa. Off. Défense Spéciale 6↓ {{value}}", "1812510": "Allié Décl. Cercle Coach Vit. 2 {{value}}", "1812540": "Capa. Off. Phys. Boost Phys. +3 {{value}}", "1812550": "Capa. Off. Spé. Boost Spé. +3 {{value}}", "1812560": "Intro Tyran Atq. Atq. Spé. {{value}}", "1812570": "Capa. Off. Attaque Spéciale 2↓ {{value}}", "1812580": "Capa. Off. Défense Vitesse ↓ {{value}}", "1901010": "Transp.", "1902040": "Arrivée Anti Altér. Équipe", "1902160": "Prem. C. D. Anti Critiques Équi.", "1902180": "Prem. C.Duo Champ Électrifié", "1902280": "Anti Altér. Prolongé {{value}}", "1902480": "Auto Décl. Zone Glace Grêle", "1902570": "Prem. C.D. Grêle", "1902590": "C.D. Zone Ténèbres", "1902600": "Prem. Fatigue Soleil", "1902610": "A. D. Ténèbres Enn.e Prolongée {{value}}", "1902620": "Prem. C.D. Pas ↑Stats Équipe", "1902630": "Capa. Anti-Crit. Équipe {{value}}", "1902650": "Prem. C.D. Zone Poison", "1902660": "Champ Électrifié Prolongé 1", "1902670": "Prem. C.D. Zone Normal", "1902680": "C. Unys Phys. Prolongé {{value}}", "1902690": "Capa. Duo Z. Vol", "1902700": "Z. Vol Prolongée {{value}}", "1902710": "C. Kanto Spé. Prolongé {{value}}", "1902720": "Capa. Dr. Anti-Crit. Équipe {{value}}", "1902730": "C. Johto Phy. Prolongé {{value}}", "1902750": "L. A.Crit. Éqp. Stoï. P.S. Éqp.", "1902760": "Intro Z. Roche", "1902770": "C. D. Z. Roche", "1902780": "Z. Acier Prolongée {{value}}", "1902790": "C. Sinnoh Déf. Prolongé {{value}}", "1902800": "Intro Champ Élec.", "1902830": "Capa. Pas ↑Stats Éqp. {{value}}", "1902840": "1ère Act. Sta. Util. Z. Acier", "1902850": "C. Unys Déf. Prolongé {{value}}", "1902880": "C. Galar Spé. Prolongé {{value}}", "1902900": "C.D. Dynamax Turbo Équipe", "1902930": "C. Alola Spé. Prolongé {{value}}", "1902940": "C. Alola Déf. Prolongé {{value}}", "1902950": "Capa. Dress. Turbo Équipe {{value}}", "1902960": "C. Passio Déf. Prolongé {{value}}", "1902970": "Capa. Duo Zone Glace", "1902990": "Percussion G-Max Ch. Herbu", "1903020": "Immunité A.D. Feu", "1903130": "Immunité A.D. Roche", "1903160": "Immunité A. D. Ténèbres", "1903170": "Immunité A.D. Acier", "1904020": "Résistance A.D. Feu {{value}}", "1904080": "Résist. Aire Dégâts Poison {{value}}", "1904130": "Résistance A.D. Roche {{value}}", "1904160": "Résistance A. D. Ténèbres {{value}}", "1904170": "Résistance A.D. Acier {{value}}", "1904190": "Résis. Toutes A.D. {{value}}", "1905010": "Prem. Danse Pluie Util. Z. Fée", "1905050": "Capa. Duo Dynamax Soleil", "1905060": "Prem. C.D. Zone Glace", "1905070": "Prem. C.D. Zone Dragon", "1905090": "Capa. Duo Dynamax Zone Normal", "1905110": "C. Paldea Déf. Prolongé {{value}}", "1905120": "Capa. Duo Dynamax Zone Spectre", "1905150": "Capa. Duo Dynamax Zone Poison", "1905160": "Prem. Action Champ Psychique", "1905170": "Ch. Psychique Prolongé {{value}}", "1905190": "Prem. C.D. Zone Roche", "1905200": "Prem. Capacité Offensive Pluie", "1905240": "Prem. Souhait Fée Util. Ch. Élec.", "1905300": "Ch. Électrifié Util. Zone Poison", "1905310": "Prem. C.D. Ch. Herbu", "1905330": "Première Capa. Dress. Ch. Herbu", "1905360": "Auto-Décl. Pluie C.Galar Spé. Équipe", "1905370": "Auto-Décl. Ch. Herbu C.Galar Phy. Équipe", "1905380": "Auto-Décl. Soleil C.Galar Déf. Équipe", "1905390": "Capa. Duo Météo Traitement {{value}}", "1905410": "Prem. C.D. C.Paldea Spé. Équipe", "1905430": "Capa. Duo Aire Dégâts Poison", "1905480": "C.Kanto Défensif Prolongé {{value}}", "1905490": "C.Hoenn Défensif Prolongé {{value}}", "1905500": "Prem. C.D. C.Kanto Déf. Équipe", "1905510": "Prem. C.D. C.Hoenn Déf. Équipe", "1905520": "Prem. C.D. C.Paldea Déf. Équipe", "1905530": "C.Sinnoh Spécial Prolongé {{value}}", "1905550": "C.Hoenn Physique Prolongé {{value}}", "1905560": "C.Johto Défensif Prolongé {{value}}", "1905570": "Prem. U.Paldea Util. Zone Fée", "1905580": "Capa. Duo Dynamax Zone Insecte EX", "1905590": "C.Johto Spécial Prolongé {{value}}", "1905600": "Intro C.Johto Spécial Équipe", "1905610": "Prem. C.Dr. C.Paldea Déf. Équipe", "1905620": "Intro C.Unys Défensif Équipe", "1905630": "Prem. C.D. C.Unys Déf. Équipe", "1905640": "Capa. Duo Dynamax Zone Dragon", "1905660": "Prem. C.D. C.Johto Déf. Équipe", "1905670": "Prem. C.D. C.Kalos Déf. Équipe", "1905680": "Prem. C.D. C.Galar Déf. Équipe", "1905690": "C.Kalos Défensif Prolongé {{value}}", "1905700": "C.Galar Défensif Prolongé {{value}}", "1905710": "Intro C.Sinnoh Défensif Équipe", "1905720": "Prem. Capa. Off. Zone Vol EX", "1905730": "Intro Stoï. Spé. Équipe Prolongé {{value}}", "1905740": "Prem. Capa. Offensive Zone Spectre", "1905750": "Prem. C.Off. Z.Spectre Prolongée {{value}}", "1905760": "Capa. Duo Stoïcisme Spécial Équipe", "1905770": "Auto-Décl. Soleil Zone Combat", "1905780": "Intro C.Paldea Défensif Équipe", "1905790": "Intro C.Unys Spécial Équipe", "1905800": "Arr. C.Johto Phy. Coa. Bst.P. {{value}}", "1905810": "Prem. Capa. Offensive Zone Roche", "1905820": "Prem. Capa. Offensive Zone Dragon", "1905830": "Prem. C.D. C.Kanto Phy. Équipe", "1905840": "Prem. Capa. Off. Zone Poison EX", "1905850": "Prem. C.D. C.Sinnoh Spé. Équipe", "1905860": "Prem. Capa. Dr. Zone Spectre EX", "1905870": "Prem. Capa. Off. Champ Électrifié EX", "1905880": "Prem. Capa. Offensive Zone Sol EX", "1905890": "Prem. C.D. Zone Fée", "1905900": "Soleil Prolongé Z.Combat Pro. {{value}}", "1905910": "Prem. Capa. Off. C.Paldea Déf. Équipe", "1905920": "Prem. C.D. C.Sinnoh Déf. Équipe", "1905930": "Prem. C.D. C.Alola Déf. Équipe", "1905940": "Intro C.Hoenn Défensif Équipe", "1905950": "Ennemi Aire Dég. Roche Prolongée {{value}}", "1905970": "C.Unys Spécial Prolongé {{value}}", "1905990": "Intro C.Galar Défensif Équipe", "1906000": "Intro C.Galar Déf. Équipe Pro. {{value}}", "1906010": "Intro C.Sinnoh Spécial Équipe", "1906020": "Intro C.Sinnoh Spé. Équipe Pro. {{value}}", "1906030": "Intro C.Kanto Phy. Équipe Pro. {{value}}", "1906050": "Prem. C.D. C.Kanto Spé. Équipe", "1906070": "Prem. C.D. Zone Spectre", "1906080": "Prem. C.Off. Ch.Psy. Pro. {{value}}", "1906090": "Prem. C.D. C.Unys Phy. Équipe", "1906140": "Prem. C.D. Duo Zone Vol", "1906730": "Prem. Aurasphère S Épuisée Cercle de Kalos Spé. Éq.", "1906750": "Prem. Éclate-Roc S Épuisé Cercle de Kalos Phys. Éq.", "2101030": "Z. Ténèbres Coach Immu. Crit.", "2101040": "Zona Ghiaccio barriercolpo-G", "2101050": "Cerchia di Paldea (difensiva) barriercolpo-G", "2101080": "Enn. Aire Dégâts Poison Coa. Immu. Crit.", "2101090": "Équipe Turbo Coach Immu. Crit.", "2101100": "C.Unys Spécial Coach Immu. Critiques", "2201020": "Tourm. {{value}}", "2201070": "Accabl. ↓Stats × 2", "2301180": "Act. Sta. Enn. Tyran Stats {{value}}", "2301200": "Ch. Élec. Attaque Spéciale ↑ {{value}}", "2301220": "Action Capa. Duo Offensives Diffusion", "2801010": "Insp. de Galar", "2801030": "Conv. de Hoenn", "2801040": "Insp. d'Unys", "2801050": "Insp. de Hoenn", "2801060": "Insp. d'Alola", "2801070": "Conv. d'Alola", "2801080": "Insp. de Kalos", "2801090": "Conv. de Johto", "2801110": "Insp. de Johto", "2801120": "Insp. de Kanto", "2801130": "Conv. de Kanto", "2801150": "Conv. de Kalos", "2801170": "Conv. de Galar", "2801190": "Conv. de Sinnoh", "2802040": "Insp. de Sinnoh", "3201010": "Quiete del bosco", "3201020": "Principessa rosa di Kalos", "3201030": "Detective di Luminopoli", "3201040": "Titolo: Pioggia di passaggio", "3201050": "Filantropo dedito allo sviluppo di Galar", "3201060": "Talentuosa segretaria della Macro Cosmos", "3201070": "Temperamento ardente", "3201080": "Energia illimitata per le lotte", "3201090": "Spietato spadaccino", "3201100": "Firmamento eterno", "3201110": "Let's go, Eevee!", "3201120": "Acrobata sottozero", "3201130": "Cortesia professionale", "3201140": "Neanche un graffio", "3201150": "Ardente come la brace", "3201160": "Cuore giusto e senza pari", "3201170": "Mente curiosa da Memoride", "3201180": "Orgoglio del più forte", "3201190": "Un viaggio dalle mille sfumature di rosso", "3201200": "Un viaggio dalle mille sfumature di blu", "3201210": "Un viaggio dalle mille sfumature di verde", "3201220": "L'eroe di Unima", "3201230": "Ragazza dal cuore di drago", "3201240": "Capometrò in nero", "3201250": "Capometrò in bianco", "3201260": "Adamabagliore", "3201270": "Selfie del deserto", "3201280": "Avvenire dorato", "3201290": "Lottatrice d'ombra", "3201300": "Tutta l'esperienza di Hoenn", "3201560": "Partenza verso la vittoria", "3201570": "Guidare con prudenza", "3201580": "Uoooooh! Uoooooh!!!", "3201590": "Fermi dove siete!", "3201600": "Vediamo di cosa siamo capaci", "3201710": "Se reduce en 1 el contador de movimientos compi del usuario al entrar en combate por primera vez en cada combate. Aplica el efecto Aguante al usuario si tiene los PS al máximo al entrar en combate. Reduce la Defensa Especial del objetivo en 1 nivel cuando el movimiento de ataque del usuario contra el objetivo acierta.", "3201730": "Cambia el tiempo a soleado cuando el usuario usa su movimiento compi por primera vez en cada combate. Aplica el efecto Aguante al usuario si tiene los PS al máximo al entrar en combate. Reduce la Defensa y la Defensa Especial del objetivo en 1 nivel cuando el movimiento de ataque del usuario acierta.", "9901050": "Pénétr.", "9901150": "Déterm. de Sacha", "9901190": "Trans. Élégante Type Ténèbres", "9901200": "Trans. Splendide Type Eau", "9901210": "Trans. Silenc. Type Eau", "9901220": "Trans. Inflexible Type Ténèbres", "9901230": "Consécr. de Shehroz", "9901260": "Une palette de possibil.", "9901290": "Éclair blanc retentiss.", "9901330": "Propos. d'Amos", "9901480": "Stratégie Off.", "9901950": "Informazioni sul treno di andata", "9901960": "Informazioni sul treno di ritorno", "9901970": "Ribaltare l'esito", "9901980": "Chi rimarrà in piedi sarà il vincitore!", "9902030": "Vedere per credere" }, "de": { "1101010": "Notfallheil. {{value}}", "1101020": "KP Heilmenge↑ {{value}}", "1101030": "Gegner Fehlschlag Heil. {{value}}", "1101040": "Att.h. {{value}}", "1101050": "K.O. Mitst.heil. {{value}}", "1101060": "GA Heilung {{value}}", "1101070": "GA Heilung T {{value}}", "1101080": "Team Att. Teamh. {{value}}", "1101090": "Abwehr Heilung {{value}}", "1101100": "Treff. Heilung T {{value}}", "1101110": "Gegentreffer Heilung T {{value}}", "1101120": "Effektiv.h. {{value}}", "1101130": "P Att. Voll.h. {{value}}", "1101140": "Effektiv.h. T {{value}}", "1101150": "Erst Notfall KP Voll Heilung", "1101160": "Heilung KP Heil. T {{value}}", "1101170": "Sonnen Attacke Heilung T {{value}}", "1101180": "Sonnen Attacke Heilung {{value}}", "1101190": "Kampf Fokus Gegentr. Heilung T {{value}}", "1101200": "Attackenheil. {{value}}", "1101220": "Treffer Heil. {{value}}", "1101230": "Kampf Fokus Gegentr. Heil. {{value}}", "1101240": "Unlicht Fokus Att. Heil. T {{value}}", "1101250": "G D Att. Heil. {{value}}", "1101260": "Erst Halb KP Heil. {{value}}", "1101270": "Erst GA Heil. T {{value}}", "1101280": "Die Hartnä. v. Spikef.", "1101290": "Gegentr. Heil. {{value}}", "1101300": "Kampf Fokus Heil. {{value}}", "1101310": "Zielverwir. Tr. Heil. {{value}}", "1101320": "Geg. Prob. Tr. Heil. T {{value}}", "1101330": "Grasf. Att. Heil. T {{value}}", "1101340": "Erst KP↓ 60% Heil. {{value}}", "1101350": "Para. Geg. Tr. Heil. {{value}}", "1101360": "Tr. Heil. Ch. {{value}}", "1101370": "Normal Fokus Heil. {{value}}", "1101380": "Erst P Stat. Att. Heil. {{value}}", "1101390": "Angr. Heil. {{value}}", "1101400": "T Att. Heil.ch. {{value}}", "1101410": "Gift Fokus Heil. {{value}}", "1101420": "Eis Fokus Att. Heil. T {{value}}", "1101430": "Erst GA Heil. {{value}}", "1101440": "Freundeskr. Heil. {{value}}", "1101450": "Geg. Stör. Ang. Heil. {{value}}", "1101460": "Notfall + Brand Ang. Heilungsch. {{value}}", "1101470": "Gift Geg. Angr. Heil. {{value}}", "1101480": "Heil. KP Heil. {{value}}", "1101490": "Flug Fokus Heil. {{value}}", "1101500": "Geg. Para. Angr. Heil. T {{value}}", "1101520": "G D Att. Heil. T {{value}}", "1101530": "Erst GA Gegentr. Heilung T {{value}}", "1101540": "Geg. Umschl. Mitstr. Ang. Heilung {{value}}", "1101550": "Team GA Heilung T {{value}}", "1101560": "Halb KP Genesung AEP↓+Heilung 5", "1101570": "Normal Fokus Gegentr. Heilung T {{value}}", "1101580": "Normal Fokus GA Gegentr. Heilung {{value}}", "1101590": "P Att./GA Gegentr. Halb KP Beere AEP↓+Heilung {{value}}", "1101600": "Team GA Heilung {{value}}", "1101610": "P Attacke Heilung T {{value}}", "1101620": "Eis Fokus Heilung {{value}}", "1101630": "Drachen Fokus Heilung {{value}}", "1101640": "KP Heilmenge Null", "1201010": "Regen Leiste↑ {{value}}", "1201020": "Sonnen Leiste↑ {{value}}", "1201030": "Problem Leiste↑ {{value}}", "1201040": "Sandsturm Leiste↑ {{value}}", "1201050": "Hagel Leiste↑ {{value}}", "1201060": "EF Leiste↑ {{value}}", "1201070": "PF Leiste↑ {{value}}", "1201080": "Erstantritt Attackenl.↑ T", "1201090": "Drachen Fokus Attackenl.↑ {{value}}", "1201100": "Flug Fokus Attackenl.↑ {{value}}", "1201110": "Wetterw. Leiste↑ {{value}}", "1201120": "Unlicht Fokus Attackenl.↑ {{value}}", "1201130": "Stahl Fokus Attackenl.↑ {{value}}", "1201140": "Geister Fokus Attackenl.↑ {{value}}", "1201150": "Käfer Fokus Attackenl.↑ {{value}}", "1201160": "Grasfeld Attackenl.↑ {{value}}", "1201170": "Kampf Fokus Attackenl.↑ {{value}}", "1201180": "Feen Fokus Attackenl.↑ {{value}}", "1201190": "Gift Fokus Attackenl.↑ {{value}}", "1201200": "Gesteins Fokus Attackenl.↑ {{value}}", "1201210": "G Feldeff. Attackenl.↑ T {{value}}", "1201220": "Normal Fokus Att.l.↑ {{value}}", "1201230": "Eis Fokus Att.l.↑ {{value}}", "1201240": "Freundeskr. Att.l.↑ {{value}}", "1201250": "Wett./Fok./Feld Wechs. Attackenleiste↑ {{value}}", "1202010": "Att. Att.l.↑ {{value}}", "1202020": "GA Attackenl.↑ {{value}}", "1202030": "Notfall Leiste↑ {{value}}", "1202040": "Gegentreffer Leiste↑ {{value}}", "1202050": "GA Attackenl.↑ T {{value}}", "1202060": "Att. Att.l.↑ T {{value}}", "1202080": "Andere K.O. Attackenl.↑ {{value}}", "1202090": "Geg. Fehlschl. Attackenl.↑ {{value}}", "1202100": "Angr. Att.l.↑ {{value}}", "1202110": "P Att. Att.l.↑ {{value}}", "1202120": "P Att. Voll. Att.l.↑ {{value}}", "1202130": "Voll. Att.l.↑ {{value}}", "1202140": "Abwehr Attackenl.↑ {{value}}", "1202150": "P Stat. Att. Leiste↑ {{value}}", "1202160": "K.O. Treffer Attackenl.↑ {{value}}", "1202170": "Fehlschlag Attackenl.↑ {{value}}", "1202180": "Schemenkraft Attackenl.↑ {{value}}", "1202190": "Treffer Att.l.↑ {{value}}", "1202200": "Zielverwir. Tr. Att.l. 2↑ {{value}}", "1202210": "Geg Flu. Unmögl. Ang Att L↑ {{value}}", "1202220": "Psychof. Att. Att.l.↑ {{value}}", "1202230": "Brand Angr. Att.l. 2↑ {{value}}", "1202240": "Regen Angr. Att.l.↑ {{value}}", "1202250": "G. Wechselsp. Ang. Att.l. 2↑ {{value}}", "1202260": "Geg. Verw. Mitstr. Ang. Attackenl. 2↑ {{value}}", "1202270": "Geg. Verw. Mitstr. Ang. Attackenl.↑ {{value}}", "1202280": "Geg. Verw. Ang. Attackenleiste↑ {{value}}", "1202290": "Geg. Gift Ang. Attackenleiste↑ {{value}}", "1301010": "Notfallst.↑ {{value}}", "1301020": "Sandst. St.↑ {{value}}", "1301030": "Problemst.↑ {{value}}", "1301040": "Effektiv. St.↑ {{value}}", "1301050": "Leistensts↑ {{value}}", "1301060": "Vollt.st.↑ {{value}}", "1301070": "Harmoniest.↑ {{value}}", "1301090": "Wetterw. St.↑ {{value}}", "1301100": "KP Stärke↑ {{value}}", "1301110": "Sonnenst.↑ {{value}}", "1301120": "Geg. Para.st.↑ {{value}}", "1301130": "Gegnerbr. St.↑ {{value}}", "1301140": "Hagelst.↑ {{value}}", "1301150": "Gegn. Gefrierst.↑ {{value}}", "1301160": "Regenst.↑ {{value}}", "1301170": "Verw.st.↑ {{value}}", "1301180": "Gegnerverw. St.↑ {{value}}", "1301190": "Gegner Sp. Ang.↓ St.↑", "1301200": "Gegner KP St.↑ {{value}}", "1301210": "Gegn. Problemst.↑ {{value}}", "1301220": "Geg. Störungsst.↑ {{value}}", "1301230": "Init.↑ St.↑", "1301240": "Vert.↑ St.↑", "1301250": "Gegnerschr. St.↑ {{value}}", "1301260": "Gegner Schlaf St.↑ {{value}}", "1301270": "Gegnergift St.↑ {{value}}", "1301280": "Gegnerumsch. St.↑ {{value}}", "1301300": "Gegner Genau.↓ St.↑", "1301310": "Sp. Vert.↑ St.↑", "1301320": "Gegn. Init.↓ St.↑", "1301330": "Flucht.↑ St.↑", "1301340": "Angr.↑ St.↑", "1301350": "Genau.↑ St.↑", "1301360": "KP↓∝St.↑ {{value}}", "1301370": "EF St.↑ {{value}}", "1301380": "Gegn. Vert.↓∝St.↑", "1301390": "Gegner Sp. Vert.↓ St.↑", "1301400": "Gegner Flucht.↓ St.↑", "1301410": "Gegner Ang.↓ St.↑", "1301420": "Gegner Wert↓∝St.↑", "1301430": "Unlicht St.↑ {{value}}", "1301440": "Feen St.↑ {{value}}", "1301450": "Leistenv.↑ St.↑ {{value}}", "1301470": "Muster Stärke↑", "1301480": "Gegn. Wechsels. St.↑ {{value}}", "1301490": "Sp. Angr.↑ St.↑ {{value}}", "1301500": "Topform Folge Eff. Stärke↑", "1301510": "Wechsels. St.↑ {{value}}", "1301520": "Sonnen Leiste↑ +Stärke↑ {{value}}", "1301530": "Regen Leiste↑ +Stärke↑ {{value}}", "1301540": "Topform St.↑ {{value}}", "1301550": "Init.↓ St.↑ {{value}}", "1301560": "Sandsturmsc. St.↑ {{value}}", "1301570": "Werte↑ St.↑", "1301580": "Normalwetter St.↑ {{value}}", "1301590": "P Attacke Leistenver.↓ {{value}}", "1301600": "Tiefkühlkopf Effektiv.↑ {{value}}", "1301610": "Psychof. St.↑ {{value}}", "1301620": "Drachen Fokus Stärke↑ {{value}}", "1301630": "Wetterw. P Att. +GA Strk.↑ {{value}}", "1301640": "P Att. +GA Effektiv. Strk.↑ {{value}}", "1301650": "Gg. W. Sperre P Att. +GA Strk.↑ {{value}}", "1301670": "Gg. Sp. Ang. +Sp. Vert.↓ St.↑", "1301680": "Unlicht Fokus Stärke↑ {{value}}", "1301690": "Geister Fokus St.↑ 2", "1301700": "Geg. Verw. P Att.+GA St.↑ {{value}}", "1301710": "P Att./GA/G D Att. Eff. Strk.↑ {{value}}", "1301720": "Psycho St.↑ {{value}}", "1301730": "Geg. Normalw. St.↑ {{value}}", "1301740": "Geg. Init.↓ St.↑ {{value}}", "1301750": "Geg. Genauigk.↓ St.↑ {{value}}", "1301760": "Boden Fokus St.↑ {{value}}", "1301770": "Stahl Fokus St.↑ {{value}}", "1301780": "Gegn. Gest. Schadenf. St.↑ {{value}}", "1301790": "Rückst. Att. St.↑ {{value}}", "1301800": "Feen Fokus St.↑ {{value}}", "1301810": "Käfer Fokus St.↑ {{value}}", "1301820": "Gegner Par. P Att. + GA↑ {{value}}", "1301830": "Angr.↑ St.↑ {{value}}", "1301840": "Sp. Angr.↑ St.↑ {{value}}", "1301850": "Grasf. St.↑ {{value}}", "1301860": "Geg. Brand P Att. GA↑ {{value}}", "1301870": "Flug Fokus St.↑ {{value}}", "1301880": "KP↓ Stärke↑ {{value}}", "1301890": "Elektrof. St.↑ T {{value}}", "1301900": "Psychof. St.↑ T {{value}}", "1301910": "Geg. Umschlingung P Att.+GA↑ {{value}}", "1301940": "Init.↑ St.↑ {{value}}", "1301950": "Vert.↑ St.↑ {{value}}", "1301960": "Sp. Vert.↑ St.↑ {{value}}", "1301970": "Geg. Umsch. St.↑ T {{value}}", "1301980": "Hagel P Att. +GA St.↑ {{value}}", "1301990": "Geg. Unl. Schadenf. St.↑ {{value}}", "1302010": "Phys. Schaden↓ {{value}}", "1302020": "Notfallsch.↓ {{value}}", "1302030": "Regensch.↓ {{value}}", "1302040": "Rückstoßsc.↓ {{value}}", "1302050": "Sp. Att. Schaden↓ {{value}}", "1302060": "EF Schaden↓ {{value}}", "1302070": "Topform Schaden↓ {{value}}", "1302080": "Topform P Att.+GA↓ {{value}}", "1302090": "Notfall Sp. Schaden↓ {{value}}", "1302100": "PF Schaden↓ {{value}}", "1302110": "Flug Fokus Schaden↓ {{value}}", "1302120": "Sandsturm Schaden↓ {{value}}", "1302130": "Sonnen Schaden↓ {{value}}", "1302140": "Grasfeld Schaden↓ {{value}}", "1302150": "Konterb. P Att. + GA↓ {{value}}", "1302160": "Stahl Fokus Sch.↓ {{value}}", "1302170": "Kampf Fokus Sch.↓ {{value}}", "1302180": "Feen Fokus Sp. Sch.↓ T {{value}}", "1302190": "Grasf. Phys. Sch.↓ T {{value}}", "1302200": "Hagel Schaden↓ {{value}}", "1302210": "Unlicht Fokus Sch.↓ {{value}}", "1302220": "Käfer Fokus Sch.↓ T {{value}}", "1302230": "Drachen Fokus Sch.↓ {{value}}", "1302240": "Freundeskr. Sch.↓ {{value}}", "1302250": "Sandst. Spez. Sch.↓ T {{value}}", "1302260": "Feen Fokus Sch.↓ T {{value}}", "1302270": "Boden Fokus Sch.↓ {{value}}", "1302280": "Hagel Phys. Sch.↓ T {{value}}", "1302290": "Gesteins Fokus Phys. Sch.↓ T {{value}}", "1302300": "Gesteins Fokus Spez. Sch.↓ T {{value}}", "1302310": "Geg. Unlichts.f. Angr.sch.↓ T {{value}}", "1302320": "Geg. Typw.↓ Angr.sch.↓ T {{value}}", "1302330": "Eis Fokus Spez. Sch.↓ T {{value}}", "1302340": "Sonne Spez. Sch.↓ T {{value}}", "1302350": "Geg. Gift P Att. +GA Sch.↓ T {{value}}", "1302360": "Effekt. Gegentr. P Att. +GA Sch.↓ T {{value}}", "1302370": "Phy. Sch.↓ T {{value}}", "1302380": "Gef. Feldef.t Sch.↓ T {{value}}", "1302390": "Grasfeld Sch.↓ T {{value}}", "1302400": "At.l.↑ P Att. +GA↓ T {{value}}", "1302410": "Effekt. Gegentr. P Att. +GA Sch.↓ {{value}}", "1302420": "Sonne EX: Wasser P Att. +GA+G D Att.↓ {{value}}", "1302430": "Regen EX: Feuer P Att. +GA+G D Att.↓ {{value}}", "1302440": "Att.l.↑ Sch.↓ {{value}}", "1302450": "Sonne Schaden↓ T {{value}}", "1302460": "Feen Fokus Schaden↓ {{value}}", "1303010": "Treffergar.", "1303020": "Angr.se.max.", "1303030": "Sonnen Treffergar.", "1303040": "Angriffss. Tr. mind. 3×Att.", "1303050": "Trefferg. +P Att. +GA Volltr.", "1303060": "Hyperstrahl Treffergarantie", "1305010": "Feen Wechsel", "1305020": "Flug Wechsel", "1305030": "Wasser Wechsel", "1305040": "Feuer Wechsel", "1305050": "Elektro Wechsel", "1305060": "Pflanze Wechsel", "1305070": "Gestein Wechsel", "1305080": "Boden Wechsel", "1305090": "Psycho Wechsel", "1305100": "Käfer Wechsel", "1305110": "Eis Wechsel", "1305120": "Unlicht Wechsel", "1305130": "Stahl Wechsel", "1305140": "Geist Wechsel", "1305150": "Gift Wechsel", "1305160": "Kampf Wechsel", "1305170": "Drachen Wechsel", "1306020": "Att. AEP Füllung {{value}}", "1306030": "Tr. Sofortang. AEP Füll. {{value}}", "1306040": "P Att. AEP Füllung {{value}}", "1306050": "Vollt. AEP Füllung {{value}}", "1306060": "Brand Gegn. Sofortangr. AEP F. {{value}}", "1306070": "P Att. GA AEP Füll. {{value}}", "1306080": "Att. P Att. AEP Füll. {{value}}", "1306090": "Die Lehren v. Fairb.", "1306100": "Geg. Prob. Tr. AEP Füll. {{value}}", "1306110": "Erst GA Sync AEP Füll. {{value}}", "1306120": "Sofortang. T Att. AEP Füll. {{value}}", "1306130": "Halb KP AEP Füll. (1×) {{value}}", "1306140": "GA Beere AEP Füll. {{value}}", "1306150": "Team GA Sync AEP Füll. {{value}}", "1306160": "Sync Att. T Att. AEP Füll. {{value}}", "1306170": "Erst GA Beere AEP Füll. {{value}}", "1306180": "Erst GA P Stat. Att. AEP Füll. {{value}}", "1306190": "Erst Elektrof. Sync AEP Füll. {{value}}", "1306200": "Angr. P Stat. Att. AEP Füll. (1×) {{value}}", "1306210": "Erst Beere AEP Null Beere AEP Füll. {{value}}", "1306220": "Angr. Beere AEP Füll. {{value}}", "1306230": "GA Sync AEP Füllung {{value}}", "1306240": "Bürde Sync AEP Füll. (32)", "1306250": "GA Sync AEP Füll. (50) {{value}}", "1306260": "Angr. Sync AEP Füll. (32) {{value}}", "1306270": "Einall Analyse Sync AEP Füllung {{value}}", "1306280": "Gegentreffer Beere AEP Füllung {{value}}", "1306290": "Erst P Status Att. Sync AEP Füllung {{value}}", "1306300": "Erst Kanto Analyse AEP Null AEP Füllung {{value}}", "1306320": "Erst GA Sehr effektiv↑ AEP Füllung {{value}}", "1306330": "Erst Mini Trank T AEP 0 Att. AEP Füll. {{value}}", "1307010": "Rückstoßsch. Schutz 9", "1307020": "Rückstoßsch. Schutz {{value}}", "1307030": "Erst KP↓ 10% K.O. Schutz", "1308010": "Gift Fokus St.↑ {{value}}", "1308020": "Einalls Freundeskr. (Phys.): St.↑ {{value}}", "1308030": "Para. Geg. St.↑ T {{value}}", "1308040": "W/F/F Wechsel St.↑ T {{value}}", "1308050": "Gesteins Fokus St.↑ {{value}}", "1308060": "Stand. Eff. St.↑ {{value}}", "1308070": "Hagel St.↑ T {{value}}", "1308080": "Sandst. P Att. +GA St.↑ {{value}}", "1308090": "Passios Freundeskr. (Vert.): P Att. +GA St.↑ T {{value}}", "1308100": "Sonne St.↑ T {{value}}", "1308110": "Mitstr. Init.↑ Mitstr. St.↑ {{value}}", "1308120": "Geg. Unlichtschadenf. St.↑ T {{value}}", "1308130": "Vert.↑ P Att. +GA St.↑ {{value}}", "1308140": "Geg. Gift St.↑ T {{value}}", "1308150": "Geg. Störung St.↑ T {{value}}", "1308160": "Wetterw. St.↑ T {{value}}", "1308170": "Geg. Normalw. St.↑ T {{value}}", "1308180": "Paldeas Freundeskr. (Vert.): St.↑ T {{value}}", "1308190": "Geg. Probl. St.↑ T {{value}}", "1308200": "Einalls Freundeskr. (Vert.): St.↑ T {{value}}", "1308210": "Geg. Giftschadenf. St.↑ T {{value}}", "1308220": "Geg. Schlaf St.↑ T {{value}}", "1308230": "Geg. Verwirr. St.↑ T {{value}}", "1308240": "Geg. Brand St.↑ T {{value}}", "1308250": "Feen Fokus St.↑ T {{value}}", "1308260": "Sandst. St.↑ T {{value}}", "1308270": "Geg. Init.↓ P Att. +GA +G D Att.↑ T {{value}}", "1308280": "Sonne P Att. +GA St.↑ T {{value}}", "1308290": "Erdbeben St.↑ {{value}}", "1308300": "Geg. Wert↓ St.↑ {{value}}", "1308310": "Sonne Boden P Att. +GA St.↑ T {{value}}", "1308320": "Eis Fokus St.↑ {{value}}", "1308330": "Geg. Probl. Bürde St. ×2", "1308350": "Geg. Typwiderst.↓ P Att.+GA Stärke↑ {{value}}", "1308360": "Mitstreiter Volltreffer Stärke↑ {{value}}", "1308370": "Drachen Fokus Stärke↑ T {{value}}", "1308380": "Hyperstrahl Stärke↑ {{value}}", "1308390": "Mind. Halb KP GA Stärke↑ {{value}}", "1308400": "Kampf Fokus Stärke↑ T {{value}}", "1308410": "Nahkampf Stärke↑ {{value}}", "1308430": "Drachen Fokus P Att.+GA Stärke↑ {{value}}", "1308440": "Sonne Pferdestärke Stärke ×2", "1308450": "Geg. Gesteinsschadenf. Stärke↑ T {{value}}", "1308460": "Eisstrahl Stärke ×2", "1308470": "Gift Fokus Stärke↑ T {{value}}", "1308480": "Feld P Att.+GA Stärke↑ {{value}}", "1308510": "Gesteins Fokus P Att.+GA Stärke↑ {{value}}", "1308520": "Boden Fokus P Att.+GA Stärke↑ {{value}}", "1308530": "Erst GA GA Stärke ×{{plus}}", "1308540": "Pflanzen Stärke↑ T {{value}}", "1308550": "Drachen Stärke↑ T {{value}}", "1308560": "Normal Fokus Stärke↑ T {{value}}", "1308580": "Normal Fokus Stärke↑ {{value}}", "1308590": "Gegn. Vert.↓ Stärke↑ {{value}}", "1401010": "K.O. Explosion", "1401020": "Gegner Schlaf P Att. Schaden+", "1401030": "Geg P Att Geist Spez Sch.+", "1401040": "2× P Att. Kismetw.", "1501010": "Erstantritt GA Countd.↓ {{value}}", "1501020": "P Att. Vollt. GA Cou.↓ {{value}}", "1501030": "GA GA Countdown↓ {{value}}", "1501040": "Notfall GA Count.↓ T {{value}}", "1501050": "Antritt GA Countd.↓ (1x) {{value}}", "1501060": "Att. GA Cou.↓ {{value}}", "1501070": "Gegentr. GA Countdown↓ {{value}}", "1501080": "Notfall GA Countdown↓ {{value}}", "1501090": "Gegn. Fehlschlag GA Countdown↓ {{value}}", "1501100": "Abwehr GA Countdown↓ {{value}}", "1501110": "Geg. Wechsels. Tr. GA Cou.↓ {{value}}", "1501120": "P Att. GA Cou.↓ {{value}}", "1501130": "Effektiv. GA Cou.↓ {{value}}", "1501140": "Vollt. GA Cou.↓ {{value}}", "1501150": "Sonnen Att. GA Cou↓ {{value}}", "1501160": "Regen Att. GA Cou.↓ {{value}}", "1501170": "G-D Att. GA Countdown↓ {{value}}", "1501180": "Konter GA Countdown↓ {{value}}", "1501190": "Halb KP GA Countdown↓ (1×) {{value}}", "1501200": "Erst P St. Att. GA Countd↓ {{value}}", "1501210": "Erst Notfall GA Countd.↓ {{value}}", "1501220": "Kont. Angr. GA Countd.↓ {{value}}", "1501230": "Kont. Angr. GA Countd. 2↓ {{value}}", "1501240": "Erst Att. GA Countd.↓ {{value}}", "1501250": "Abw. GA Countd.↓ (1×) {{value}}", "1501260": "Blitz. Kick", "1501270": "Gefl. Schabern.", "1501280": "Einsch. Aura", "1501290": "KP↓ 60% GA Countd.↓ (1×) {{value}}", "1501300": "Sofortangr. GA Countd. 2↓ {{value}}", "1501310": "Sofortangr. GA Countd.↓ {{value}}", "1501320": "T At. GA Countd.↓ {{value}}", "1501330": "Erst Beere AEP Null GA Countd.↓ {{value}}", "1501340": "P Stat. Att. GA Countd.↓ {{value}}", "1501350": "Drachenst. GA Countd.↓ {{value}}", "1501360": "Erst T Att. GA Countd.↓ {{value}}", "1501370": "Unlichtst. GA Coundt.↓ {{value}}", "1501380": "Flugst. GA Countd.↓ {{value}}", "1501390": "Erst Elektro. GA Countd.↓ {{value}}", "1501400": "Erst Sinnohs Freundeskr. (Sp.): GA Countd.↓ {{value}}", "1501410": "Bodens. GA Countd.↓ {{value}}", "1501420": "Erst P Stat. AEP Null GA Countd.↓ {{value}}", "1501430": "Stahlstärke GA Countdown↓ {{value}}", "1501440": "Erst Band v. Paldea: GA Countd.↓ {{value}}", "1501450": "Erst +Erst GA GA Countd.↓ {{value}}", "1501460": "Erst Phys. Boost mind. 6 GA Countd.↓ {{value}}", "1501470": "Kampfstärke GA Countdown↓ {{value}}", "1501480": "Gef. Terakristall. GA Countdown↓ {{value}}", "1501490": "Einalls Leidenschaft: GA Countdown↓ {{value}}", "1501500": "K.O. GA Countdown↓ {{value}}", "1501510": "Kantos Freundeskr. (Sp.): GA Countd.↓ {{value}}", "1501520": "Antritt GA Countdown↓ {{value}}", "1501530": "Erstantr. GA Countd.↓+Sp. Ang. 1↑", "1501540": "Erstantr. GA Countd. 2↓+Volltr. Ch. 1↑", "1501550": "Erstantr. GA Countd. 3↓+Normal Fokus", "1501560": "Verstärkte Terakristall Energie", "1501570": "Erst Geisterstärke AEP Null GA Countd.↓ {{value}}", "1501580": "Erst Kanto Analyse AEP Null GA Countd.↓ {{value}}", "1501590": "Freundeskreis GA Countdown↓ {{value}}", "1501600": "Stahl Fokus GA Countdown↓ {{value}}", "1502010": "MAX GA Countdown↓ {{value}}", "1601020": "GA Sonne", "1601030": "Effektiv GA GA St.↑ {{value}}", "1601040": "Sonnen GA St.↑ {{value}}", "1601050": "Init.↑ GA St.↑", "1601060": "Angriff↑ GA St.↑", "1601070": "Flucht↑ GA St.↑", "1601080": "GA Volltr. GA St.↑ {{value}}", "1601090": "Hagel GA St.↑ {{value}}", "1601100": "Geg. Paralyse GA St.↑ {{value}}", "1601110": "Gegnerverw. GA St.↑ {{value}}", "1601120": "Regen GA St.↑ {{value}}", "1601130": "Gegner Init.↓ GA St.↑", "1601140": "GA Hagel", "1601150": "Gegn. Angriff↓ GA St.↑", "1601160": "Geg. Sp. Ver.↓ GA St.↑", "1601170": "Gegner Schlaf GA St.↑ {{value}}", "1601180": "Sandsturm GA St.↑ {{value}}", "1601190": "GA Sandsturm", "1601200": "Gegner Gefrier GA St.↑ {{value}}", "1601210": "Gegner Schreck GA St.↑ {{value}}", "1601220": "Gegn. Vert.↓ GA St.↑", "1601230": "EF GA St.↑ {{value}}", "1601240": "Werte↑ GA St.↑", "1601250": "Gegner Genauigk.↓ GA St.↑", "1601260": "Notfall GA St.↑ {{value}}", "1601270": "GA GA Typenwechsel", "1601280": "Geg. Sp. Ang.↓ GA St.↑", "1601290": "Gegnerbrand GA St.↑ {{value}}", "1601300": "Gegn. Wechselsp. GA St.↑ {{value}}", "1601310": "Wetterw. GA St.↑ {{value}}", "1601320": "Gegnerangr.↓ GA↑ {{value}}", "1601330": "Sp. Angr.↑ GA St.↑ {{value}}", "1601340": "Normalwetter GA↑ {{value}}", "1601350": "Gegnergift GA St.↑ {{value}}", "1601360": "Gegner Fluchtwert↓ GA St.↑", "1601370": "Attackenl.↑ GA St.↑", "1601380": "Vert.↑ GA St.↑", "1601390": "Sp. Vert.↑ GA St.↑", "1601400": "Geg. Para. G-D Att.↑ {{value}}", "1601410": "Drachen Fokus GA St.↑ {{value}}", "1601420": "Gegner Wert↓∝GA St.↑", "1601430": "Stahl Fokus GA St.↑ {{value}}", "1601440": "Sp. Angr.↑ GA St.↑", "1601450": "Geg. Problemst. GA↑ {{value}}", "1601460": "G D Att. Effektiv. Stärke↑ {{value}}", "1601470": "Genau.↑ GA St.↑ {{value}}", "1601480": "Angr.↑ GA St.↑ {{value}}", "1601490": "Vert.↑ GA St.↑ {{value}}", "1601500": "Geg. Umschling. GA St.↑ {{value}}", "1601510": "GA Volltr.", "1601520": "Gegner Genau.↓ GA St.↑ {{value}}", "1601540": "Angriff↑ G D Att. Stärke↑ {{value}}", "1601550": "Gegner Sp. Angr.↓ GA↑ {{value}}", "1601560": "Gegner Prob. GA St.↑ {{value}}", "1601570": "Feldw. GA St.↑ {{value}}", "1601580": "Init.↑ GA St.↑ {{value}}", "1601590": "Sp. Vert.↑ GA St.↑ {{value}}", "1601600": "KP↓ GA St.↑ {{value}}", "1601610": "Fluchtw.↑ GA St.↑ {{value}}", "1601620": "Geg. Init.↓ GA St.↑ {{value}}", "1601630": "Geg Normalw. Tr GA St.↑ {{value}}", "1601640": "Feen Fokus GA St.↑ {{value}}", "1601650": "Geg. Stahl Schadenf. GA St.↑ {{value}}", "1601660": "GA St.↑ T {{value}}", "1601670": "Geg. Typw.↓ GA St.↑ {{value}}", "1601680": "Unlicht Fokus GA St.↑ {{value}}", "1601690": "Grasf. GA St.↑ {{value}}", "1601700": "Gift Fokus GA St.↑ {{value}}", "1601710": "Einalls Freundeskr. (Phys.): GA St.↑ {{value}}", "1601720": "Probl. GA St.↑ {{value}}", "1601730": "Freundeskr. GA St.↑ T {{value}}", "1601740": "Johtos Freundeskr. (Phys.): GA St.↑ {{value}}", "1601750": "Gesteins Fokus GA St.↑ {{value}}", "1601760": "Einalls Freundeskr. (Vert.): GA St.↑ {{value}}", "1601770": "Geg. Typw.↓ St.↑ T {{value}}", "1601780": "Geg. Gift G D At.↑ {{value}}", "1601790": "Paldeas Freundeskr. (Phys.): GA St.↑ {{value}}", "1601800": "Alolas Freundeskr. (Spez.): GA S.↑ {{value}}", "1601810": "Ge. Sp. Vert.↓ GA St.↑ {{value}}", "1601820": "Flug Fokus GA St.↑ {{value}}", "1601830": "Geg. Umschl. GA St.↑ T {{value}}", "1601840": "Normal Fokus GA St.↑ {{value}}", "1601850": "Hagel GA St.↑ T {{value}}", "1601860": "Paldeas Freundeskr. (Vert.): GA St.↑ T {{value}}", "1601870": "Beere AEP Null GA St.↑ {{value}}", "1601880": "Einalls Freundeskr. (Vert.): GA St.↑ T {{value}}", "1601890": "Psychof. GA St.↑ {{value}}", "1601900": "Sp. Ang.↑ G D Att.↑ {{value}}", "1601910": "Geg. Wechselsp. GA St.↑ T {{value}}", "1601920": "Geg. Wechselsp. St.↑ T {{value}}", "1601930": "Boden Fokus GA St.↑ {{value}}", "1601940": "Geg. Giftschad. GA St.↑ T {{value}}", "1601950": "Geg. Wert↓ GA St.↑ {{value}}", "1601960": "Eis Fokus GA St.↑ {{value}}", "1601970": "Sinnohs Freundeskr. (Sp.): GA St.↑ T {{value}}", "1601980": "Normal Fokus GA St.↑ T {{value}}", "1601990": "Regen GA St.↑ T {{value}}", "1602010": "GA AEP Füll. {{value}}", "1602020": "GA Sofortang. AEP Füll. {{value}}", "1602030": "Erst GA Heilung AEP Füll. {{value}}", "1602040": "GA P Att. AEP Füll. {{value}}", "1602050": "GA P Att. AEP Füll. (1×) {{value}}", "1602060": "Erst GA T Att AEP Füll. {{value}}", "1602070": "Erst GA Sofortang. AEP Füll. {{value}}", "1602080": "Notf. 1× Sofortang. AEP Füll. {{value}}", "1602090": "GA T Att. AEP Füll. {{value}}", "1602100": "G D Att. Sync AEP Füllung {{value}}", "1602110": "G D Att. P Status Att. AEP Füllung {{value}}", "1602120": "Erst Attacke Attacken AEP Füllung {{value}}", "1602130": "Team GA Rundumschutz AEP Füllung {{value}}", "1602140": "Erst P Status Att. Bunker AEP Füllung {{value}}", "1602150": "G D Att. Sehr effektiv↑ AEP Füllung {{value}}", "1603010": "Regen G D Attacke↑ {{value}}", "1603020": "Att.l.↑ GA St.↑ T {{value}}", "1603030": "Att.l.↑ GA St.↑ {{value}}", "1603040": "Käfer Fokus GA Stärke↑ T {{value}}", "1603050": "Freundeskreis GA Stärke↑ {{value}}", "1603060": "Mitstr. Initiative↑ Mitstr. GA Stärke↑ {{value}}", "1603070": "Wett./Fok./Feld Wechs. GA Stärke↑ T {{value}}", "1603080": "Kampf Fokus GA Stärke↑ {{value}}", "1603090": "Sonne GA+G D Att.↑ {{value}}", "1603100": "Geg. Gesteinsschadenf. GA Stärke↑ T {{value}}", "1603110": "Feld GA Stärke↑ {{value}}", "1603120": "Kampf Fokus GA Stärke↑ T {{value}}", "1603130": "Johtos Freundeskr. (Sp.): GA Stärke↑ T {{value}}", "1603140": "Geg. Typwiderst.↓ GA Stärke↑ T {{value}}", "1603150": "Grasfeld G D Attacke↑ {{value}}", "1603160": "Unlicht Fokus GA Stärke↑ T {{value}}", "1701030": "Paralysesch.", "1701040": "Gefriersch.", "1701070": "Verwirr.sch.", "1701080": "Schrecksch.", "1701090": "Umschlingsch.", "1701100": "Sonnen Problemsch.", "1701120": "Störungssch.", "1701130": "Regen Störungssch.", "1701140": "K.O. Schutz", "1701150": "Sonnen Störungssch.", "1701160": "Normalwetter Störungssch.", "1701170": "Problemsch.", "1701180": "Psychof. Problemsch.", "1701190": "Grasfeld Problemsch.", "1701200": "Elektrof. Störungssch.", "1701210": "Elektrof. Problemsch.", "1701220": "Schrecksch. T", "1701230": "Sonne Probl. Stör. Schutz T", "1701240": "Giftsch. T", "1701250": "Regen Problemsch.", "1701260": "Unlicht Fokus Störungss.", "1701270": "Gesteins Fokus Problems.", "1701280": "Grasf. Störungss.", "1701290": "Feen Fokus Problemsch. T", "1701300": "Hagel Problemschutz", "1701310": "Gegentr. Ang. +Sp. Ang.↑ Ign.", "1701320": "Psychof. Probl. Stö. Schutz T", "1701330": "P Att./GA/G D Att. Gegentr. W/F/F↑ Ign. T", "1701340": "Drachen Fokus Störungss.", "1701350": "Prob. +Stör. Sch.", "1701360": "Eis Fokus Problemsch. T", "1701370": "Stahl Fokus Probl. + Stö. Schutz T", "1701380": "Boden Fokus Probl. + Stör. Schutz T", "1701400": "Freundeskr. Problemsch.", "1701410": "Sandsturmsch. T", "1701420": "Grasfeld Probl. +Stör. Schutz T", "1701430": "Schlaf +Schreck Schutz T", "1701440": "Hagel Störungsschu.", "1701450": "Gift Fokus Problemschu. T", "1701460": "Geg. Giftschadenf. Probl. +Stör. Schutz T", "1701470": "Freundeskr. Probl. +Stör. Schutz T", "1701480": "Att.l.↑ Probl. +Stör. Schutz T", "1701490": "Käfer Fokus Problemschutz", "1701510": "Feen Fokus Problem+Störung Schutz T", "1702010": "Giftres. {{value}}", "1702020": "Paralyseres. {{value}}", "1702030": "Schlafres. {{value}}", "1702040": "Brandres. {{value}}", "1702050": "Gefrierres. {{value}}", "1702060": "Verwirr.res. {{value}}", "1702070": "Schreckres. {{value}}", "1702080": "Umschl.res. {{value}}", "1703010": "GA Komplettaufh.", "1703020": "P Att. Problemaufh. T {{value}}", "1703030": "Störungsaufh.", "1703040": "K.O. Mitstr. Problemaufl.", "1703050": "Problemaufh.", "1703060": "GA Problemaufl.", "1703070": "Att. Problemaufh. T", "1703080": "P Att. Problemaufh. {{value}}", "1703090": "Team Att. Problemaufh. {{value}}", "1703100": "GA Problemaufh. T", "1703110": "G-D Att. Problemaufh. T {{value}}", "1703120": "Geg. Att. Problemst. Aufh. {{value}}", "1703130": "Att. Problemaufh. {{value}}", "1703150": "Att. Störungsaufh. {{value}}", "1703160": "GA Nachteil Aufh. T {{value}}", "1703170": "T Att. Problemaufh. T {{value}}", "1704010": "Problem Störung Schutz", "1704020": "Topform K.O. Schutz", "1704040": "Extra K.O. Schutz {{value}}", "1704050": "Sonnenheil. {{value}}", "1704060": "Attacken K.O. Schutz {{value}}", "1704070": "Atta. Verw. {{value}}", "1704080": "Notfall Att. Fokus", "1704090": "Sandsturm Heilung {{value}}", "1704100": "Att. Vergiftung {{value}}", "1704110": "Status Att. Status. T {{value}}", "1704120": "Antritt Folgevolltr.", "1704130": "Treff. Schreck {{value}}", "1704140": "GA Folgevolltr.", "1704150": "Regen Heilung {{value}}", "1704160": "Topform KP Regenerier.", "1704170": "Gegn. GA Schlaf", "1704180": "Att. Fokus", "1704190": "Gegn. Att. Gefrieren {{value}}", "1704200": "Antritt Folgetreffer", "1704210": "GA Ausdauer T", "1704220": "Gegn. Att. Schw. Verg. {{value}}", "1704230": "Att. Geg. Schl. {{value}}", "1704240": "P Att. Vollt. Verw. {{value}}", "1704250": "Att. Folgevollt. {{value}}", "1704260": "Att. KP Regenerier. {{value}}", "1704270": "Erstantr. Folgevolltr. T", "1704280": "EF Heilung {{value}}", "1704290": "PF Heilung {{value}}", "1704300": "Att. KP Regenerier. T", "1704310": "Antr. Folge Leistenver. 0", "1704320": "GA Folge Leistenve. 0", "1704330": "GA KP Regenerier. T", "1704340": "GA Überstehen", "1704350": "Att. Folge Eff. Stärke↑ {{value}}", "1704360": "Wechselsp. Tr. F. Leistenv. 0 {{value}}", "1704370": "Antritt Folge Eff. Stärke↑", "1704380": "Wechselsp. Heilung {{value}}", "1704390": "Vollt. Folge Leistenv. 0 {{value}}", "1704400": "Gift Brand Paralyse Reflexion", "1704410": "P Att. Folge Leistenv. 0 {{value}}", "1704420": "P Status Att. F. Eff. St.↑ {{value}}", "1704430": "Sonnen P Att. F. Eff. St.↑ {{value}}", "1704440": "Regen P Att. F. Eff. St.↑ {{value}}", "1704450": "G-D Att. Folge Schadenss.", "1704460": "Gegentr. Folge Leistenverbr. 0 {{value}}", "1704470": "G-D Att. KP Regenerier.", "1704480": "Treff. Folge Leistenv. 0 {{value}}", "1704490": "Notfall Folge Eff. Stärke↑", "1704500": "Halb KP F. Schadenss.", "1704510": "Erst GA Folge Eff. Stärke↑", "1704520": "Fehlschl. Folge Phys. Attacke↑ {{value}}", "1704530": "G-D Att. Folge Eff.St.↑", "1704540": "Gegner GA Wechselsp.", "1704550": "GA KP Regenerier.", "1704560": "T Att. 1× Phys. Boost {{value}}", "1704570": "Treff. Statusproblem T {{value}}", "1704580": "K.O. Treffer F. Eff. Stärke↑", "1704600": "Eff. Folge Leistenv. 0 {{value}}", "1704610": "Schemenkraft F. Eff. Stärke↑", "1704620": "T Att. 1× Spezial Boost T {{value}}", "1704630": "T Att. F. Leistenv. 0 {{value}}", "1704640": "Eff. Folge Eff. Stärke↑ {{value}}", "1704650": "Att. Folge Leistenv. 0 {{value}}", "1704660": "GA 1× Phys. Boost {{value}}", "1704670": "GA Schlaf T", "1704680": "Halb KP P St. Att. 1× Sp. Boost T {{value}}", "1704690": "Erst GA Folge Schadenss.", "1704700": "Geister Fokus Heilung {{value}}", "1704710": "T Aktion Folge Eff. Stärke↑ {{value}}", "1704720": "Erst GA F. Leistenv. 0 T", "1704730": "Erstantritt Phys. +Sp. Boost {{value}}", "1704740": "Angriff Verwirrung {{value}}", "1704750": "P St. Att. 1×Phys. +Sp. Boost T {{value}}", "1704760": "PF Ang. F. Leistenv. 0 {{value}}", "1704770": "Halb KP F. Leistenv. 0 T (1x) {{value}}", "1704780": "G D Att. 1× Spezial Boost T {{value}}", "1704790": "P Status Att. 1× Phys. Boost {{value}}", "1704800": "Gegentr. Gegner Para. {{value}}", "1704810": "Angriff Problemst. {{value}}", "1704820": "Volltr. Folge Volltr. {{value}}", "1704830": "Käfer Fokus Heilung {{value}}", "1704840": "Heilung 1× Phys. Sp. Boost T {{value}}", "1704850": "GA Folge Eff. St.↑ {{value}}", "1704860": "GA 1× Spezial Boost {{value}}", "1704870": "Attacke 1× Spezial Boost {{value}}", "1704880": "Geg. Att. 1× Phys. Boost {{value}}", "1704890": "Grasfeld Heilung {{value}}", "1704900": "GA 1× Spezial Boost T (1×) {{value}}", "1704910": "Limit Att. 1× Sp. Boost T {{value}}", "1704920": "Att. 1× Phys. Sp. Boost {{value}}", "1704930": "Antritt Sp. Boost T {{value}}", "1704940": "Erst Notfall Spezial Boost {{value}}", "1704950": "Antritt Folge Schadenssch.", "1704960": "Gegentr. Brand {{value}}", "1704970": "Treff. Para. {{value}}", "1704980": "Att. 1× Spez. Boost T {{value}}", "1704990": "Erstantr. KP Regen.", "1705020": "Gegner Umschl. Schaden↑ {{value}}", "1705030": "Gegn. Vergift. Schaden↑ {{value}}", "1705040": "Zielverwirr. Trefferq.↑ {{value}}", "1705050": "Probl. St. Schutz Dauer↑ {{value}}", "1705060": "Para. Geg. Fehlschlagch.↑ {{value}}", "1706010": "Elek. Angr. Para. {{value}}", "1706020": "Eis Angr. Gefr. {{value}}", "1706030": "Att. 2× Phys. Boost {{value}}", "1706040": "Erst Notf. Phys. Boost {{value}}", "1706050": "T Att. 1× Phys. Sp. Boost {{value}}", "1706060": "Konterber. 1× Phys. Boost {{value}}", "1706070": "P Status Att. F. Leistenv. 0 {{value}}", "1706080": "Stahl Fokus Heil. {{value}}", "1706090": "Unlicht Fokus Heil. {{value}}", "1706100": "GA 1× Phys. Boost T (1×) {{value}}", "1706110": "Erstantr. K.O. Schutz T", "1706120": "Angr. Brand {{value}}", "1706130": "Gegner Att. 1× Sp. Boost {{value}}", "1706140": "Geg. Gift Ang. F. Leistenv. 0 {{value}}", "1706150": "P St. Att. 1× Phys. Sp. Boost {{value}}", "1706160": "Gesteins Fokus Heil. {{value}}", "1706170": "Angr. Umschl. {{value}}", "1706180": "Abw. 1× Phys. Boost T (1×) {{value}}", "1706190": "Wert↓ Folge Leistenv. 0 {{value}}", "1706200": "Gegentr. Geg. Gift/Par./Schl. {{value}}", "1706210": "Br. Geg. Ang. 1× Spez. Boost {{value}}", "1706220": "Geg. Fehl. 1× Phys. Sp. Boost {{value}}", "1706230": "GA Schwere Vergift. T {{value}}", "1706240": "Gift Geg. Ang. F. Eff. St.↑ {{value}}", "1706250": "GA/G D Att. 1× Phys. Boost T {{value}}", "1706260": "Erst Tr. Bodenw.↓", "1706270": "Erst KP↓ 1 Extra K.O. Sch.", "1706280": "Erst GA Folge Eff. St.↑ T", "1706290": "Erst Treff. Stahlw.↓", "1706300": "Antr. KP Regen. T", "1706310": "Erst Tr. Schwächew.↓", "1706320": "T Att. Statuspr. Sch. T {{value}}", "1706330": "Erst T Att. Geg Unlichtw.↓T", "1706340": "G Normalw. Tr Folg L Ver. 0 {{value}}", "1706350": "Die Meeresbrise von Ula Ula", "1706360": "Die Meeresbrise von Mele Mele", "1706390": "Gegn. Normalw. Tr. Schr. {{value}}", "1706400": "Geg. Par. Tr. Folge L Verbr. 0 {{value}}", "1706410": "Erst P Status Att. Drachenw.↓", "1706420": "Geg Flu. unmögl. Att Schr. {{value}}", "1706430": "Att. 1× Phys. Boost T {{value}}", "1706440": "Psychof. Att. 1× Phys. Boost {{value}}", "1706450": "G D Att. Geg Giftw.↓ T {{value}}", "1706460": "Geg. Gift Schw. Vergift.", "1706470": "Attacke 1× Physisch Boost {{value}}", "1706480": "Erst KP↓ 60% F. S. Sch.", "1706490": "Att. 3× Phys. Boost {{value}}", "1706500": "P Stat. Att. 2× Phys. Boost {{value}}", "1706510": "G Stahl Schadenf. Tr. F Leistenv. 0 {{value}}", "1706520": "Sp.↑ Att. 3× Phys. Boost {{value}}", "1706530": "G D Att. Folge Leistenv. 0", "1706540": "P Stat. Att. 1× Phys. Boost T {{value}}", "1706550": "Sofortangr. 1× Phys. Boost {{value}}", "1706560": "Brand Geg. Tr.F. Eff. St.↑ {{value}}", "1706570": "GA 2× Phys. Boost {{value}}", "1706580": "Geg. Fehl. 2× Phys. Boost {{value}}", "1706590": "Angr. Folge Effektiv. St.↑ {{value}}", "1706600": "GA Folge Leistenv. 0 T {{value}}", "1706610": "Ang. Geg. Statusv. T {{value}}", "1706620": "Gegentr. Geg. Verg. {{value}}", "1706630": "Gefr. Geg. Ang. 1× Spez. Boost {{value}}", "1706640": "Att. 2× Spez. Boost {{value}}", "1706650": "G D Att. F. Leistenv. 0 T", "1706660": "Tr. Geg. 1 Störungsa. {{value}}", "1706670": "Erst Tr. Feenw.↓", "1706680": "GA 2× Spez. Boost T (1×) {{value}}", "1706690": "Geg. Wechselsp. Tr. F. Leistenv. 0 {{value}}", "1706700": "Geg. Wechselsp. Tr. F. Eff. St↑ {{value}}", "1706710": "G Unl. Schadenf. Tr. F Leistenv. 0 {{value}}", "1706720": "Para. G. Ang. 1× Spez. Boost {{value}}", "1706730": "GA 2× Phys. Boost T {{value}}", "1706740": "Erst GA Geg. Feenw.↓", "1706760": "Gift Geg. Ang. 1× Spez. Boost {{value}}", "1706770": "Wett. /Fok. /Feld 1× Sp. Boost {{value}}", "1706780": "Geg. Probl. Tr. F. Leistenv. 0 {{value}}", "1706790": "GA/G D Att. 2× Sp. Boost {{value}}", "1706800": "GA Spannung↑ {{value}}", "1706810": "T Att. F. Leistenv. 0 T {{value}}", "1706820": "K.O. Tr. 2× Spez. Boost {{value}}", "1706830": "Statusw.↓ 1× Phys. Boost {{value}}", "1706840": "T Att. 1× Phys. Sp. Boost T (1×) {{value}}", "1706850": "Erstantr. Pflanzenw.↑ {{value}}", "1706860": "GA Gegner Para.", "1706870": "T Att. 1× Spez. Boost {{value}}", "1706880": "Ang. 1× Spez. Boost / F. Leistenv. 0", "1706890": "G D Att. Geg. Typw. (G D Att.)↓ T {{value}}", "1706900": "Angr. 1× Phys. Boost {{value}}", "1706910": "Erst GA Spez. Boost T {{value}}", "1706920": "Wett./ Fok./ Feld 1× Phys. Boost {{value}}", "1706930": "Brand Angr. 1× Phys. Boost {{value}}", "1706940": "Geg. Stör. Ang. F. Eff. St.↑ {{value}}", "1706950": "Angr. 1× Spez. Boost {{value}}", "1706960": "Tr. 1× Phys. Boost {{value}}", "1706970": "Sandst. Angr. 1× Phys. Boost {{value}}", "1706980": "Antr. Phys. Boost {{value}}", "1706990": "G D Att. Phys. +Spez. Boost T {{value}}", "1707010": "Gef. Felde. Ang. F. Leistenv. 0 {{value}}", "1707020": "Geg. Typw.↓ Ang. F. Leistenv. 0 {{value}}", "1707030": "Tr. Geg. Schr. {{value}}", "1707040": "Gegentr. 1× Phys. +Sp. Boost {{value}}", "1707050": "GA 2× Phys. +Spez. Boost {{value}}", "1707060": "Feldeff. F. Leistenv. 0 {{value}}", "1707070": "G D At. Spez. Boost {{value}}", "1707080": "Heil. KP Regen. T", "1707090": "GA 1× Phys. +Spez. Boost {{value}}", "1707100": "Phys. G D Att. Phys. Boost {{value}}", "1707110": "Spez. G D Att. Spez. Boost {{value}}", "1707120": "Freundesk. Angr. 1× Phys. Boost {{value}}", "1707130": "Erstantr. Phys. Boost T {{value}}", "1707140": "Geg. Normal. Ang. 1× Phys. Boost {{value}}", "1707150": "Gift Angr. Geg. Verg. {{value}}", "1707160": "Feldeff. 1× Spez. Boost {{value}}", "1707170": "P Status Att. 1× Spez. Boost {{value}}", "1707180": "Erstantr. Phys. Boost {{value}}", "1707190": "Erstantr. Spez. Boost {{value}}", "1707200": "GA 2× Spez. Boost {{value}}", "1707220": "Erstantr. Geg. Schlaf T", "1707230": "P At. 1× Phys. Boost {{value}}", "1707240": "Erst GA Phys. Boost T {{value}}", "1707250": "Bereitsch. 2× Spezial Boost {{value}}", "1707260": "Mitstr. Freundeskr. 1× Sp. Boost {{value}}", "1707270": "Bereitsch. 1× Spez. Boost {{value}}", "1707280": "Mitstr. K.O. Phys. Boost {{value}}", "1707290": "Erst GA Geg. Drachenw.↓ {{value}}", "1707300": "Angr. Geg. Schreck +Para. {{value}}", "1707310": "Angr. Beere AEP↓ +3× Spez. Boost {{value}}", "1707320": "Freundeskr. Ang. F. Leistenv. 0 {{value}}", "1707330": "Att. 4× GA Boost {{value}}", "1707340": "Statusw.↓ 2× Phys. Boost {{value}}", "1707350": "Att. 3× GA Boost {{value}}", "1707360": "GA 5× GA Boost {{value}}", "1707370": "T Att. 1× Phys. Boost T {{value}}", "1707380": "Freundesk. 1× Phys. +Sp. Boost T {{value}}", "1707390": "Sofortangr. 1× Phys. Boost T {{value}}", "1707400": "Antr. Spez. Boost {{value}}", "1707410": "Antr. GA Boost {{value}}", "1707420": "Erst Angr. Pflanzenw.↓", "1707430": "Erst GA Phys. Boost {{value}}", "1707440": "Status Att. 1× Phys. +Sp. Boost T {{value}}", "1707450": "Erst Beere AEP Null Sp. Boost {{value}}", "1707460": "Erst Angr. Giftw.↓", "1707470": "G D Att. Phys. Boost {{value}}", "1707480": "T Att. 1× GA Boost T {{value}}", "1707490": "Unlicht St.↑ T {{value}}", "1707500": "Flug St.↑ T {{value}}", "1707510": "Erst P Att. Spez. Boost {{value}}", "1707520": "Angr. 1× GA Boost {{value}}", "1707530": "G D Att. Geg. Stör. T {{value}}", "1707540": "Status Att. Geg. Stör. T {{value}}", "1707550": "G D Att. Geg. Para. T {{value}}", "1707560": "Team Att. 2× GA Boost {{value}}", "1707570": "Mitstr. Freundeskr. 1× Phys. +Sp. Boost T {{value}}", "1707580": "GA/G D Att. 2× Phys. Boost {{value}}", "1707590": "G D Att. GA Boost T {{value}}", "1707600": "Att. Folge Schadenssch. {{value}}", "1707610": "Ang. Beere AEP↓ +1× Phys. Boost T {{value}}", "1707620": "Geg. Fehl. 1× Phys. +Spez. Boost T {{value}}", "1707630": "Stahl Fokus Ang. Folge Leistenv. 0 {{value}}", "1707640": "Elektro St.↑ T {{value}}", "1707650": "Treffer 1× Spez. Boost {{value}}", "1707660": "Treffer 1× GA Boost {{value}}", "1707670": "Flug Fokus 1× Spez. Boost T {{value}}", "1707680": "T Att. 3× Phys. Boost {{value}}", "1707690": "Mitstr. Wetter 2× Spez. Boost {{value}}", "1707700": "G D Att. GA Boost T {{value}}", "1707710": "Erstantr. Folge Schadenssch.", "1707720": "T Att. 1× Phys. +Spez. Boost T {{value}}", "1707730": "Halb KP 2× Phys. +Spez. Boost T (1×) {{value}}", "1707740": "Psychost. 1× Spez. Boost T {{value}}", "1707750": "Gegentr. 1× Spez. Boost {{value}}", "1707760": "G D Att. Geg. Typwiderst. (G D Att.)↓ {{value}}", "1707770": "Geg. Feuerschadenf. Ang. 1× Sp. Boost {{value}}", "1707780": "Angr. 2× GA Boost {{value}}", "1707790": "G D Att. Geg. Brand {{value}}", "1707800": "Regen Ang. Folge Leistenv. 0 {{value}}", "1707810": "Grasfeld Ang. Folge Leistenv. 0 {{value}}", "1707820": "Notfall Folge Schadenss. (1×) {{value}}", "1707830": "G D Att. Phys. Boost T {{value}}", "1707840": "Sonne Ang. Folge Leistenv. 0 {{value}}", "1707850": "Team Att. 4× GA Boost {{value}}", "1707860": "T Att. 1× GA Boost T {{value}}", "1707870": "Erst GA Spez. Boost {{value}}", "1707880": "Sync AEP 0 +Nicht Sync Att.: 1× Sp. Boost {{value}}", "1707890": "Team Att. Folge Effektiv. St.↑ {{value}}", "1707900": "Boden Fokus Ang. Folge Leistenv. 0 {{value}}", "1707910": "Att. 2× Spez. Boost T {{value}}", "1707920": "Att. 2× Phys. Boost T {{value}}", "1707930": "Boden Fokus Heil. {{value}}", "1707940": "Bodenst. 2× Phys. Boost {{value}}", "1707950": "Regen Angr. 1× GA Boost {{value}}", "1707960": "Gegentr. 1× Phys. Boost T {{value}}", "1707970": "Gegentr. 1× Spez. Boost T {{value}}", "1707980": "Gestein St.↑ T {{value}}", "1707990": "Eis St.↑ T {{value}}", "1708010": "Erst P Status Att. Null Phys. Boost {{value}}", "1708020": "Sonne Folge Leistenv. 0 {{value}}", "1708030": "Elektrof. Angr. 1× Spez. Boost {{value}}", "1708040": "Angr. Folge Effektiv.t St.↑ T {{value}}", "1708050": "T Att. AEP Null Ang. F. Leistenv. 0 {{value}}", "1708060": "T Att. AEP Null Ang. 2× Spez. Boost {{value}}", "1708070": "Brand Geg. Mitstr. Ang. 1× Spez. Boost {{value}}", "1708080": "Erst Beere AEP Null Phys. Boost T {{value}}", "1708090": "Brand Geg. Ang. Folge Leistenv. 0 {{value}}", "1708100": "GA 1× Spez. Boost T {{value}}", "1708110": "Stahlstärke 2× Spez. Boost {{value}}", "1708120": "Erstantr. Sp. Boost T {{value}}", "1708130": "GA Gegentr. 2× Phys. Boost {{value}}", "1708140": "Geg. Feuerschadenf. Ang. F. Leistenv. 0 {{value}}", "1708150": "Gegentr. 1× GA Boost T {{value}}", "1708160": "Regen Ang. 2× Spez. Boost {{value}}", "1708170": "Mitstr. Wett./Fok./Feld 1× Spez. Boost T {{value}}", "1708180": "Normal Stärke↑ T {{value}}", "1708190": "Kampf Stärke↑ T {{value}}", "1708200": "Feuer Stärke↑ T {{value}}", "1708210": "Erstantr. Selbst Schlaf", "1708220": "Treffer 1× Phys.+Spez. Boost {{value}}", "1708230": "Erst Spez. Boost mind. 6 Spez. Boost {{value}}", "1708250": "Mitstr. Käfer Fokus 1× Spez. Boost {{value}}", "1708260": "GA 2× Spez. Boost T {{value}}", "1708270": "Att. Folge Leistenv. 0 T {{value}}", "1708280": "Erst Att. Spez. Boost T {{value}}", "1708290": "Erst Angr. Normalw.↓", "1708300": "Att. 2× Phys. +Spez. Boost {{value}}", "1708310": "Erst GA Spannung↑ {{value}}", "1708320": "Mitstr. Freundeskreis 2× Phys. Boost {{value}}", "1708330": "Mitstr. Freundeskreis 3× GA Boost {{value}}", "1708340": "Mitstreiter Wert↑ 1× GA Boost {{value}}", "1708350": "GA Gegentreffer 1× Phys.+Sp. Boost T {{value}}", "1708360": "Geg. Schreck Mitstr. Ang. 1× Phys.+Sp. Boost {{value}}", "1708370": "Gegentreffer Gegner Umschlingung {{value}}", "1708380": "Erst P Stat. Att. Folge Schadensschutz", "1708390": "Geg. Anz. 1+Ang.: 1× Phys.+Spez. Boost {{value}}", "1708400": "Geg. Anz. 1+Ang.: F. Leistenverbr. 0 {{value}}", "1708410": "Erst Sp. Boost+Erst GA Sp. Boost {{value}}", "1708420": "P Attacke 2× GA Boost {{value}}", "1708430": "P Status Attacke 2× Spezial Boost {{value}}", "1708440": "Sonne Mitstr. Angriff 1× Spez. Boost {{value}}", "1708450": "Geg. Schreck Mitstr. Ang. 2× GA Boost {{value}}", "1708460": "Feen Fokus Heilung {{value}}", "1708470": "Geg. Anz. 1+Ang.: 1× Spez. Boost {{value}}", "1708480": "Mitstr. Freundeskreis 1× Phys. Boost T {{value}}", "1708490": "Mitstr. Freundeskreis Folge Leistenv. 0 {{value}}", "1708500": "Wett./Fok./Feld 1× Phys.+Sp. Boost T {{value}}", "1708510": "Team GA 1× Phys.+Spez. Boost T {{value}}", "1708520": "Geister Stärke↑ T {{value}}", "1708530": "Gift Stärke↑ T {{value}}", "1708540": "Wasser Stärke↑ T {{value}}", "1708550": "GA 1× Phys.+Spez. Boost T {{value}}", "1708560": "Erstantritt GA Boost {{value}}", "1708570": "Erst P Status Att. Spez. Boost T {{value}}", "1708580": "Att. F. Att. Schadensabsorp. v. Mitstr. {{value}}", "1708590": "Erst GA Phys.+Spez. Boost T {{value}}", "1708600": "GA 3× Phys. Boost {{value}}", "1708610": "Geg. Problem Mitstr. Ang. 1× Phys.+Sp. Boost {{value}}", "1708620": "Geg. Problem Mitstr. Ang. 2× GA Boost {{value}}", "1708630": "Erstantritt Geistwiderstand↓ T {{value}}", "1708640": "Erst T Attacke GA Boost 10", "1708650": "Geister Fokus Angriff Problemstörung {{value}}", "1708660": "Geg. Störung Ang. F. Leistenverbr. 0 {{value}}", "1708670": "Geg. Störung Ang. 1× Phys.+Sp. Boost {{value}}", "1708680": "Erst GA Geistwiderstand↓ T {{value}}", "1708690": "Erstantritt Folge Eff. Stärke↑ T", "1708700": "P Attacke 1× GA Boost T {{value}}", "1708710": "G D Attacke Phys.+Spez. Boost {{value}}", "1708720": "Erstantritt Phys.+Spez. Boost T {{value}}", "1708730": "Erstantritt GA Boost T {{value}}", "1708740": "Kampfstärke 2× Phys. Boost {{value}}", "1708750": "Kampf Fokus Ang. Folge Leistenverbr. 0 {{value}}", "1708760": "Mitstr. Grasfeld 1× Phys.+Sp. Boost T {{value}}", "1708770": "Effektivität Gegner 1 Störungsart {{value}}", "1708780": "Unlicht Fokus 1× Spezial Boost T {{value}}", "1708790": "G. Gesteinsschadenf. Ang. F. Leistenv. 0 {{value}}", "1708800": "T Attacke 2× Spezial Boost {{value}}", "1708810": "Erst GA Folge Schadensschutz T", "1708820": "GA 2× Phys.+Spez. Boost T {{value}}", "1708830": "Erstantritt Schwere Vergiftung T", "1708840": "Erst Angriff Phys.+Sp. Boost {{value}}", "1708850": "Geister Fokus Ang. 1× Phys.+Sp. Boost {{value}}", "1708860": "Erst GA GA Boost 10", "1708870": "Erst Johtos Freundeskr. (Sp.): K.O. Schutz T", "1708880": "Erst Angriff Spez. Att. Anfälligkeit", "1708890": "Johtos Freundeskr. (Sp.): Att. F. Leistenverbr. 0 {{value}}", "1708900": "Mitstr. Geister Fokus 2× Phys.+Sp. Boost T {{value}}", "1708910": "Attacke 1× Phys.+Sp. Boost T {{value}}", "1708920": "Mitstr. Freundeskr. Folge Leistenv. 0 T {{value}}", "1708930": "Angriff 1× Phys.+Sp. Boost {{value}}", "1708940": "Erst P Status Att. F. Leistenv. 0 T", "1708950": "Geg. Gift Ang. 2× GA Boost {{value}}", "1708960": "Angriff 3× Spez. Boost {{value}}", "1708970": "GA Folgevolltreffer T", "1708980": "Antritt Phys.+Spez. Boost T {{value}}", "1708990": "Passios Freundeskr. (Vert.): Spez. Boost T {{value}}", "1709000": "Erst Angriff Feuerwiderstand↓", "1709010": "Abwehr 1× Phys. Boost T {{value}}", "1709020": "Abwehr 1× Spez. Boost T {{value}}", "1709030": "Erst GA Normalwiderstand↓ T {{value}}", "1709040": "Erst GA Feuerwiderstand↓ T {{value}}", "1709050": "Erst GA Wasserwiderstand↓ T {{value}}", "1709060": "Erst GA Elektrowiderstand↓ T {{value}}", "1709070": "Erst GA Pflanzenwiderstand↓ T {{value}}", "1709080": "Erst GA Eiswiderstand↓ T {{value}}", "1709090": "Erst GA Psychowiderstand↓ T {{value}}", "1709100": "Erst GA Unlichtwiderstand↓ T {{value}}", "1709110": "Erst GA Feenwiderstand↓ T {{value}}", "1709120": "Erst Pflanzen Ang. GF+Pflanzenwiderst.↓", "1709130": "Erst Gesteins Ang. Gesteins Fok.+Gesteinsw.↓", "1709140": "Erst GA Gesteinswiderstand↓ T {{value}}", "1709150": "Erst Geisterstärke AEP Null Phys. Boost {{value}}", "1709160": "T Attacke 2× Phys. Boost {{value}}", "1709170": "Geg. Problem Ang. 3× GA Boost {{value}}", "1709180": "GA 1 bis 4× Spez. Boost T {{value}}", "1709190": "Kantos Freundeskr. (Sp.): 1× Spez. Boost {{value}}", "1709200": "Sonne Ang. Schreck {{value}}", "1709210": "Mitstr. Ang. Anw. 1× Phys. Boost+2× GA Boost", "1709220": "Team GA 2× Phys. Boost {{value}}", "1709230": "Erst Gigastoß Phys. Att. Anfälligkeit", "1709240": "Team Attacke F. Leistenverbr. 0 {{value}}", "1709250": "Mitstr. Wett./Fok./Feld 1× Phys. Boost T {{value}}", "1709260": "Team Attacke Folge Schadensschutz {{value}}", "1709270": "K.O. GA Boost T 10", "1709280": "GA/G D Att. 2× Sp. Boost T {{value}}", "1709290": "Team GA 2× Spez. Boost {{value}}", "1709300": "Att. 2× Phys. Boost+4× GA Boost", "1709310": "Stahl Fokus 1× Phys.+Spez. Boost T {{value}}", "1709370": "Grasfeld Ang. F. Leistenverbr. 0+Vergift.", "1709380": "Geister Fok. Ang. F. Leistenverbr. 0+Brand", "1709390": "Drachen Fok. Ang. F. Leistenverbr. 0+Paral.", "1709400": "Gef. Terakristall. Ang. F. Leistenverbr. 0 {{value}}", "1709410": "Grasfeld Folge Eff. Stärke↑", "1709420": "Team GA 1× Phys. Boost {{value}}", "1709430": "GA/G D Att. 1× Phys.+Sp. Boost T {{value}}", "1709440": "Antritt Phys.+Spez. Boost {{value}}", "1709470": "GA Gegner Brand", "1709490": "Erst GA Phys.+Spez. Boost {{value}}", "1709540": "Grasfeld Angriff 1× Phys. Boost T {{value}}", "1709550": "Freundeskreis Angriff 1× Phys. Boost T {{value}}", "1801010": "Angr.↓ Resistenz {{value}}", "1801020": "Vert.↓ Resistenz {{value}}", "1801030": "Sp. Ang.↓ Resistenz {{value}}", "1801040": "Sp. Vert.↓ Resistenz {{value}}", "1801050": "Init.↓ Resistenz {{value}}", "1801060": "Genauigk.↓ Resistenz {{value}}", "1801070": "Fluchtw.↓ Resistenz {{value}}", "1801090": "Werte↓ Resistenz {{value}}", "1802010": "Angr.↓ Schutz", "1802020": "Vert.↓ Schutz", "1802030": "Sp. Ang.↓ Schutz", "1802040": "Sp. Vert.↓ Schutz", "1802050": "Init.↓ Schutz", "1802060": "Genauigk.↓ Schutz", "1802070": "Fluchtw.↓ Schutz", "1802080": "Volltr.q.↓ Schutz", "1802090": "Werte↓ Schutz", "1802100": "Sandsturm Werte↓ Schutz", "1802110": "Sonnen Werte↓ Schutz", "1802120": "Genauigk.↑ Schutz", "1802130": "PF Werte↓ Schutz", "1802140": "Feen Fokus Werte↓ Sch.", "1802150": "Hagel Werte↓ Schutz", "1802160": "Elektrof. Werte↓ Schutz T", "1802170": "Vert.↓ Schutz T", "1802180": "Sp. Angr.↓ Sch. T", "1802190": "Angr.↓ Schutz T", "1802200": "Feen Fokus Werte↓ Schutz T", "1802210": "Freundeskr. Werte↓ Schutz T", "1802220": "Gesteins Fokus Werte↓ Schutz T", "1802230": "Käfer Fokus Werte↓ Schutz", "1802240": "Unlicht Fokus Werte↓ Schutz", "1802250": "Normal Fokus Werte↓ Schutz T", "1802260": "Werte↓ Schutz+P Att.+GA Volltreffer", "1802270": "Drachen Fokus Werte↓ Schutz T", "1803010": "K.O. Werteüberg.", "1803020": "Wechselw. Übergabe", "1804010": "Gegnerangr.↓ T {{value}}", "1804020": "Antritt Initiative↓ T {{value}}", "1804030": "Vollt. Init.↑ {{value}}", "1804040": "Vollt. Vollt.q.↑ {{value}}", "1804050": "P Att. Initiative↑ {{value}}", "1804060": "Treff. Angr.↑ {{value}}", "1804070": "Treff. Vert.↓ {{value}}", "1804080": "P Att. Vert.↑ {{value}}", "1804090": "Treff. Zufallswert↑ {{value}}", "1804100": "Wert↓ Sp. Ang.↑ {{value}}", "1804110": "K.O. Angriffsw.↓ T {{value}}", "1804120": "Gegentreffer Flucht↑ {{value}}", "1804130": "Gegentreffer Init.↑ {{value}}", "1804140": "Halb KP Fluchtwert↑ {{value}}", "1804150": "Phys. Gegentr. Init.↓ {{value}}", "1804160": "Treff. Wert↓ {{value}}", "1804170": "Antritt Fluchtwert↑ {{value}}", "1804180": "Antritt Initiative↑ {{value}}", "1804190": "Antritt Volltr.↑ {{value}}", "1804200": "Notfall Sp. Ang.↑ {{value}}", "1804210": "Andere K.O. Angriff↑ {{value}}", "1804220": "Att. Sp. Ang.↓ {{value}}", "1804250": "Wert↓ Angriff↑ {{value}}", "1804260": "Notfall Fluchtwert↑ {{value}}", "1804270": "Att. Angriffswer.↑ {{value}}", "1804280": "Notfall Initiative↑ {{value}}", "1804290": "P Att. Sp. Ang.↑ {{value}}", "1804300": "P Att. Ang.↑ T {{value}}", "1804310": "P Att. Vollt.↑ T {{value}}", "1804320": "Gegentreffer Vert.↑ {{value}}", "1804330": "Gegentreffer Sp. Vert.↑ {{value}}", "1804340": "Notfall Vert.↑ T {{value}}", "1804350": "Halb KP Initiative↑ {{value}}", "1804360": "P Att. Vollt.↑ {{value}}", "1804370": "P Att. Sp. Vert.↑ T {{value}}", "1804380": "P Att. Flucht.↑ {{value}}", "1804390": "Attacken Vollt.↑ T {{value}}", "1804400": "Att. Sp. Ang.↑ {{value}}", "1804410": "Att. Init.↑ T {{value}}", "1804420": "Treffer Vert.↓ {{value}}", "1804510": "Antritt Sp. Ang.↑ {{value}}", "1804520": "Sp. Ang.↑ T {{value}}", "1804530": "Att. Angr.↑ {{value}}", "1804540": "Att. Sp. Vert.↑ {{value}}", "1804550": "GA 5 Werte↑ {{value}}", "1804560": "Antritt Vert.↑ {{value}}", "1804570": "Att. Angr.↑ T {{value}}", "1804580": "Att. Vert.↑ T {{value}}", "1804590": "Antritt Angriff↑ {{value}}", "1804600": "Notfall Angriff↑ {{value}}", "1804610": "Antr. Gegn. Genauigk.↓ T {{value}}", "1804620": "Att. Init.↑ {{value}}", "1804630": "GA Angriff↑ T {{value}}", "1804640": "Treff. Sp. Vert.↓ {{value}}", "1804650": "Att. Vert.↑ {{value}}", "1804660": "Antritt Sp. Vert.↑ {{value}}", "1804670": "Antritt Gegn. Sp. Vert.↓ T {{value}}", "1804680": "Att. Fluchtwert↑ {{value}}", "1804690": "Att. Genauigkeit↑ T {{value}}", "1804700": "Team Att. Team Vert.↑ {{value}}", "1804710": "Notfall Volltreffer↑ {{value}}", "1804720": "P Att. Flucht.↑ T {{value}}", "1804730": "Att. Flucht.↑ T {{value}}", "1804740": "Geg. Fehlschlag Angriff↑ {{value}}", "1804750": "Geg. Fehlschlag Sp. Ang.↑ {{value}}", "1804760": "GA Volltreffer↑ {{value}}", "1804770": "GA Gegn. Angriff↓ T {{value}}", "1804780": "Geg. Att. Ver. Sp. Ver.↓ {{value}}", "1804800": "K.O. Tr. Ang. Sp. Ang.↑ {{value}}", "1804810": "Antritt Sp. Ang.↓ T {{value}}", "1804820": "Gegentr. Angriff↑ {{value}}", "1804830": "Treff. Angr.↓ {{value}}", "1804840": "Vollt. Angr.↑ {{value}}", "1804850": "Vollt. Sp. Ang.↑ {{value}}", "1804860": "Att. Sp. Ang.↑ T {{value}}", "1804870": "Att. Sp. Vert.↑ T {{value}}", "1804880": "Gegentreffer Sp. Ang.↑ {{value}}", "1804890": "Gegentreffer Vert.↑ T {{value}}", "1804900": "Treff. Flucht.↓ {{value}}", "1804910": "Treff. Genau.↓ {{value}}", "1804930": "Zielverwirr. Vert.↓ {{value}}", "1804940": "Treff. Vert.↓ T {{value}}", "1804950": "Treff. Sp. Vert.↓ T {{value}}", "1804960": "Treff. Vert.↑ {{value}}", "1804970": "Angr. Init.↓ {{value}}", "1804980": "P Att. Vollt. Sp. Vert.↑ {{value}}", "1804990": "K.O. Sp. Vert.↓ T {{value}}", "1805010": "Sandsturm Fluchtw.↑", "1805030": "Statusp.cha.↑ {{value}}", "1805050": "Regen Vollt.↑ {{value}}", "1805060": "Vollt.quo.↑ {{value}}", "1805070": "Halb KP Vollt.↑ {{value}}", "1805080": "Antritt Fluchtwert↓ T {{value}}", "1805090": "GA Volltr.quo.↑ {{value}}", "1805100": "Hagel Vollt.↑ {{value}}", "1805110": "Antritt Vert.↓ T {{value}}", "1805120": "Effektiv. Volltr.↑ {{value}}", "1805130": "Effektiv. Sp. Angr.↑ {{value}}", "1805140": "P Att./GA/G D Att. Volltr.", "1805150": "P Att. +GA Volltr.", "1805160": "Sandst. P Att. +GA Volltr.q.↑ {{value}}", "1806020": "Die Ausd. v. Furl.", "1807010": "Gegentr. Ang. Absorption {{value}}", "1807020": "Treff. Wert Absorp. {{value}}", "1807030": "Treff. Vert. Wert Absorp. {{value}}", "1807040": "Treff. Sp. Vert. Wert Absorp. {{value}}", "1807050": "Treff. Init. Wert Absorp. {{value}}", "1807060": "Tr Geg 1 v. 5 Werte Absorp. T {{value}}", "1807070": "Gegentr. 1 v 5 Werte Absorp. T {{value}}", "1807080": "Ang. Ang. Absorp. {{value}}", "1808010": "Att. Werte↓ Aufhebung {{value}}", "1808020": "Notfall Werte↓ Aufhebung (1x) {{value}}", "1808030": "GA Werte↓ Aufhebung {{value}}", "1808040": "Antritt Werte↓ Aufh.", "1808050": "GA Werte↑ Umkehr T", "1808060": "GA Werte↓ Aufh. T {{value}}", "1809010": "Antr. Genaui.t↑ {{value}}", "1809020": "GA Fluchtwert↑ {{value}}", "1809030": "Antritt Initiative↑ T {{value}}", "1809040": "Hagel P Att. Vollt.↑ T {{value}}", "1809050": "Att. Wert↑ T {{value}}", "1809060": "Antritt Wert↑ {{value}}", "1809070": "Notfall Spezial Vert.↑ {{value}}", "1809080": "P Att. Sp. Vert.↑ {{value}}", "1809090": "Auflockern Fluchtwert↓ {{value}}", "1809100": "Gegentr. Ang. Sp. Ang.↑ T {{value}}", "1809110": "Gegner Fehlschlag Angriff↑ T {{value}}", "1809120": "GA Verteidigung↑ {{value}}", "1809130": "GA Genauigkeit↑ {{value}}", "1809140": "Antritt Wert↑ T {{value}}", "1809150": "GA Spezial Angriff↑ {{value}}", "1809160": "P Att. Vollt. Angr.↑ {{value}}", "1809170": "P Att. Wert↓ Wert↓ T {{value}}", "1809180": "Abwehr Vert.↑ {{value}}", "1809190": "Abwehr Spezial Vert.↑ {{value}}", "1809200": "Abwehr Angriff↑ T {{value}}", "1809210": "Regen Treff. Sp. Ang.↑ {{value}}", "1809220": "P Att. Vollt. Vert.↑ {{value}}", "1809230": "Gegner Fehlschl. Fluchtwert↑ {{value}}", "1809240": "Doppel Werte↓", "1809250": "GA Angriff↑ {{value}}", "1809260": "Geg. Att. Ang. Sp. Ang.↑ T {{value}}", "1809270": "Wechsels. Treff. Leiste↑ {{value}}", "1809280": "Vollt. Init.↑ {{value}}", "1809290": "P Status Att, Heilung T {{value}}", "1809300": "Antritt Genauigkeit↑ T {{value}}", "1809310": "Antritt Angriff↑ T {{value}}", "1809320": "Antritt Sp. Ang.↑ T {{value}}", "1809330": "Antritt Angriff + Sp.-Angriff↑ {{value}}", "1809340": "Treff. Sp. Vert.↑ {{value}}", "1809350": "Geg. Schlaf Treff. Vollt.↑ T {{value}}", "1809360": "P Att. Init,↑ T {{value}}", "1809370": "Gegn. Att-Angr.↓ /Ver.↓ {{value}}", "1809380": "Treff. Init.↑ T {{value}}", "1809390": "Sandsturm P-Att. -Init.↑ T {{value}}", "1809400": "Gegenst. Initiative↑ {{value}}", "1809410": "1. P-St. Att.-Ang. +Sp.-Ang.↑ T {{value}}", "1809420": "P Stat. Att. Vollt.↑ {{value}}", "1809430": "P Stat. Att. Doppel Werte↑", "1809440": "Att. Vollt.↑ {{value}}", "1809450": "Treff. 7 Werte↓ {{value}}", "1809460": "Treff. Vert.↑ T {{value}}", "1809470": "Treff. Sp. Vert.↑ T {{value}}", "1809480": "Antritt Vert. +Sp.-Vert.↑ {{value}}", "1809490": "Sandst. P Att. Vert. +Sp. Ver.↑ {{value}}", "1809500": "Sandsturm Treff. Genau.↓ {{value}}", "1809510": "Gegner Fehl. Init.↑ T {{value}}", "1809520": "Werte↓ Umkehr", "1809530": "Halb KP Vert.↑ T {{value}}", "1809540": "T Att. Sp. Vert.↑ T {{value}}", "1809550": "G-D Att. Init.↓ T {{value}}", "1809560": "Geg. Fehlschlag Genau.↑ T {{value}}", "1809570": "Gegn. Fehl. Ang. + Sp. Ang.↑ T {{value}}", "1809580": "P Status Att. Angr.↓ T {{value}}", "1809590": "P Status Att. Sp. Angr.↓ T {{value}}", "1809600": "G-D Att. Vert.↑ {{value}}", "1809610": "Antritt Volltr.↑ T {{value}}", "1809620": "T Att. Sp. Angr.↑ T {{value}}", "1809630": "GA Fluchtwert↓ T {{value}}", "1809640": "Erst Halb KP Angriff↑ {{value}}", "1809650": "P Status Att. Sp. Angr.↑ T {{value}}", "1809660": "P Status Att. Vert.↑ T {{value}}", "1809670": "Gegner Att. Flucht.↓ T {{value}}", "1809680": "Gegner Att. Init.↓ T {{value}}", "1809690": "Gegentreffer Initiative↑ T {{value}}", "1809700": "K.O. Treffer Angriff↑ {{value}}", "1809710": "Geg. Para. Tref.-5 Werte↓ {{value}}", "1809720": "Treffer Volltr. Chance↑ T {{value}}", "1809730": "G-D Att. Sp. Vert.↑ {{value}}", "1809740": "G-D Att. Sp. Vert.↑ T {{value}}", "1809750": "Tiefkühlkopf + Angr. Init.↑ {{value}}", "1809760": "P Status Att. Angr.↑ T {{value}}", "1809770": "P Status Att. Wert↓ T {{value}}", "1809780": "Gegentr. Vert. +Sp. Vert.↑ T {{value}}", "1809790": "Treffer Sp. Angr.↑ {{value}}", "1809800": "T Att. Angr.↑ T {{value}}", "1809810": "Hagel P Att. Vert. +Sp. Vert.↑ {{value}}", "1809820": "Status Att. Init.↑ T {{value}}", "1809830": "Status Att. Volltr. Chance↑ {{value}}", "1809850": "Geg. Problems. Ang. Sp. Vert.↓ {{value}}", "1809860": "Geg. Stör. Ang. Ang. +Sp. Ang.↓ {{value}}", "1809870": "T Att. Sp. Angriff↑ {{value}}", "1809880": "T Att. Sp. Vert.↑ {{value}}", "1809890": "Erstantritt Sp. Angriff↓ T {{value}}", "1809900": "Sandsturm Treffer Angriff↓ {{value}}", "1809910": "Erst P Stat. Att. 5 Werte↑ T {{value}}", "1809920": "Gegner Attacke Sp. Vert.↓ {{value}}", "1809930": "P Status Att. Init.↑ T {{value}}", "1809950": "Geg. Problemst. Ang. Werte 2↓ {{value}}", "1809960": "Gegentr.r Angr.↑ T {{value}}", "1809970": "Erst P Stat. Att. Vert.↑ T {{value}}", "1809980": "Erst P Stat. Att. Sp. Vert.↑ T {{value}}", "1809990": "1.P St. Att. Vert. +Sp. Vert.↑T {{value}}", "1810010": "Erst GA 5 Werte↑ T {{value}}", "1810020": "Zielverw. Angr. Tr. Werte↓ {{value}}", "1810030": "P Att. Vert.↑ T {{value}}", "1810040": "P St. Att. Sp. Vert. 2↑ T {{value}}", "1810050": "Ang. Vert. 2↓ {{value}}", "1810060": "Gegentr. Vert.↓ {{value}}", "1810070": "Gegentr. Sp. Vert.↓ {{value}}", "1810080": "Treffer Volltr.↑ {{value}}", "1810090": "Treffer Init.↓ {{value}}", "1810100": "P Att. Sp. Angr. 2↓ {{value}}", "1810110": "Erstantritt Init.↑ T {{value}}", "1810120": "Antritt Vert.↑ T {{value}}", "1810130": "Antritt Sp. Vert.↑ T {{value}}", "1810140": "T Att. Sp. Att. 2↑ {{value}}", "1810150": "T Att. Volltr. Chance 2↑ {{value}}", "1810160": "P Att/GA/G D Att Geg Sp Vert↓ {{value}}", "1810170": "P Att/GA/G D Att Geg Sp A+Sp V↓ {{value}}", "1810180": "P Att./GA/G D Att. Geg. Werte↓ {{value}}", "1810190": "Geg. Para. Ang. Init.↓ {{value}}", "1810200": "G D Att. Vert.↓ {{value}}", "1810210": "Geg. Paral. Ang. Volltr. Ch.↑T {{value}}", "1810220": "Treffer Werte↓ {{value}}", "1810230": "GF Ang. Vert.↑T + Geg Vert.↓T {{value}}", "1810240": "PF Ang Sp Vert↑T + Geg Sp Vert↓T {{value}}", "1810250": "EF Ang. Init.↑T + Geg Init.↓T {{value}}", "1810260": "T. Att. Vert. + Sp. Vert.↑ {{value}}", "1810270": "T. Att. Vert. + Sp. Vert. 2↑ {{value}}", "1810280": "T. Att. Volltr. Chance↑ T {{value}}", "1810290": "Angr. Init. 2↓ {{value}}", "1810300": "Effektiv. Init. 2↓ {{value}}", "1810310": "Feuer Angr. Angr.↓ {{value}}", "1810320": "Wasser Angr. Vert.↓ {{value}}", "1810330": "Käfer Angr. Sp. Vert.↓ {{value}}", "1810340": "Käfer Angr. Sp. Angr.↓ {{value}}", "1810350": "Br. Geg. Att. Vert. + Sp. Vert.↓ {{value}}", "1810360": "Att. Ang. +2 Volltr. Ch. +1 ↑ {{value}}", "1810370": "Abw. Vert. + Sp. Vert.↑ T {{value}}", "1810380": "Limit Att. Spez. Vert.↑ T {{value}}", "1810390": "Erst GA Vert.↓ T {{value}}", "1810400": "GA Genau.↓ T {{value}}", "1810410": "Angr. Genau.↑ T {{value}}", "1810420": "P Att. + GA Geg. Angr.↓ {{value}}", "1810430": "P Att. + GA Geg. Sp. Ang.↓ {{value}}", "1810440": "P Att. + GA Geg. Sp. Vert.↓ {{value}}", "1810450": "P Att. + GA Geg. Init.↓ {{value}}", "1810460": "P Att. + GA Geg. Fluchtw.↓ {{value}}", "1810470": "GA Sp. Vert.↑ T {{value}}", "1810480": "GA Volltr. Chance↑ T {{value}}", "1810490": "GA Fluchtw.↑ T {{value}}", "1810510": "P Status Att. Vert. 2↑ {{value}}", "1810520": "P Status Att. Sp. Vert. 2↑ {{value}}", "1810530": "Erst Halb KP Sp. Angr.↑ {{value}}", "1810540": "Regen Tr. Sp. Vert.↓ {{value}}", "1810550": "Gegn. Fehl. Vert. + Sp. Vert.↑ T {{value}}", "1810560": "Elektrof. Angr. Init.↓ T {{value}}", "1810570": "Geg. Para. Ang. Ang. + Vert.↓ {{value}}", "1810580": "Geg. Gift Ang. Ang. + Sp. Ang.↓ {{value}}", "1810590": "Angr. Sp. Angr.↓ {{value}}", "1810600": "Att. Angr. + Sp. Angr.↑ {{value}}", "1810610": "P Attacke Werte↓ {{value}}", "1810620": "Gegentr. 1 v. 5 Werte↑ T {{value}}", "1810630": "Br Geg. Ang. Ang. + Spez Vert.↓ {{value}}", "1810640": "Att. Genau.↑ {{value}}", "1810650": "G D Att. Vert.↑ T {{value}}", "1810660": "Gift Geg. Ang. Werte 2↓ {{value}}", "1810670": "Tr. Fluchtw.↑ T {{value}}", "1810680": "Gift Geg. Angr. Angr.↑ {{value}}", "1810690": "Gift Geg. Angr. Init.↑ {{value}}", "1810700": "Erst Halb KP Ang. + Sp. Ang.↑ {{value}}", "1810710": "Att. 1 v. 5 Werte↑ T {{value}}", "1810720": "Geg Fl. unmögl. Tr Init↑ T {{value}}", "1810740": "Att. 1 v. 5 Werte↑ {{value}}", "1810750": "P Att. Vert. + Sp. Vert.↑ {{value}}", "1810760": "Geg. Wechselsp. Genau.↓ {{value}}", "1810770": "GA Vert.↓ Geg. Seite {{value}}", "1810780": "Wett. / Fokus / Feld Wech. Flu.↑ T {{value}}", "1810790": "Kismetw. Ident. Wert 2↑ T", "1810800": "Geg. P Att. Sp. Vert. 2↓ {{value}}", "1810810": "Gift Geg. P St. Att. Werte↓×2", "1810820": "P Att. Init. 2↑ {{value}}", "1810830": "GA Init.↑ T {{value}}", "1810840": "Tr. Flucht.↑ {{value}}", "1810850": "Erst KP↓ 60% Ang. + Sp. Ang.↑ {{value}}", "1810860": "GA Sp. Vert.↑ {{value}}", "1810870": "GA Vert. +Sp. Vert.↑ {{value}}", "1810880": "Brand Geg. Tr. Sp. Ang.↓ {{value}}", "1810890": "Umschl. Geg. Tr. Sp. Vert.↓ {{value}}", "1810900": "Absorp. Tr. Geg. Ang.↓ {{value}}", "1810910": "P Att. Werte↑ 2×", "1810920": "Geg. P Att. Angr.↓ {{value}}", "1810930": "Kismetw. Ident. Wert↑ T", "1810940": "P Stat. Att. Statusw.↑ {{value}}", "1810950": "G D Att. Geg. Vert.↓ T {{value}}", "1810960": "Brand Geg. Tr. Angr.↓ {{value}}", "1810970": "Umschl. Geg. Tr. Init.↓ {{value}}", "1810980": "Absorp. Angr. Sp. Angr.↓ {{value}}", "1810990": "P Stat. Att. Genau. 2↑ T {{value}}", "1811010": "Brand Geg, Tr. Werte↓ {{value}}", "1811020": "Paral. G. Tr. Vert. +Sp. Vert↓ {{value}}", "1811030": "G D Att. Angr.↑ {{value}}", "1811040": "Gift Geg, Tr. Werte↓ {{value}}", "1811050": "P Stat. Att. Geg. Sp. Vert.↓ {{value}}", "1811060": "Tr. Ang. +Sp. Ang.↑ T {{value}}", "1811070": "Erst GA Geg. Vert. +Sp. Vert.↓ {{value}}", "1811080": "P Att. Geg. Vert.↓ {{value}}", "1811090": "P Att. /GA Geg. Vert. 2↓ {{value}}", "1811100": "Tr. Init. 2↑ T {{value}}", "1811110": "Gift G Tr Ang↓ +Para. G Tr Sp Ang↓ {{value}}", "1811120": "P Att./ GA Geg. Sp. Vert. 2↓ {{value}}", "1811130": "G Unl. Schadenf. Tr. Vert +Sp Vert↓ {{value}}", "1811140": "G Unl. Schadenf. Tr. Init.↑ {{value}}", "1811150": "Tr. Angr.↑ T {{value}}", "1811160": "Tr. Sp. Angr.↑ T {{value}}", "1811170": "Umschl. Geg. Tref. Ang.↓ {{value}}", "1811180": "Tr. Geg. Ang. /Sp. Ang.↓ {{value}}", "1811190": "Tr. Fluchtw.↑ {{value}}", "1811200": "Tr. Ang. +Sp. Ang.↑ T {{value}}", "1811210": "P Att. /GA Geg. Ang. 2↓ {{value}}", "1811220": "P Att. /GA Geg. Sp. Ang. 2↓ {{value}}", "1811230": "Antr. Geg. Statusw.↓ T {{value}}", "1811240": "W/F/F Init.↑ T {{value}}", "1811250": "Geg. Prob. Tr. Werte 2↓ {{value}}", "1811260": "Erst T Att. Sp. Angr.↑ T {{value}}", "1811270": "Tr. Geg. Angr.↓ {{value}}", "1811280": "Att. Vert. +Sp. Vert.↑ T {{value}}", "1811290": "T Att. Init. +Flucht.↑ T {{value}}", "1811300": "Tr. Angr. +Sp. Ang. 2↑ {{value}}", "1811310": "G D Att. Geg. 7 Werte↓ {{value}}", "1811320": "Phys. Angr. Vert. 2↓ {{value}}", "1811330": "Sp. Angr. Sp. Vert. 2↓ {{value}}", "1811340": "P Status Att. Einsatz Angr.↓ T {{value}}", "1811350": "P Status Att. Einsatz Sp. Ang.↓ T {{value}}", "1811360": "Angr. Geg. Vert. +Sp. Vert.↓ {{value}}", "1811370": "GA Geg. Sp. Ang.↓ {{value}}", "1811380": "GA Spez. Angr.↑ T {{value}}", "1811390": "GA 5 Werte↑ T {{value}}", "1811400": "Gift Fokus Angr. Statusw.↓ {{value}}", "1811410": "Tr. Statusw. 2↑ {{value}}", "1811420": "Antr. Angr +Init.↑ {{value}}", "1811430": "P Stat. Att. Geg. Vert. 2↓ {{value}}", "1811440": "Geg. Para. Ang. Vert.↓ {{value}}", "1811450": "Gegentr. Geg. 1 v. 5 Werte 2↓ {{value}}", "1811460": "Erst GA Doppel Werte↓", "1811470": "Antr. Spez. Angr +Init.↑ {{value}}", "1811480": "Tr. Geg. Sp. Vert.↓ {{value}}", "1811490": "GA 7 Werte↑ {{value}}", "1811500": "T Att. Angr +Sp. Angr.↑ {{value}}", "1811510": "G D Att. Ang. +Sp. Ang.↑ T {{value}}", "1811520": "Erst P Stat. Att. Volltr. Chance↑ T {{value}}", "1811530": "P Stat. Att. Geg. Angr. 2↓ {{value}}", "1811540": "Gegentr. Sp. Ang.↑ T {{value}}", "1811550": "Freundeskr. Angr. Ang. +Sp. Ang.↓ {{value}}", "1811560": "GA Ang. +Sp. Ang.↓ {{value}}", "1811570": "Antr. Fluchtw.↑ T {{value}}", "1811580": "G. Wechselsp. Ang. 1 v. 5 Werte↑ T {{value}}", "1811590": "Erst T Att. Vert. +Sp. Vert.↑ {{value}}", "1811600": "Feldeff. Ang. +Sp. Ang.↑ T {{value}}", "1811610": "P Stat. Att. Geg. Vert.↓ {{value}}", "1811620": "Angr. Geg. Ang. +Sp. Ang.↓ {{value}}", "1811630": "G D Att. Geg. Sp. Vert.↓ T {{value}}", "1811640": "Team Att. Sp. Vert.↑ {{value}}", "1811650": "P Status Att. Sp. Ang.↑ {{value}}", "1811660": "Antr. Sp. Ang. +Sp. Vert.↑ {{value}}", "1811670": "Geg. Para. Ang. Sp. Vert.↓ {{value}}", "1811680": "Gegentr. Geg. Ang. +Sp. Ang.↓ {{value}}", "1811690": "Erstantr. Angr.↓ T {{value}}", "1811700": "G. Wechselsp. Ang. Ang. +Sp. Ang.↓ {{value}}", "1811710": "Sonne Angr. Ang. +Vert.↓ {{value}}", "1811720": "Att. Att.l. 2↑ {{value}}", "1811730": "Angr. Statusw.↓ ×3 {{value}}", "1811740": "Sofortangr. Statusw. 2↓ {{value}}", "1811750": "Att. Sp. Ang. 2↑ +Volltr. Chance 1↑ {{value}}", "1811760": "Sonne Angr. 2 Werte↓ {{value}}", "1811770": "Antr. Sp. Ang. +Fluchtw.↑ {{value}}", "1811780": "Antr. Sp. Ang. 4↑ +Volltr. Ch. {{value}}↑", "1811790": "P Att. /GA Geg. Vert. ↓ {{value}}", "1811800": "Erstantr. 7 Werte↓ T {{value}}", "1811810": "Hagel Angr. Sp. Vert.↓ {{value}}", "1811820": "Erst GA Gena +Fluchtw.↓ T {{value}}", "1811830": "Freundeskr. Vert. +Sp. Vert. 2↑ T {{value}}", "1811840": "Erstantr. Vert. +Sp. Vert. ↑ {{value}}", "1811850": "Angr. Sp. Vert. 2↓ {{value}}", "1811860": "Team Att. Sp. Ang.↑ {{value}}", "1811870": "Geg. Para. Angr. Ang. 2↓ {{value}}", "1811880": "Gegentr. Fluchtw. 2↑ T {{value}}", "1811890": "P Stat. Att. Vert. +Sp. Vert.↑ {{value}}", "1811900": "Erstantr. 7 Werte↑ {{value}}", "1811910": "Gegentr. Geg. Init. 2↓ {{value}}", "1811920": "Sonne Ang. Geg. Vert. +Sp. Vert.↓ {{value}}", "1811930": "G D Att. Geg. Sp. Vert.↓ {{value}}", "1811940": "Erst Sinnohs Freundeskr. (Sp.): Sp. Ang.↑ {{value}}", "1811950": "GA Anw. Vert. +Sp. Vert.↓ {{value}}", "1811960": "Att. Anw. Vert. +Sp. Vert.↓ {{value}}", "1811970": "Geg. Brand Ang. Sp. Ang. +Sp. Vert.↓ {{value}}", "1811980": "Geg. Para. Ang. Ang. +Sp. Ang.↑ T {{value}}", "1811990": "Geg. Fehlschl. Statusw. 2↑ T {{value}}", "1812010": "Team Att. Mitstr. Ang.↑ {{value}}", "1812020": "Erdbeben Ang.↓ {{value}}", "1812030": "Init.↓ Umkehr", "1812040": "Erstantr. Ang.↑ {{value}}", "1812050": "Erstantr. Sp. Ang.↑ {{value}}", "1812060": "Angr. Sp. Ang. +Sp. Vert.↓ {{value}}", "1812070": "Feen Fokus Ang. Wert↓ 2× {{value}}", "1812080": "Brand Geg. Ang. Wert 2↓ {{value}}", "1812090": "Geg. Umschl. Ang. Init. 2↓ {{value}}", "1812100": "Mitstr. Wett./Fok./Feld 1 v. 5 Werte 2↑ T {{value}}", "1812110": "T Att. AEP mind. 1 Ang. Sp. Vert.↓ {{value}}", "1812120": "T Att. AEP Null Angr. Wert 2↓ {{value}}", "1812130": "Geg. Verw. Angr. Genau.↓ {{value}}", "1812140": "Angr. Wert 2↓ {{value}}", "1812150": "Brand Geg. Angr. Ang. +Sp. Ang.↓ {{value}}", "1812160": "Angr. Angr. 2↓ {{value}}", "1812170": "Treffer Init.↑ {{value}}", "1812180": "Angriff Spezial Angriff 4↓ {{value}}", "1812190": "Erst P Status Att. Sp. Angriff↑ {{value}}", "1812200": "Erst P Status Attacke Volltreffer↑ {{value}}", "1812210": "Angriff Sp. Vert. 3↓ {{value}}", "1812220": "Geg. Problem Mitstr. Angriff Wert↓ {{value}}", "1812240": "Gegentreffer Ident. Wert 2↑ T {{value}}", "1812260": "P Status Att. Initiative 6↑ {{value}}", "1812270": "Sonne Mitstr. Angriff Initiative↑ T {{value}}", "1812280": "Geg. Umschl. Mitstr. Ang. Wert↑ {{value}}", "1812290": "P Attacke Sp. Angriff↓ {{value}}", "1812300": "Angriff Genauigkeit 3↓ {{value}}", "1812310": "G D Attacke Vert.+Sp. Vert.↑ {{value}}", "1812320": "Sonnen Treffer Verteidigung↓ {{value}}", "1812330": "Kampf Fokus Angriff Sp. Vert.↓ {{value}}", "1812340": "Einalls Freundeskr. (Sp.): Vert.+Sp. Vert. 2↑ T {{value}}", "1812350": "Angriff Vert.+Sp. Vert. 2↑ T {{value}}", "1812360": "Erstantritt 7 Werte↑ T {{value}}", "1812370": "Nahkampf Ang.+Sp. Ang.↓ {{value}}", "1812380": "Geg. Brand Ang. Vert.+Sp. Vert.↓ {{value}}", "1812400": "Einalls Freundeskr. (Sp.): Sp. Ang. 2↑ T {{value}}", "1812410": "Gef. Terakristallisierung Angriff↑ {{value}}", "1812420": "Regen Angriff Werte 2↓ {{value}}", "1812430": "Erst Gesteinsschadenfeld Angriff↑ {{value}}", "1812440": "Erst Gesteinsschadenf. Volltr. Chance↑ {{value}}", "1812450": "Geg. Gesteinsschadenf. Ang. Werte 2↓ {{value}}", "1812460": "Attacke Angriff+Initiative↑ T {{value}}", "1812470": "Geg. Brand Ang. Ang.+Vert. 2↓ {{value}}", "1812480": "Geg. Gift Ang. Vert.+Sp. Vert.↓ {{value}}", "1812490": "Angriff Verteidigung 6↓ {{value}}", "1812500": "Angriff Spezial Verteidigung 6↓ {{value}}", "1812510": "Mitstr. Freundeskreis Initiative 2↑ T {{value}}", "1812520": "Erst Johtos Freundeskr. (Sp.): Sp. Ang.↑ T {{value}}", "1812530": "Erst Johtos Freundeskr. (Sp.): Volltr.↑ T {{value}}", "1812540": "Phys. Angriff 3× Phys. Boost {{value}}", "1812550": "Spez. Angriff 3× Spez. Boost {{value}}", "1812560": "Erstantr. Ang.+Sp. Ang.↓ T {{value}}", "1812570": "Angriff Sp. Ang. 2↓ {{value}}", "1812580": "Angriff Verteidigung+Initiative↓ {{value}}", "1812590": "Geg. Verw. Ang. Sp. Vert. 2↓ {{value}}", "1812600": "Angriff Verteidigung 3↓ {{value}}", "1812610": "Erstantritt Volltreffer Chance↑ {{value}}", "1812620": "Abwehr Verteidigung 4↓ T {{value}}", "1812630": "Abwehr Sp. Vert. 4↓ T {{value}}", "1812640": "P Att./GA Gegner Vert.+Sp. Vert. 2↓ {{value}}", "1812650": "Attacke Gegner Ident. Wert 2↓ {{value}}", "1812660": "Angriff Ident. Wert↓ 2× {{value}}", "1812670": "Erstantritt Vert.+Sp. Vert.↑ T {{value}}", "1812680": "Antritt Ang. 6↑+Volltr. Ch. {{value}}↑", "1812690": "Attacke Gegner Angriff 2↓ {{value}}", "1812700": "Attacke Gegner Sp. Ang. 2↓ {{value}}", "1812710": "Angriff Ang.+Vert. 2↓ {{value}}", "1812720": "Erstantritt Sp. Ang. {{value}}↑+Volltr. 3↑", "1812730": "P Status Att. Geg. Ang.+Sp. Ang.↓ {{value}}", "1812740": "Grasfeld Angriff Verteidigung 2↓ {{value}}", "1812750": "Gesteins Fokus Angriff Ang. 2↓ {{value}}", "1812760": "Geg. Verw. Ang. Wert 2↓ {{value}}", "1812770": "Angriff Ang.+Vert.↓ {{value}}", "1812780": "Wert↓ Reflexion", "1812790": "Freundeskreis Initiative 2↑ T {{value}}", "1812810": "Elektrofeld Angriff Wert↓ {{value}}", "1812820": "Erstantr. GA Countd. 1↓+Volltr. Ch. 3↑", "1812840": "Angriff Angriff 2↑ T {{value}}", "1812850": "Angriff Sp. Angriff 2↑ T {{value}}", "1812860": "Erst GA Wert↓ 10× T", "1901010": "Effektüber.", "1902010": "Notfall Physischer Schaden↓ T", "1902020": "GA Grasfeld", "1902030": "Erstantritt Hagel", "1902040": "Antritt Problemlos T", "1902050": "GA Attackenl.↑ T", "1902060": "Erstantritt Sonne", "1902070": "Erstantritt Regen", "1902100": "Erstantritt Sandsturm", "1902110": "Erst GA Sonne", "1902120": "Erst GA Regen", "1902130": "Erst GA Sandsturm", "1902140": "Erstantr. Phys. + Sp. Schaden↓ T", "1902150": "P Att. Wetteraufh. {{value}}", "1902160": "Erst GA Volltr. Vert. T", "1902170": "Heilung Leiste↑", "1902180": "Erst GA Elektrofeld", "1902190": "Sandsturmd.↑ {{value}}", "1902200": "Erstantr. Sands. +Sands. Schutz", "1902210": "1. P St. Att. Att.l.↑ T", "1902220": "P St. Att. Attackenl.↑ T", "1902230": "Erst Notfall Attackenl.↑ T", "1902240": "Erst GA Boden Fokus", "1902250": "Erstantr. Boden Fokus", "1902260": "Phy. Schad.↓ Dauer↑ {{value}}", "1902270": "Spez. Schad.↓ Dauer↑ {{value}}", "1902280": "Probleml. Dauer↑ {{value}}", "1902290": "G D Attacke Elektrofeld", "1902300": "Erstantr. Stahl Fokus", "1902310": "Feen Fokus Dauer↑ {{value}}", "1902320": "Erstantr. Feen Fokus", "1902330": "Erstantr. Drachen Fokus", "1902340": "GA Regen", "1902350": "GA Elektrof.", "1902360": "Erstantr. Flug Fokus", "1902370": "Att. Attackenl.↑ {{value}}", "1902380": "Gesteins Fokus Dauer↑ {{value}}", "1902390": "GA Attackenl.↑ T", "1902400": "Erstantr. Phys. Schaden↓ T", "1902410": "Erst GA Kampf Fokus", "1902420": "Erstantr. Elektrof. + EF Dauer↑ {{value}}", "1902430": "EA Feen Fokus + Feen Fokus Dauer↑ {{value}}", "1902440": "Erstantr. Grasf. + GF Dauer↑ {{value}}", "1902450": "Erstantr. Psychof. + PF Dauer↑ {{value}}", "1902460": "Geg Werterh. unmögl Dauer↑ {{value}}", "1902470": "Tr. Phys Schadenssen. T {{value}}", "1902480": "Eis Fokus Hagelsturm", "1902490": "GA Psychof.", "1902500": "GA Feen Fokus", "1902510": "Erstantritt Eis Fokus", "1902520": "Hagel Dauer↑ {{value}}", "1902530": "Eis Fokus Dauer↑ {{value}}", "1902540": "K.O. Treffer Attackenleiste↑ T {{value}}", "1902550": "Erstantr. Geist. Fokus", "1902560": "Erstantr. Spez. Schadenss. T", "1902570": "Erst GA Hagel", "1902580": "Drachen Fokus Dauer↑ {{value}}", "1902590": "GA Unlicht Fokus", "1902600": "Erst Halb KP Sonne", "1902610": "Geg. Unl. Schadenf. Dauer↑ {{value}}", "1902620": "Erst GA Feld keine Werterhöh.", "1902630": "Tr. Volltr. Vert. T {{value}}", "1902640": "Gift Fokus Dauer↑ {{value}}", "1902650": "Erst GA Gift Fokus", "1902660": "Elektrof. Dauer↑ {{value}}", "1902670": "Erst GA Normal Fokus", "1902680": "Einalls Freundeskr. (Phys.): Dauer↑ {{value}}", "1902690": "GA Flug Fokus", "1902700": "Flug Fokus Dauer↑ {{value}}", "1902710": "Kantos Freundeskr. (Spez.): Dauer↑ {{value}}", "1902720": "T Att. Volltr. Vert. T {{value}}", "1902730": "Johtos Freundeskr. (Phys.): Dauer↑ {{value}}", "1902740": "Grasfeld Dauer↑ {{value}}", "1902750": "Volltr. Schutz Phys. +Sp. Sch.↓ T", "1902760": "Erstantr. Gesteins Fokus", "1902770": "GA Gesteins Fokus", "1902780": "Stahl Fokus Dauer↑ {{value}}", "1902790": "Sinnohs Freundeskr. (Vert.): Dauer↑ {{value}}", "1902800": "Erstant. Elektrof.", "1902810": "Erstantr. Gift Fokus", "1902820": "Boden Fokus Dauer↑ {{value}}", "1902830": "Att. Werterh. unmögl. {{value}}", "1902840": "Erst P Status Att. Stahl Fokus", "1902850": "Einalls Freundeskr. (Vert.): Dauer↑ {{value}}", "1902860": "Erst Ang. Werterh. unmögl.", "1902870": "Erstantr. Unlicht Fokus", "1902880": "Galars Freundeskr. (Spez.): Dauer↑ {{value}}", "1902890": "Erst KP↓ 50% Hagel", "1902900": "G D Att. Att.l.↑ T", "1902910": "Geister Fokus Dauer↑ {{value}}", "1902920": "Unlicht Fokus Dauer↑ {{value}}", "1902930": "Alolas Freundeskr. (Spez.): Dauer↑ {{value}}", "1902940": "Alolas Freundeskr. (Vert.): Dauer↑ {{value}}", "1902950": "T Att. Att.l.↑ {{value}}", "1902960": "Passios Freundeskr. (Vert.): Dauer↑ {{value}}", "1902970": "GA Eis Fokus", "1902980": "Erstantr. Grasfeld", "1902990": "Giga Getrommel Grasfeld", "1903020": "Feu. Schadenf. Sch.", "1903080": "Giftschadenf. Sch.", "1903130": "Gest. Schadenf. Sch.", "1903160": "Unl. Schadenf. Sch.", "1903170": "Stahl Schadenf. Sch.", "1904020": "Feu. Schadenf. Res. {{value}}", "1904080": "Giftschadenf. Res. {{value}}", "1904130": "Gest. Schadenf. Res. {{value}} ", "1904160": "Unl. Schadenf. Res. {{value}}", "1904170": "Stahl. Schadenf. Res. {{value}}", "1904190": "Schadenf. Res. {{value}}", "1905010": "Erst Regentanz Feen Fokus", "1905020": "Giga Brandball Sonne", "1905030": "Dyna Faust Kampf Fokus", "1905040": "Dyna Düse Flug Fokus", "1905050": "G D Attacke Sonne", "1905060": "Erst GA Eis Fokus", "1905070": "Erst GA Drachen Fokus", "1905080": "Erst Sonnentag Grasfeld", "1905090": "G D Attacke Normal Fokus", "1905100": "Normal Fokus Dauer↑ {{value}}", "1905110": "Paldeas Freundeskr. (Vert.): Dauer↑ {{value}}", "1905120": "G D Att. Geister Fokus", "1905130": "Erstantr. Psychofeld", "1905140": "Erst P Att. Kampf Fokus", "1905150": "G D Attacke Gift Fokus", "1905160": "Erst P Att. Psychofeld", "1905170": "Psychofeld Dauer↑ {{value}}", "1905180": "Erstantr. Giftschadenf.", "1905190": "Erst GA Gesteins Fokus", "1905200": "Erst Angr. Regen", "1905210": "Erst Beere AEP Null Stahl Fokus", "1905220": "Gegentr. Sandsturm {{value}}", "1905230": "Giga Sanktion Feen Fokus", "1905240": "Erst Feenstärke Elektrof.", "1905250": "Dyna Brocken Gesteins Fokus", "1905260": "Erstantr. Käfer Fokus", "1905270": "Käfer Fokus Dauer↑ {{value}}", "1905280": "Erst P Att. Sandsturm", "1905290": "Dyna Erdstoß Boden Fokus", "1905300": "Elektrof. Gift Fokus", "1905310": "Erst GA Grasfeld", "1905320": "Erstantr. Normal Fokus", "1905330": "Erst T Att. Grasfeld", "1905340": "Erstantr.: Alolas Freundeskr. (Spez.)", "1905350": "GA Feuerschadenf.", "1905360": "Regen: Galars Freundeskr. (Spezial)", "1905370": "Grasfeld: Galars Freundeskr. (Phys.)", "1905380": "Sonne: Galars Freundeskr. (Vert.)", "1905390": "GA Wetteraufhebung {{value}}", "1905400": "Erstantr.: Paldeas Freundeskr. (Spez.)", "1905410": "Erst GA: Paldeas Freundeskr. (Spezial)", "1905420": "Boden Fokus Att.l.↑ {{value}}", "1905430": "GA Giftschadenf.", "1905440": "Gegn. Giftschadenf. Dauer↑ {{value}}", "1905450": "Erstantr.: Sonne EX", "1905460": "Erstantr.: Regen EX", "1905470": "Antr. Geg. Werter. unmögl.", "1905480": "Kantos Freundeskr. (Vert.): Dauer↑ {{value}}", "1905490": "Hoenns Freundeskr. (Vert.): Dauer↑ {{value}}", "1905500": "Erst GA: Kantos Freundeskr. (Vert.)", "1905510": "Erst GA: Hoenns Freundeskr. (Vert.)", "1905520": "Erst GA: Paldeas Freundeskr. (Vert.)", "1905530": "Sinnohs Freundeskr. (Spezial): Dauer↑ {{value}}", "1905540": "Att.l.↑ Dauer↑ {{value}}", "1905550": "Hoenns Freundeskr. (Phys.): Dauer↑ {{value}}", "1905560": "Johtos Freundeskr. (Vert.): Dauer↑ {{value}}", "1905570": "Erst Band v. Paldea: Feen Fokus", "1905580": "G D Attacke: Käfer Fokus EX", "1905590": "Johtos Freundeskr. (Spez.): Dauer↑ {{value}}", "1905600": "Erstantr.: Johtos Freundeskr. (Spez.)", "1905610": "Erst T Att.: Paldeas Freundeskr. (Vert.)", "1905620": "Erstantr.: Einalls Freundeskr. (Vert.)", "1905630": "Erst GA: Einalls Freundeskr. (Vert.)", "1905640": "G D Attacke Drachen Fokus", "1905650": "Kampf Fokus Dauer↑ {{value}}", "1905660": "Erst GA: Johtos Freundeskr. (Vert.)", "1905670": "Erst GA: Kalos’ Freundeskr. (Vert.)", "1905680": "Erst GA: Galars Freundeskr. (Vert.)", "1905720": "Erst Angriff: Flug Fokus EX", "1905730": "Erstantr. Sp. Schad.↓+Sp. Schad.↓ Dauer↑ {{value}}", "1905740": "Erst Angriff Geister Fokus", "1905750": "Erst Ang. Geister Fok.+Geister Fok. Dauer↑ {{value}}", "1905760": "GA Spez. Schaden↓", "1905770": "Sonne Kampf Fokus", "1905780": "Erstantr.: Paldeas Freundeskr. (Vert.)", "1905810": "Erst Angriff Gesteins Fokus", "1905820": "Erst Angriff Drachen Fokus", "1905830": "Erst GA: Kantos Freundeskreis (Phys.)", "1905840": "Erst Angriff: Gift Fokus EX", "1905850": "Erst GA: Sinnohs Freundeskr. (Spezial)", "1905860": "Erst T Attacke: Geister Fokus EX", "1905870": "Erst Angriff: Elektrofeld EX", "1905880": "Erst Angriff: Boden Fokus EX", "1905890": "Erst GA Feen Fokus", "1905900": "Sonne+Kampf Fokus Dauer↑ {{value}}", "1905910": "Erst Angr.: Paldeas Freundeskr. (Vert.)", "1905920": "Erst GA: Sinnohs Freundeskreis (Vert.)", "1905930": "Erst GA: Alolas Freundeskreis (Vert.)", "1905950": "Geg. Gesteinsschadenf. Dauer↑ {{value}}", "1905960": "Gef. Terakristall. Unlicht Fokus", "1905980": "Erstantritt Kampf Fokus", "1906040": "Erst Angr.: Kantos Freundeskr. (Spez.)", "1906050": "Erst GA: Kantos Freundeskr. (Spezial)", "1906060": "Mitstr. Sonne Boden Fokus", "1906070": "Erst GA Geister Fokus", "1906080": "Erst Ang. Psychofeld+Psychofeld Dauer↑ {{value}}", "1906090": "Erst GA: Einalls Freundeskreis (Phys.)", "1906110": "Erst P Status Att.: Eis Fokus EX", "1906130": "T Att. Kantos Freundeskr. (Sp.)", "1906140": "Erst GA Flug Fokus", "1906150": "Erst Angriff Gift Fokus", "1906160": "Erst T Attacke Käfer Fokus", "1906170": "Erst Angriff Sonne", "1906180": "Erst Angriff Sonne+Sonnendauer↑ {{value}}", "1906190": "GA Normal Fokus", "1906200": "Sync Att. Grasfeld", "1906210": "Sync Att. Grasfeld+GF Dauer↑ {{value}}", "1906220": "Erst P Status Att. Feen Fokus", "1906230": "Erst Angriff Käfer Fokus", "1906240": "Erst GA Psychofeld", "1906250": "Erstantritt permanent Sandsturm", "1906260": "Erstantritt permanent Sonne", "1906270": "Erstantritt permanent Flug Fokus", "1906280": "Antritt Phys. Schadenssenkung", "1906290": "Antritt Spez. Schadenssenkung", "1906310": "Erst Angriff Eis Fokus", "1906320": "Erst P Status Att. Boden Fokus", "1906330": "Erst T Attacke Flug Fokus", "1906340": "Erst GA Gift Fok.+Gift Fok. Dauer↑ {{value}}", "1906360": "G D Attacke Unlicht Fokus", "1906370": "Erst Angriff Feen Fokus", "1906380": "Erst Angr.: Johtos Freundeskr. (Vert.)", "1906390": "Grasfeld+Gesteins Fokus Dauer↑ {{value}}", "1906400": "Attacke Regen", "1906410": "Attacke Unlicht Fokus", "1906420": "Attacke Regen+Unlicht Fokus", "1906430": "Regen+Unlicht Fokus Dauer↑ {{value}}", "1906440": "Erst GA Regen+Regendauer↑ {{value}}", "1906460": "Erst Ang. Gesteins Fok.+Gesteins Fok. Dauer↑ {{value}}", "1906470": "Erst Sync Att. Kampf Fokus EX", "1906500": "Stahl Fokus: Galars Freundeskreis (Vert.)", "1906510": "Erstantritt perm. Phys. Schadenssenk.", "1906520": "Erstantritt perm. Spez. Schadenssenk.", "1906580": "Erst GA: Johtos Freundeskreis (Phys.)", "1906590": "Erst GA: Johtos Freundeskreis (Spez.)", "1906600": "Erst GA: Galars Freundeskreis (Phys.)", "1906610": "Erst GA: Galars Freundeskreis (Spez.)", "1906620": "Erst Tera Ausbruch des Regenbogenjuwels: Normal Fok.", "1906630": "Erst GA: Kantos Freundeskr. (3 Var.)+Dauer↑ {{value}}", "1906640": "Erst Angriff Elektrofeld", "1906670": "Erst Ang. Unlicht Fok.+Unlicht Fok. Dauer↑ {{value}}", "1906680": "Erstantritt permanent Feen Fokus", "1906710": "Erstantritt permanent Unlicht Fokus", "1906720": "Erst GA Kampf Fok.+Kampf Fok. Volltr. Schutz T", "1906730": "Erst Aurasphäre S 0 Kalos’ Freundeskr. (Sp.)", "1906750": "Erst Zertrümmerer S AEP 0 Kalos’ Freundeskr. (Phys.)", "1906770": "Phys.+Sp. Schaden↓ Dauer↑ {{value}}", "1906780": "Attacke Phys.+Sp. Schaden↓ {{value}}", "1906790": "Erst Angriff Flug Fokus", "1906830": "Erst GA Normal Fok.+Normal Fok. Dauer↑ {{value}}", "1906840": "Antritt Psychofeld", "1906850": "Erst Angriff Grasfeld", "1906860": "Erst Ang. Grasfeld+Grasfeld Dauer↑ {{value}}", "1906880": "Erst Angriff Kampf Fokus", "2001010": "Sandstu.sch.", "2101010": "Volltr.sch.", "2101020": "Regen Volltr. Schutz T", "2101030": "Unlicht Fokus Volltr. Schutz T", "2101040": "Eis Fokus Volltr. Schutz T", "2101050": "Paldeas Freundeskr. (Vert.): Volltr. Schutz T", "2101060": "Psychofeld Volltr.schu.", "2101070": "Volltr.schu. T", "2101080": "Gegn. Giftschadenf. Volltr.schu. T", "2101090": "Att.l.↑ Volltr.schu. T", "2101100": "Einalls Freundeskr. (Spez.): Volltr. Schutz T", "2101110": "Gesteins Fokus Volltr. Schutz T", "2101120": "Freundeskreis Volltr. Schutz T", "2101130": "Normal Fokus Volltr. Schutz T", "2101140": "Feld Volltrefferschutz", "2101150": "Flug Fokus Volltr. Schutz", "2101160": "Drachen Fokus Volltr. Schutz T", "2201010": "Zusatzprob.↑ {{value}}", "2201020": "Störungsch.↑ {{value}}", "2201030": "Senkungsch.↑ {{value}}", "2201040": "Vollt.stö.↑ {{value}}", "2201050": "↑-Wahrsch.↑ {{value}}", "2201060": "Problem Störungsch.↑ {{value}}", "2201070": "Senkungsch. +Effekt × 2", "2301010": "Sandsturm Sp.-Vert.↑", "2301020": "Hagel Vert.↑", "2301030": "PF Spezial Vert.↑", "2301040": "Sandst. Schutz + Vert. + Sp.-Ver.↑", "2301050": "Mind. Halb KP Angriff↑", "2301090": "Halb KP Vert. +Sp. Vert.↑ {{value}}", "2301100": "Hagel Vert. +Sp. Vert.↑", "2301110": "Wetterw. -5 Werte↑", "2301120": "P Stat. Att. Werte↑ T {{value}}", "2301130": "GA Zielausw.", "2301140": "G D Att. Zielausw.", "2301150": "Gef. Feldef. 5 Werte↑ {{value}}", "2301160": "KP↓ Sp. Angr.↑ {{value}}", "2301170": "P Att. +G D Att. Zielausw.", "2301180": "P Stat. Att. Geg. Werte↓ T {{value}}", "2301190": "Sonne Angriff↑ {{value}}", "2301200": "Elektrof. Sp. Ang.↑ {{value}}", "2301210": "P Att.+GA Zielausw.", "2301220": "P Ang. Att.+Ang. GA Zielausweitung", "2301230": "Gef. Terakristall. 5 Werte↑ {{value}}", "2401010": "Normal Abwehr", "2401020": "Feuer Abwehr", "2401030": "Wasser Abwehr", "2401040": "Elektro Abwehr", "2401050": "Pflanzen Abwehr", "2401060": "Eis Abwehr", "2401070": "Kampf Abwehr", "2401080": "Gift Abwehr", "2401090": "Boden Abwehr", "2401100": "Flug Abwehr", "2401110": "Psycho Abwehr", "2401120": "Käfer Abwehr", "2401130": "Gesteins Abwehr", "2401140": "Geister Abwehr", "2401150": "Drachen Abwehr", "2401160": "Unlicht Abwehr", "2401170": "Stahl Abwehr", "2401180": "Feen Abwehr", "2401200": "Drachen Abwehr T", "2401210": "Feuer Abwehr T", "2401220": "Wasser Abwehr T", "2401240": "Pflanzen Abwehr T", "2802050": "Boden Charisma", "2802060": "Psycho Charisma", "2802070": "Eis Charisma", "2802080": "Stahl Charisma", "2802090": "Pflanzen Charisma", "2802100": "Elektro Charisma", "2802110": "Normal Charisma", "2802120": "Käfer Charisma", "2804040": "Der Pokémon Bändiger von Hisui", "2804080": "Kanto Abenteurer der anderen Art", "2901010": "Eisen Mythos", "2901020": "Draco Mythos", "2901030": "Erd Mythos", "2901040": "Feuer Mythos", "2901050": "Furcht Mythos", "2901060": "Käfer Mythos", "2901070": "Wolken Mythos", "2901080": "Wasser Mythos", "2901090": "Stein Mythos", "2901100": "Hirn Mythos", "2901110": "Faust Mythos", "2902010": "Eisen Urteil", "2902020": "Draco Urteil", "2902030": "Erd Urteil", "2902040": "Feuer Urteil", "2902050": "Furcht Urteil", "2902060": "Käfer Urteil", "2902070": "Wolken Urteil", "2902080": "Wasser Urteil", "2902090": "Stein Urteil", "2902100": "Hirn Urteil", "2902110": "Faust Urteil", "3201150": "Der unauslöschliche Feuer Veteran", "3201270": "Sandwolken Selfie", "3201390": "Unfassbare Psycho Kräfte", "3201820": "Das Lächeln des Arkaden Stars", "3201870": "Ultra Begegnung", "3201920": "Faszination Fossil Pokémon", "3202120": "Wächterin des Obsidian Graslands", "3301050": "Erstantritt: Gef. Terakristall. (Pflanze)", "3301070": "Erstantritt: Gef. Terakristall. (Kampf)", "3301080": "Erstantritt: Gef. Terakristall. (Gift)", "3301130": "Erstantritt: Gef. Terakristall. (Gestein)", "3301150": "Erstantritt: Gef. Terakristall. (Drache)", "3301160": "Erstantr.: Gef. Terakristall. (Unlicht)", "3301190": "Erst GA: Gef. Terakristall. (Pflanze)", "3301200": "Erst GA: Gef. Terakristall. (Stellar)", "5130206": "Änderungsfr. P Att. GA Sch.↓ {{value}}", "5130207": "Problemfr. P Att. GA Schad.↓ {{value}}", "5130212": "Nachteilsf. P-Att. GA↓ {{value}}", "5170401": "K.O. Treffer Folgevollt.", "5210101": "Problemfr. Volltr. Schutz", "5230101": "Antritt Vert. × {{value}}", "5230102": "Antritt Sp. Vert. × {{value}}", "9901120": "Wasser Abwehr + Regen Heilung", "9901190": "Eleganter Unlicht Wandel", "9901200": "Stilvoller Wasser Wandel", "9901210": "Schweigsamer Wasser Wandel", "9901220": "Stoischer Unlicht Wandel", "9901390": "Fabrik Fachwissen", "9901470": "Pflanzen Forschungsergebnisse", "9901600": "Die Wucht des Top Champs", "9901610": "Das Strahlen des Top Champs", "9901640": "Das Können des Top Champs", "9901770": "Gepfeffertes Power Sandwich", "9901850": "Der Drachen Trainer mit dem Umhang", "9901870": "Mythen Archäologin", "9902310": "Mathematik Genie", "9902930": "Angriffs Software", "9902940": "Wiederherstellungs Software", "9902950": "Geister Rondo", "9902960": "Giftig musikalische Mischung", "9902980": "Datenspeicher Emulator", "9903000": "Erinnerungen an Gesteins Kämpfe", "9903150": "MaMo Rots Eifer", "9903170": "MaMo Silbers Fokus", "9903180": "MaMo Lyras Eifer", "9903210": "MaMo Cynthias Eifer (Aura)", "9903220": "MaMo Zyrus’ Hingabe", "9903290": "Glorias Fokus (Dojo Outfit)", "9903500": "Wunderknabe der Kanto Region", "9903610": "Feurig scharfe Appetitanreger", "9904010": "Terakristallisierungs Panzer", "9904070": "Hüterin der Mega Entwicklung" }, "es": { "1101010": "1.er Apuro Curat. {{value}}", "1101020": "Per. Curat. {{value}}", "1101030": "Fallo Riv. Curat. {{value}}", "1101040": "Cura Certera {{value}}", "1101050": "Debilitación Cura. Med. {{value}}", "1101060": "M-Compi Cura. Med. {{value}}", "1101070": "M-Compi Cura. Med. M {{value}}", "1101080": "Mov. Aliado Cura. Med. {{value}}", "1101090": "Posición Defensiva Curat. {{value}}", "1101100": "At. Curat. M {{value}}", "1101110": "Daño Curat. M {{value}}", "1101120": "Mov. Efi. Curat. {{value}}", "1101130": "Mov. Crít. Curat. {{value}}", "1101140": "Mov. Efi. Curat. M {{value}}", "1101150": "1.er Apuro Curat. Completo", "1101160": "Curación Cura. Med. {{value}}", "1101170": "Mov. Curat. Solar M {{value}}", "1101180": "Mov. Curat. Solar {{value}}", "1101190": "Z.Lucha Daño Curat. M {{value}}", "1101200": "Mov. Curat. {{value}}", "1101220": "Acierto Curat. {{value}}", "1101230": "Z.Lucha Daño Curat. {{value}}", "1101240": "Z.Siniestra Mov. Curat. M {{value}}", "1101250": "M-Dinamax Curat. {{value}}", "1101260": "1.ª Fatiga Curat. {{value}}", "1101270": "1.er M-Compi Cura. Med. M {{value}}", "1101290": "Daño Curat. {{value}}", "1101300": "Z.Lucha Curat. {{value}}", "1101310": "At. Riv. Conf. Curat. {{value}}", "1101320": "At. Riv. Probl.Est. Curat. M {{value}}", "1101330": "C.Hier. Mov. Curat. M {{value}}", "1101340": "1.ª PS 60% Curativos 4", "1101350": "At. Riv. Para. Curat. {{value}}", "1101360": "At. Cura Media {{value}}", "1101370": "Z.Normal Curat. {{value}}", "1101380": "1.ª Acc. Est. Curat. {{value}}", "1101390": "At. Curat. {{value}}", "1101400": "Ord. Cura Media {{value}}", "1101410": "Z.Veneno Curat. {{value}}", "1101420": "Z.Hielo Mov. Curat. M {{value}}", "1101430": "1.er M-Compi Cura. Med. {{value}}", "1101440": "Círculo Curat. {{value}}", "1101450": "At. Riv. Sab. Curat. {{value}}", "1101460": "At. Que. Apuro Cura Media {{value}}", "1101470": "At. Riv. Env. Cura {{value}}", "1101480": "Curación Cura {{value}}", "1101490": "Z.Voladora Curat. {{value}}", "1101500": "At. Riv. Par. Curat. M {{value}}", "1101520": "M-Dinamax Curat. M {{value}}", "1101530": "1.er Daño Movimiento Compi Curativo M {{value}}", "1101540": "At. Ali. Riv. Ata. Cura {{value}}", "1101550": "M-Compi Aliado Cura M {{value}}", "1101570": "Z.Normal Daño Cura M {{value}}", "1101580": "Z.Normal Daño M-Compi Cura {{value}}", "1101590": "Superdaño Fatiga Consume Baya y Cura {{value}}", "1101600": "M-Compi Aliado Cura {{value}}", "1101610": "Acc. Cura M {{value}}", "1101620": "Z.Hielo Cura {{value}}", "1101630": "Z.Dragón Cura {{value}}", "1201010": "Velocidad Pluvial {{value}}", "1201020": "Velocidad Solar {{value}}", "1201030": "Velocidad Aflicción {{value}}", "1201040": "Velocidad Arena {{value}}", "1201050": "Velocidad Granizo {{value}}", "1201060": "Velocidad C.Eléc. {{value}}", "1201070": "Velocidad C.Psí. {{value}}", "1201090": "Velocidad Z.Dragón {{value}}", "1201100": "Velocidad Z.Voladora {{value}}", "1201110": "Velocidad Climática {{value}}", "1201120": "Velocidad Z.Siniestra {{value}}", "1201130": "Velocidad Z.Acero {{value}}", "1201140": "Velocidad Z.Fantasma {{value}}", "1201150": "Velocidad Z.Bicho {{value}}", "1201160": "Velocidad C.Hier. {{value}}", "1201170": "Velocidad Z.Lucha {{value}}", "1201180": "Velocidad Z.Hada {{value}}", "1201190": "Velocidad Z.Veneno {{value}}", "1201200": "Velocidad Z.Roca {{value}}", "1201210": "Efecto B.Aliado Acelerador {{value}}", "1201220": "Velocidad Z.Normal {{value}}", "1201230": "Velocidad Z.Hielo {{value}}", "1201240": "Círculo Acelerador {{value}}", "1201250": "Cambio Entorno Acelerador {{value}}", "1202010": "Mov. Llena {{value}}", "1202020": "Vínculo Llenabarras {{value}}", "1202030": "Llenabarras 1.er Apuro {{value}}", "1202040": "Daño Llenabarras {{value}}", "1202050": "M-Compi Llenabarras M {{value}}", "1202060": "Mov. Llena M {{value}}", "1202080": "Debilitación Llenabarras {{value}}", "1202090": "Fallo Rival Llenabarras {{value}}", "1202100": "At. Llena {{value}}", "1202110": "Acc. Llena {{value}}", "1202120": "Mov. Crít. Llena {{value}}", "1202130": "Crít. Llenas {{value}}", "1202140": "Posición Defensiva Llenabarras {{value}}", "1202150": "Acc. Est. Llena {{value}}", "1202160": "Noqueo Llenabarras {{value}}", "1202170": "Fallo Llenabarras {{value}}", "1202180": "Golpe Umbrío Llena {{value}}", "1202190": "Acierto Llenas {{value}}", "1202200": "At. Riv. Conf. Llena ↑↑ {{value}}", "1202210": "At. Inesquivable Llena {{value}}", "1202220": "C.Psí. Mov. Llena {{value}}", "1202230": "At. Que. Llena ↑↑ {{value}}", "1202240": "Acierto Pluvial Llena {{value}}", "1202250": "At. Rel.Im. Riv. Llena ↑↑ {{value}}", "1202260": "At. Ali. Riv. Conf. Llena ↑↑ {{value}}", "1202270": "At. Ali. Riv. Conf. Llena {{value}}", "1202280": "At. Riv. Conf. Llena {{value}}", "1202290": "At. Riv. Env. Llena {{value}}", "1301010": "Ultravínculo {{value}}", "1301020": "Arena Imp. {{value}}", "1301030": "Osadía {{value}}", "1301040": "Ultraeficacia {{value}}", "1301050": "Condensador {{value}}", "1301060": "Crít. Imp. {{value}}", "1301070": "Combo Mejora {{value}}", "1301090": "Imp. Climático {{value}}", "1301100": "Potencia PS {{value}}", "1301110": "Sol Imp. {{value}}", "1301120": "Pará. Riv. Imp. {{value}}", "1301130": "Que. Riv. Imp. {{value}}", "1301140": "Granizo Imp. {{value}}", "1301150": "Cong. Riv. Imp. {{value}}", "1301160": "Lluvia Imp. {{value}}", "1301170": "Conf. Imp. {{value}}", "1301180": "Conf. Riv. Imp. {{value}}", "1301190": "A.Esp. Riv. ↓ Pot.", "1301200": "Potencia Intrépida {{value}}", "1301210": "Probl. Riv. Imp. {{value}}", "1301220": "Sabotaje Riv. Imp. {{value}}", "1301230": "Vel.↑ Pot.", "1301240": "Def.↑ Pot.", "1301250": "Ret. Riv. Imp. {{value}}", "1301260": "Sue. Riv. Imp. {{value}}", "1301270": "Ven. Riv. Imp. {{value}}", "1301280": "Ata. Riv. Imp. {{value}}", "1301300": "Pre. Riv. ↓ Pot.", "1301310": "D.Esp.↑ Pot.", "1301320": "Vel. Riv.↓ Pot.", "1301330": "Eva.↑ Pot.", "1301340": "Atq.↑ Pot.", "1301350": "Pre.↑ Pot.", "1301360": "PS ↓ Pot. {{value}}", "1301370": "C.Eléc. Imp. {{value}}", "1301380": "Def. Riv.↓ Pot.", "1301390": "D.Esp. Riv.↓ Pot.", "1301400": "Eva. Riv.↓ Pot.", "1301410": "Atq. Riv.↓ Pot.", "1301420": "Caract. Riv.↓ Pot.", "1301430": "Imp. Siniestro {{value}}", "1301440": "Imp. Hada {{value}}", "1301450": "Consumo Barra ↑ Potenciador {{value}}", "1301480": "Rel.Im. Riv. Imp. {{value}}", "1301490": "A.Esp.↑ Pot.", "1301500": "Entrada Robusta Sig.Efi.↑", "1301510": "Rel.Im. Imp. {{value}}", "1301520": "Potencia Veloz Solar {{value}}", "1301530": "Potencia Veloz Pluvial {{value}}", "1301540": "Robustez Imp. {{value}}", "1301550": "Vel.↓ Imp. {{value}}", "1301560": "Inm. Arena Imp. {{value}}", "1301570": "Caract.↑ Pot.", "1301580": "Cielo Despejado Imp. {{value}}", "1301590": "Acción Consumo Barra ↓ {{value}}", "1301600": "Cara de Hielo Efi. Imp. {{value}}", "1301610": "C.Psí. Imp. {{value}}", "1301620": "Z.Dragón Imp. {{value}}", "1301630": "Climatología Superimp. {{value}}", "1301640": "Mov. Efi. Superimp. {{value}}", "1301650": "Rel.Im. Riv. Superimp. {{value}}", "1301670": "Especiales Ri.v ↓ Potenciadoras", "1301680": "Z.Siniestra Imp. {{value}}", "1301690": "Z.Fantasma Imp. {{value}}", "1301700": "Conf. Riv. Superimp. {{value}}", "1301710": "Mov. Efi. Macroimp. {{value}}", "1301720": "Imp. Psíquico {{value}}", "1301730": "Caract. Riv. No↑ Imp. {{value}}", "1301740": "Vel. Riv. ↓ Imp. {{value}}", "1301750": "Pre. Riv. ↓ Imp. {{value}}", "1301760": "Z.Tierra Imp. {{value}}", "1301770": "Z.Acero Imp. {{value}}", "1301780": "C.D. Roca Riv. Imp. {{value}}", "1301790": "Mov. Secuela Imp. {{value}}", "1301800": "Z.Hada Imp. {{value}}", "1301810": "Z.Bicho Imp. {{value}}", "1301820": "Pará. Riv. Superimp. {{value}}", "1301830": "Atq. ↑ Imp. {{value}}", "1301840": "A.Esp. ↑ Imp. {{value}}", "1301850": "C.Hier. Imp. {{value}}", "1301860": "Que. Riv. Superimp. {{value}}", "1301870": "Z.Volador Imp. {{value}}", "1301880": "PS ↓ Impulsores {{value}}", "1301890": "C.Eléc. Imp. M {{value}}", "1301900": "C.Psí. Imp. M {{value}}", "1301910": "Ataduras Superimp. {{value}}", "1301940": "Vel. ↑ Imp. {{value}}", "1301950": "Def. ↑ Imp. {{value}}", "1301960": "D.Esp. ↑ Imp. {{value}}", "1301970": "Ata. Imp. M {{value}}", "1301980": "Granizo Superimp. {{value}}", "1301990": "C.D. Siniestro Riv. Imp. {{value}}", "1302010": "Reducción de Daño Físico {{value}}", "1302020": "Último Aliento {{value}}", "1302030": "Lluvia Mitigadora {{value}}", "1302040": "Secuela Leve {{value}}", "1302050": "Reducción de Daño Especial {{value}}", "1302060": "C.Eléc. Mitigador {{value}}", "1302070": "Robustez Mitigadora {{value}}", "1302080": "Robustez Aplacadora {{value}}", "1302090": "Mitiga Especial Apuro {{value}}", "1302100": "C.Psí. Mitigador {{value}}", "1302110": "Z.Voladora Mitigadora {{value}}", "1302120": "Arena Mitigadora {{value}}", "1302130": "Sol Mitigador {{value}}", "1302140": "C.Hier. Mitigador {{value}}", "1302150": "Guardia Aplacadora {{value}}", "1302160": "Z.Acero Mitigadora {{value}}", "1302170": "Z.Lucha Mitigadora {{value}}", "1302180": "Z.Hada Mitiga Especial M {{value}}", "1302190": "C.Hier. Mitiga Físico M {{value}}", "1302200": "Granizo Mit. {{value}}", "1302210": "Z.Siniestra Mitigadora {{value}}", "1302220": "Z.Bicho Mitigadora M {{value}}", "1302230": "Z.Dragón Mitigadora {{value}}", "1302240": "Círculo Mitigador {{value}}", "1302250": "Arena Mitiga Especial M {{value}}", "1302260": "Z.Hada Mitigadora M {{value}}", "1302270": "Z.Tierra Mitigadora {{value}}", "1302280": "Granizo Mitiga Físico M {{value}}", "1302290": "Z.Roca Mitiga Físico M {{value}}", "1302300": "Z.Roca Mitiga Especial M {{value}}", "1302310": "C.D. Siniestro Riv. Mitigador M {{value}}", "1302320": "Res. Riv. ↓ Mitigadora M {{value}}", "1302330": "Z.Hielo Mitiga Especial M {{value}}", "1302340": "Sol Mitiga Esp. M {{value}}", "1302350": "Ven. Riv. Aplacador M {{value}}", "1302360": "Daño Supereficaz Aplacador M {{value}}", "1302370": "Reducción de Daño Fís. M {{value}}", "1302380": "Efecto Bando Aliado Mitigador M {{value}}", "1302390": "C.Hier. Mitigador M {{value}}", "1302400": "Barra Acelerada Aplacadora M {{value}}", "1302410": "Daño Supereficaz Aplacador {{value}}", "1302420": "Sol EX Macromitigador Agua {{value}}", "1302430": "Lluvia EX Macromitigadora Fuego {{value}}", "1302440": "Barra Acelerada Mitigadora {{value}}", "1302450": "Sol Mitigador M {{value}}", "1302460": "Z.Hada Mitigadora {{value}}", "1306020": "Mov.: PM+1 {{value}}", "1306030": "At.: At. Rápidos PM+1 {{value}}", "1306040": "Acc.: PM+1 {{value}}", "1306050": "Crít.: PM+1 {{value}}", "1306060": "At. Riv. Que.: At. Rápidos PM+1 {{value}}", "1306070": "Superacción: PM+1 {{value}}", "1306080": "Mov.: PM Acción+1 {{value}}", "1306100": "At. Riv. Probl.Est.: PM+1 {{value}}", "1306110": "1.er M-Compi: PM M-Sincro+{{value}}", "1306120": "At. Rápido: PM Orden+1 {{value}}", "1306130": "1.ª Fatiga: PM+1 {{value}}", "1306140": "M-Compi: PM Baya+{{value}}", "1306150": "M-Compi Aliado: PM M-Sincro+1 {{value}}", "1306160": "M-Sincro: PM Orden+1 {{value}}", "1306170": "1.er M-Compi: PM Baya+{{value}}", "1306180": "1.er M-Compi: PM Acc. Est.+{{value}}", "1306190": "1.er C.Eléc.: PM M-Sincro+{{value}}", "1306200": "1.er At.: PM Acc. Est.+1 {{value}}", "1306210": "1.ª vez 0 PM Baya: PM Baya+{{value}}", "1306220": "At.: PM Baya+1 {{value}}", "1306230": "M-Compi: PM M-Sincro+{{value}}", "1306240": "Infortunio Recupera 32 PM M-Sincro", "1306250": "M-Compi Recupera 50 PM M-Sincro {{value}}", "1306260": "At. Recupera 32 PM M-Sincro {{value}}", "1306270": "Análisis de Teselia: PM M-Sincro+{{value}}", "1306280": "Daño: PM Baya+1 {{value}}", "1306290": "1.ª Acc. Est.: PM M-Sincro+{{value}}", "1306300": "1.ª vez 0 PM Análisis Kanto Recupera PM {{value}}", "1306320": "1.er M-Compi Recupera PM Supereficaz ↑ {{value}}", "1306330": "1.ª vez 0 PM Minipoción Múltiple Rec. PM {{value}}", "1307010": "Inm. Secuelas 9", "1307020": "Inm. Secuelas {{value}}", "1308010": "Z.Veneno Imp. {{value}}", "1308020": "C.Teselia (Fís) Imp {{value}}", "1308030": "Pará. Riv. Imp. M {{value}}", "1308040": "Cambio Entorno Imp. M {{value}}", "1308050": "Z.Roca Imp. {{value}}", "1308060": "Mov. Simple Imp. {{value}}", "1308070": "Granizo Impulsor M {{value}}", "1308080": "Arena Superimp. {{value}}", "1308090": "C.Passio (Def) Superimp. M {{value}}", "1308100": "Sol Impulsor M {{value}}", "1308110": "Vel. Aliada ↑ Imp. {{value}}", "1308120": "C.D. Siniestro Riv. Impulsor M {{value}}", "1308130": "Def. ↑ Superimp. {{value}}", "1308140": "Ven. Riv. Imp. M {{value}}", "1308150": "Sab. Riv. Imp. M {{value}}", "1308160": "Climaa Imp. M {{value}}", "1308170": "Caract. Riv. Sin Subir Imp. M {{value}}", "1308180": "C.Paldea (Def) Imp. M {{value}}", "1308190": "Probl. Riv. Imp. M {{value}}", "1308200": "C.Teselia (Def) Imp. M {{value}}", "1308210": "C.D. Veneno Riv. Imp. M {{value}}", "1308220": "Sue. Riv. Impulsor M {{value}}", "1308230": "Conf. Riv. Imp. M {{value}}", "1308240": "Que. Riv. Imp. M {{value}}", "1308250": "Z.Hada Imp. M {{value}}", "1308260": "Arena Imp. M {{value}}", "1308270": "Vel. Riv. ↓ Macroimp. M {{value}}", "1308280": "Sol Superimp. M {{value}}", "1308290": "Terremoto Imp. {{value}}", "1308300": "Caract. Riv. ↓ Imp. {{value}}", "1308310": "Sol Superimp. Tierra M {{value}}", "1308320": "Z. Hielo Imp. {{value}}", "1308330": "Probl. Riv. Potencia Infortunio ×2", "1308350": "Res. Riv. ↓ Superimp. {{value}}", "1308360": "Crítico Ali. Imp. {{value}}", "1308370": "Z.Dragón Imp. M {{value}}", "1308380": "Hiperrayo Imp. {{value}}", "1308390": "Vigor Compimp. {{value}}", "1308400": "Z.Lucha Imp. M {{value}}", "1308410": "A Bocajarro Imp. {{value}}", "1308420": "C.Teselia (Esp) Imp. M {{value}}", "1308430": "Z.Dragón Superimp. {{value}}", "1308450": "C.D. Roca Riv. Imp. M {{value}}", "1308470": "Z.Veneno Imp. M {{value}}", "1308480": "Campo Superimpulsor {{value}}", "1308490": "C.Johto (Def) Imp. M {{value}}", "1308500": "Caract. ↑ Pot. M", "1308510": "Z.Roca Superimp. {{value}}", "1308520": "Z.Tierra Superimp. {{value}}", "1308530": "1.er M-Compi Compimp. ×{{plus}}", "1308540": "Imp. Planta M {{value}}", "1308550": "Imp. Dragón M {{value}}", "1308560": "Z.Normal Imp. M {{value}}", "1308580": "Z.Normal Imp. {{value}}", "1308590": "Def. Riv. ↓ Imp. {{value}}", "1401020": "Acc. Riv. Dor. Impulsora", "1401030": "Acc. Imp. Esp. Fantasma", "1501010": "Entrada Furor {{value}}", "1501020": "Furor Mov. Crít. {{value}}", "1501030": "1.er M-Compi Furor {{value}}", "1501040": "Furor M Apuro {{value}}", "1501050": "Entrada Furor 1 vez {{value}}", "1501060": "Mov. Furor {{value}}", "1501070": "Furor por Daño {{value}}", "1501080": "Furor Apuro {{value}}", "1501090": "Furor por Fallo Rival {{value}}", "1501100": "Posición Defensiva Furor {{value}}", "1501110": "At. Rel.Im. Riv. Furor {{value}}", "1501120": "Acc. Furor {{value}}", "1501130": "Furor Efi. {{value}}", "1501140": "Furor Crít. {{value}}", "1501150": "Furor Solar {{value}}", "1501160": "Furor Pluvial {{value}}", "1501170": "M-Dinamax Furor {{value}}", "1501180": "ContraAtq. Furor {{value}}", "1501190": "Fatiga Furor {{value}}", "1501200": "1.ª Acc. Est. Furor {{value}}", "1501210": "Furor 1.er Apuro {{value}}", "1501220": "At. Guardia Furor {{value}}", "1501230": "At. Guardia Furor Doble {{value}}", "1501240": "1.er Mov. Furor {{value}}", "1501250": "Posición Defensiva Furor 1 vez {{value}}", "1501290": "PS 60% Furor 1 vez {{value}}", "1501300": "Ef. At. Rápido Furor Doble {{value}}", "1501310": "Efecto Ataque Rápido Furor {{value}}", "1501320": "Orden Furor {{value}}", "1501330": "1.ª vez 0 PM Baya Furor {{value}}", "1501340": "Acc. Est. Furor {{value}}", "1501350": "Voluntad Dragón Furor {{value}}", "1501360": "1.ª Orden Furor {{value}}", "1501370": "Voluntad Siniestra Furor {{value}}", "1501380": "Voluntad Voladora Furor {{value}}", "1501390": "1.er C.Eléc. Furor {{value}}", "1501400": "1.ª vez Activa C.Sinnoh (Esp) Furor {{value}}", "1501410": "Voluntad Tierra Furor {{value}}", "1501420": "1.ª vez 0 PM Acc. Est. Furor {{value}}", "1501430": "Voluntad Acero Furor {{value}}", "1501440": "1.ª Unidad de Paldea Furor {{value}}", "1501450": "1.ª Entrada y 1.er Mov. Compi Furor {{value}}", "1501460": "1.ª vez Sig.Fís. ↑ 6 o + Furor {{value}}", "1501470": "Voluntad Lucha Furor {{value}}", "1501480": "Teracristalización Furor {{value}}", "1501490": "Pasión de Teselia Furor {{value}}", "1501500": "Debilitación Furor {{value}}", "1501510": "Activa C.Kanto (Esp) Furor {{value}}", "1501520": "Furor Inicial {{value}}", "1501530": "1.ª Entrada Furor y A-Esp. ↑", "1501540": "1.ª Entrada Furor -2 y Crít. ↑", "1501550": "1.ª Entrada Furor -3 y Z.Normal", "1501570": "1.ª vez 0 PM Voluntad Fantasma Furor {{value}}", "1501580": "1.ª vez 0 PM Análisis de Kanto Furor {{value}}", "1501590": "Activa Círculo Furor {{value}}", "1501600": "Activa Z.Acero Furor {{value}}", "1502010": "Euforia {{value}}", "1601030": "M-Compi Efi. Imp. {{value}}", "1601040": "Sol Compimp. {{value}}", "1601050": "Velocidad ↑ Compipot.", "1601060": "Ataque ↑ Compipot.", "1601070": "Evasión ↑ Compipot.", "1601080": "M-Compi Crítico Imp. {{value}}", "1601090": "Granizo Compimp. {{value}}", "1601100": "Pará. Riv. Compimp. {{value}}", "1601110": "Conf. Riv. Compimp. {{value}}", "1601120": "Lluvia Compimp. {{value}}", "1601130": "Vel. Riv.↓ Compipot.", "1601140": "M-Compi Pedrisco", "1601150": "Atq. Riv.↓ Compipot.", "1601160": "D.Esp. Riv.↓ Compimpot.", "1601170": "Sue. Riv. Compimp. {{value}}", "1601180": "Arena Compimp. {{value}}", "1601190": "M-Compi Arenoso", "1601200": "Congelación Riv. Compimp. {{value}}", "1601210": "Ret. Riv. Compimp. {{value}}", "1601220": "Def. Riv.↓ Compipot.", "1601230": "C.Eléc. Compimp. {{value}}", "1601240": "Caract.↑ Compipot.", "1601250": "Pre. Riv.↓ Compipot.", "1601260": "Compimp. Apuro {{value}}", "1601270": "1.er M-Compi Cambio Tipo", "1601280": "A.Esp. Riv.↓ Compipot.", "1601290": "Que. Riv. Compimp. {{value}}", "1601300": "Rel.Im. Riv. Compimp. {{value}}", "1601310": "Climatología Compimp. {{value}}", "1601320": "Atq. Riv.↓ Compipotenciador {{value}}", "1601330": "A.Esp. ↑ Compimp. {{value}}", "1601340": "Cielo Despejado Compimp. {{value}}", "1601350": "Ven. Riv. Compimp. {{value}}", "1601360": "Eva. Riv.↓ Compipot.", "1601370": "Barra de M-Compipot.", "1601380": "Defensa ↑ Compipot.", "1601390": "Defensa Esp. ↑ Compipot.", "1601400": "Pará. Riv. Compimp. D {{value}}", "1601410": "Z.Dragón Compimp. {{value}}", "1601420": "Caract. Riv.↓ Compipot.", "1601430": "Z.Acero Compimp. {{value}}", "1601440": "Ataque Especial ↑ Compipot.", "1601450": "Sabotaje Riv. Compimp. {{value}}", "1601460": "M-Dinamax Efi. Imp. {{value}}", "1601470": "Pre. ↑ Compimp. {{value}}", "1601480": "Atq. ↑ Compimp. {{value}}", "1601490": "Def. ↑ Compimp. {{value}}", "1601500": "Ataduras Compimp. {{value}}", "1601510": "M-Compi Crítico", "1601520": "Pre. Riv. ↓ Compimp. {{value}}", "1601540": "Atq. ↑ Imp. D {{value}}", "1601550": "A.Esp. Riv. ↓ Compimp. {{value}}", "1601560": "Probl. Riv. Compimp. {{value}}", "1601570": "Cambiacampo Compimp. {{value}}", "1601580": "Vel. ↑ Compimp. {{value}}", "1601590": "D.Esp. ↑ Compimp. {{value}}", "1601600": "PS ↓ Compimp. {{value}}", "1601610": "Eva. ↑ Compimp. {{value}}", "1601620": "Vel. Riv. ↓ Compimp. {{value}}", "1601630": "Caract. Riv. Sin Subir Compimp. {{value}}", "1601640": "Z.Hada Compimp. {{value}}", "1601650": "C.D. Acero Riv. Compimp. {{value}}", "1601660": "Compimpulso M {{value}}", "1601670": "Res. Riv. ↓ Compimp. {{value}}", "1601680": "Z.Siniestra Compimp. {{value}}", "1601690": "C.Hier. Compimp. {{value}}", "1601700": "Z.Veneno Compimp. {{value}}", "1601710": "C.Teselia (Fís) Compimp. {{value}}", "1601720": "Probl.Est. Compimp. {{value}}", "1601730": "Círculo Compimp. M {{value}}", "1601740": "C.Johto (Fís) Compimp. {{value}}", "1601750": "Z.Roca Compimp. {{value}}", "1601760": "C.Teselia (Def) Compimp. {{value}}", "1601770": "Res. Rival ↓ Impulsora M {{value}}", "1601780": "Ven. Riv. Compimpulsor D {{value}}", "1601790": "C.Paldea (Fís) Compimp. {{value}}", "1601800": "C.Alola (Esp) Compimp. {{value}}", "1601810": "D.Esp. Riv. ↓ Compimpulsora {{value}}", "1601820": "Z.Voladora Compimpulsora {{value}}", "1601830": "Ata. Compimp. M {{value}}", "1601840": "Z.Normal Compimp. {{value}}", "1601850": "Granizo Compimp. M {{value}}", "1601860": "C.Paldea (Def) Compimp. M {{value}}", "1601870": "0 PM Baya Compimp. {{value}}", "1601880": "C.Teselia (Def) Compimp. M {{value}}", "1601890": "C.Psí. Compimp. {{value}}", "1601900": "A.Esp. ↑ Imp. D {{value}}", "1601910": "Rel.Im. Riv. Compimp. M {{value}}", "1601920": "Rel.Im. Riv. Imp. M {{value}}", "1601930": "Z.Tierra Compimp. {{value}}", "1601940": "C.D. Veneno Riv. Compimp. M {{value}}", "1601950": "Caract. Riv. ↓ Compimp. {{value}}", "1601960": "Z.Hielo Compimp. {{value}}", "1601970": "C.Sinnoh (Esp) Compimp. M {{value}}", "1601980": "Z.Normal Compimpulsora M {{value}}", "1601990": "Lluvia Compimp. M {{value}}", "1602010": "1.er M-Compi: PM+{{value}}", "1602020": "M-Compi: PM At. Rápidos+{{value}}", "1602030": "1.er M-Compi: PM Curación+{{value}}", "1602040": "M-Compi: PM Acción+1 {{value}}", "1602050": "1.er M-Compi: PM Acción+1 {{value}}", "1602060": "1.er M-Compi: PM Orden+{{value}}", "1602070": "1.er M-Compi: PM At. Rápidos+{{value}}", "1602080": "1.er Apuro: PM At. Rápidos+1 {{value}}", "1602090": "M-Compi: PM Orden+1 {{value}}", "1602100": "M-Dinamax Recupera PM M-Sincro {{value}}", "1602110": "M-Dinamax Recupera PM Acc. Est. {{value}}", "1602120": "1.er Mov. Recupera PM {{value}}", "1602130": "M-Compi Aliado PM Vastaguardia {{value}}", "1602140": "1.ª Acc. Est. Recupera PM Búnker {{value}}", "1602150": "M-Dinamax Recupera PM Supereficaz ↑ {{value}}", "1603010": "Lluvia Imp. D {{value}}", "1603020": "Barra Acelerada Compimp. M {{value}}", "1603030": "Barra Acelerada Compimp. {{value}}", "1603040": "Z.Bicho Compimp. M {{value}}", "1603050": "Círculo Compimp. {{value}}", "1603060": "Vel. Aliada ↑ Compimp. {{value}}", "1603070": "Cambio Entorno Compimp. M {{value}}", "1603080": "Z.Lucha Compimp. {{value}}", "1603090": "Sol Maximpulsor {{value}}", "1603100": "C.D. Roca Riv. Compimp. M {{value}}", "1603110": "Campo Compimp. {{value}}", "1603120": "Z.Lucha Compimp. M {{value}}", "1603130": "C.Johto (Esp) Compimp. M {{value}}", "1603140": "Res. Riv. ↓ Compimp. M {{value}}", "1603150": "C.Hierba Imp. D {{value}}", "1603160": "Z.Siniestra Compimp. M {{value}}", "1603180": "C.Paldea (Físico) Imp. M {{value}}", "1701010": "Inm. Veneno", "1701020": "Inm. Quemaduras", "1701030": "Inm. Parálisis", "1701040": "Inm. Congelación", "1701050": "Inm. Granizo", "1701060": "Inm. Sueño", "1701070": "Inm. Confusión", "1701080": "Inm. Retroceso", "1701090": "Inm. Ataduras", "1701100": "Inm. Probl.Est. Solar", "1701110": "Inm. Sueño M", "1701120": "Inm. Sabotaje", "1701130": "Inm. Sabotaje Pluvial", "1701140": "Inm. Golpes Fulminantes", "1701150": "Inm. Sabotaje Solar", "1701160": "Inm. Sabotaje Cielo Despejado", "1701170": "Inm. Probl.Est.", "1701180": "Inm. Probl.Est. C.Psí.", "1701190": "Inm. Probl.Est. C.Hier.", "1701200": "Inm. Sabotaje C.Eléc.", "1701210": "Inm. Probl.Est. C.Eléc.", "1701220": "Inm. Retroceso M", "1701230": "Inm. Estados Negativos Solar M", "1701240": "Inm. Veneno M", "1701250": "Inm. Probl.Est. Pluvial", "1701260": "Z.Siniestra Inm. Sabotaje", "1701270": "Inm. Probl.Est. Z.Roca", "1701280": "Inm. Sabotaje C.Hier.", "1701290": "Inm. Probl.Est. Z.Hada M", "1701300": "Inm. Probl.Est. Granizo", "1701320": "Inm. Estados Negativos C.Psí. M", "1701340": "Inm. Sabotaje Z.Dragón", "1701350": "Inm. Estados Negativos", "1701360": "Inm. Probl.Est. Z.Hielo M", "1701370": "Inm. Est. Neg. Z.Acero M", "1701380": "Inm. Estados Negativos Z.Tierra M", "1701390": "Inm. Granizo M", "1701400": "Inm. Probl.Est. Círculo", "1701410": "Inm. Arena M", "1701420": "Inm. Estados Negativos C.Hier. M", "1701430": "Inm. Sueño y Retroceso M", "1701440": "Inm. Sabotaje Granizo", "1701450": "Inm. Probl. Estado Z.Veneno M", "1701460": "Inm. Est. Neg. C.D. Veneno Riv. M", "1701470": "Inm. Estados Negativos Círculo M", "1701480": "Barra Acelerada Inm. Est. Negativos M", "1701490": "Inm. Probl. Est. Z.Bicho", "1701500": "Inm. Que. M", "1701510": "Inm. Est. Negativos Z.Hada M", "1702010": "Resistencia Veneno {{value}}", "1702020": "Resistencia Parálisis {{value}}", "1702030": "Resistencia Sueño {{value}}", "1702040": "Resistencia Quemaduras {{value}}", "1702050": "Resistencia Congelación {{value}}", "1702060": "Resistencia Confusión {{value}}", "1702070": "Resistencia Retroceso {{value}}", "1702080": "Resistencia Ataduras {{value}}", "1703020": "Acc. Cura Probl. M {{value}}", "1703040": "Debilitación Cura Probl.", "1703060": "M-Compi Cura Probl.", "1703070": "Mov. Cura Probl. M", "1703080": "Acc. Cura Probl. {{value}}", "1703090": "Mov. Aliado Cura Probl. {{value}}", "1703100": "M-Compi Cura Probl. M {{value}}", "1703110": "M-Dinamax Cura Probl. M {{value}}", "1703120": "Mov. Aliado Antisabotaje {{value}}", "1703130": "Mov. Cura Probl. {{value}}", "1703150": "Mov. Antisabotaje {{value}}", "1703160": "M-Compi Quita Efectos Negativos M {{value}}", "1703170": "Ord. Cura Probl. M {{value}}", "1704010": "Inm. Estados Negativos", "1704030": "Remedio Gélido {{value}}", "1704040": "Doble Aguante {{value}}", "1704050": "Sol Curat. {{value}}", "1704060": "Mov. Protector {{value}}", "1704070": "Mov. Desorientador {{value}}", "1704080": "Señuelo Apuro", "1704090": "Arena Curat. {{value}}", "1704100": "Mov. Envenenador {{value}}", "1704110": "Virulencia M {{value}}", "1704130": "At. Ret. {{value}}", "1704140": "M-Compi Sig.Crít.", "1704150": "Lluvia Curat. {{value}}", "1704170": "M-Compi Soporífero", "1704190": "Mov. Cong. {{value}}", "1704210": "1.er M-Compi Protector M", "1704220": "Mov. Env.G {{value}}", "1704230": "Mov. Soporífero {{value}}", "1704240": "Mov. Crít. Conf. {{value}}", "1704250": "Mov. Sig.Crít. {{value}}", "1704260": "Mov. Regenerativo {{value}}", "1704280": "C.Eléc. Curat. {{value}}", "1704290": "C.Psí. Curat. {{value}}", "1704300": "Mov. Regen. M", "1704310": "Entrada Sig. 0 Coste", "1704320": "M-Compi Sig. 0 Coste", "1704330": "M-Compi Regenerativo M", "1704340": "1.er M-Compi Protector", "1704350": "Mov. Sig.Efi.↑ {{value}}", "1704360": "At. Rel.Im. Sig. 0 Coste {{value}}", "1704370": "Entrada Sig.Efi.↑", "1704380": "Rel.Im. Curat. {{value}}", "1704390": "Crít. Sig. 0 Coste {{value}}", "1704410": "Acc. Sig. 0 Coste {{value}}", "1704420": "Acc. Est. Sig.Efi.↑ {{value}}", "1704430": "Acc. Solar Sig.Efi.↑ {{value}}", "1704440": "Acc. Pluvial Sig.Efi.↑ {{value}}", "1704450": "M-Dinamax Sig. Mitiga Daño", "1704460": "Daño Sig. 0 Coste {{value}}", "1704470": "M-Dinamax Regenerativo", "1704480": "At. Sig. 0 Coste {{value}}", "1704490": "Sig.Efi.↑ 1.er Apuro", "1704510": "1.er M-Compi Sig.Efi.↑", "1704520": "Fallo Sig.Fís.↑ {{value}}", "1704530": "M-Dinamax Sig.Efi.↑", "1704540": "M-Compi Rel.Im.", "1704550": "M-Compi Regenerativo", "1704560": "Ord. Sig.Fís. ↑+1 {{value}}", "1704570": "At. Probl.Est. M {{value}}", "1704580": "Noqueo Sig.Efi.↑", "1704600": "Mov. Efi. Sig. 0 Coste {{value}}", "1704610": "Golpe Umbrío Sig.Efi.↑", "1704620": "Ord. Sig.Esp. ↑+1 M {{value}}", "1704630": "Ord. Sig. 0 Coste {{value}}", "1704640": "Mov. Efi. Sig.Efi.↑ {{value}}", "1704650": "Mov. Sig. 0 Coste {{value}}", "1704660": "M-Compi Sig.Fís. ↑+1 {{value}}", "1704670": "M-Compi Soporífero M", "1704680": "Fatiga Acc. Est. Sig.Esp. ↑+1 M {{value}}", "1704690": "1.er M-Compi Sig. Mitiga Daño", "1704700": "Z.Fantasma Curat. {{value}}", "1704710": "Ord. Sig.Efi.↑ {{value}}", "1704720": "1.er M-Compi Sig. 0 Coste M", "1704730": "1.ª Entrada Sig. Físico Especial ↑ {{value}}", "1704740": "At. Conf. {{value}}", "1704750": "Acc. Est. Sig.Fís.Esp. ↑+1 M {{value}}", "1704760": "At. Sig. 0 Coste C.Psí. {{value}}", "1704770": "Fatiga Sig. 0 Coste 1 vez M {{value}}", "1704780": "M-Dinamax Sig.Esp. ↑+1 M {{value}}", "1704790": "Acc. Est. Sig.Fís. ↑+1 {{value}}", "1704800": "Daño Parálisis Rival {{value}}", "1704810": "Ataque Saboteador {{value}}", "1704820": "Crít. Sgte. Crít. {{value}}", "1704830": "Z.Bicho Curat. {{value}}", "1704840": "Curación Sig.Fís.Esp. ↑+1 1 vez M {{value}}", "1704850": "M-Compi Sig.Efi.↑ {{value}}", "1704860": "M-Compi Sig.Esp. ↑+1 {{value}}", "1704870": "Mov. Sig.Esp. ↑+1 {{value}}", "1704880": "Mov. Aliado Sig.Fís. ↑+1 {{value}}", "1704890": "C.Hier. Curat. {{value}}", "1704900": "M-Compi Sig.Esp. ↑+1 1 vez M {{value}}", "1704910": "Mov. PM Sig.Esp. ↑+1 M {{value}}", "1704920": "Mov. Sig.Fís.Esp. ↑+1 {{value}}", "1704930": "Entrada Siguiente Especial ↑ M {{value}}", "1704940": "Sig.Esp. ↑ en 1.er Apuro {{value}}", "1704960": "Daño Quemaduras Rival {{value}}", "1704970": "At. Pará. {{value}}", "1704980": "Mov. Sig.Esp. ↑+1 M {{value}}", "1705010": "Daño Quemaduras Rival ↑ {{value}}", "1705020": "Ataduras Dañinas {{value}}", "1705030": "Veneno Dañino {{value}}", "1705040": "Prob. Autolesión Rival ↑ {{value}}", "1705050": "Inm. Estados Negativos Duradera {{value}}", "1705060": "Prob. No Atacar Riv. Para. ↑ {{value}}", "1706010": "At. Eléctrico Pará. {{value}}", "1706020": "At. Hielo Con. {{value}}", "1706030": "Mov. Sig.Fís. ↑+2 {{value}}", "1706040": "Sig.Fís. ↑ 1.er Apuro {{value}}", "1706050": "Ord. Sig.Fís.Esp. ↑ x1 {{value}}", "1706060": "Guardia Sig.Fís. ↑ x1 {{value}}", "1706070": "Acc. Est. Sig. 0 Coste {{value}}", "1706080": "Z.Acero Curat. {{value}}", "1706090": "Z.Siniestra Curat. {{value}}", "1706100": "M-Compi Sig.Fís. ↑+1 1 vez M {{value}}", "1706120": "At. Quemaduras {{value}}", "1706130": "Mov. Aliado Sig.Esp. ↑+1 {{value}}", "1706140": "At. Riv. Env. Sig. 0 Coste {{value}}", "1706150": "Acc. Est. Sig.Fís.Esp. ↑+1 {{value}}", "1706160": "Z.Roca Curat. {{value}}", "1706170": "At. Ataduras {{value}}", "1706180": "Pos. Defen. Sig.Fís. ↑+1 1 vez M {{value}}", "1706190": "Caract. ↓ Sig. 0 Coste {{value}}", "1706200": "Daño Aplica Env. Para. o Dor. {{value}}", "1706210": "At. Riv. Que. Sig.Esp. ↑+1{{value}}", "1706220": "Fallo Riv. Sig.Fís.Esp. ↑+1 {{value}}", "1706230": "M-Compi Envenenador Grave M {{value}}", "1706240": "At. Riv. Env. Sig.Efi.↑ {{value}}", "1706250": "Maxiacción Sig.Fís. ↑+1 M {{value}}", "1706260": "1.er At. Res. Tierra ↓", "1706280": "1.er M-Compi Sig.Efi.↑ M", "1706290": "1.er At. Res. Acero ↓", "1706310": "1.er At. Res. Tipo Débil ↓", "1706320": "Ord. Inm. Est. Negativos 1 vez M {{value}}", "1706330": "1.ª Ord. Res. Siniestro ↓ M", "1706340": "At. Riv Caract. Sin Subir Sig. 0 Coste {{value}}", "1706390": "At. Riv Caract. Sin Subir Ret. {{value}}", "1706400": "At. Riv. Para. Sig. 0 Coste {{value}}", "1706410": "1.ª Acc. Est. Res. Dragón ↓", "1706420": "At. Inesquivable Ret. {{value}}", "1706430": "Mov. Sig.Fís. ↑+1 M {{value}}", "1706440": "At. Sig.Fís. ↑+1 C.Psí. {{value}}", "1706450": "M-Dinamax Res. Veneno ↓ M {{value}}", "1706470": "Mov. Sig.Fís. ↑+1 {{value}}", "1706490": "Mov. Sig.Fís. ↑+3 {{value}}", "1706500": "Acc. Est. Sig.Fís. ↑+2 {{value}}", "1706510": "At. Riv. C.D. Acero Sig. 0 Coste {{value}}", "1706520": "At. Det. Sig.Fís. ↑+3 {{value}}", "1706530": "M-Dinamax Sig. 0 Coste", "1706540": "Acc. Est. Sig.Fís. ↑+1 M {{value}}", "1706550": "Efecto At. Rápido Sig.Fís. ↑+1 {{value}}", "1706560": "At. Riv. Que. Sig.Efi. ↑ {{value}}", "1706570": "M-Compi Sig.Fís. ↑+2 {{value}}", "1706580": "Fallo Riv. Sig.Fís. ↑+2 {{value}}", "1706590": "Daño Sig.Efi. ↑ {{value}}", "1706600": "M-Compi Sig. 0 Coste M {{value}}", "1706610": "At. Cambiaestado M {{value}}", "1706620": "Daño Ven. Riv. {{value}}", "1706630": "At. Riv. Con. Sig.Esp. ↑+1 {{value}}", "1706640": "Mov. Sig.Esp. ↑+2 {{value}}", "1706650": "M-Dinamax Sig. 0 Coste M", "1706660": "At. Monosabotaje {{value}}", "1706670": "1.er At. Res. Hada ↓", "1706680": "M-Compi Sig.Esp. ↑+2 1 vez M {{value}}", "1706690": "At. Rel.Im. Riv. Sig. 0 Coste {{value}}", "1706700": "At. Rel.Im. Riv. Sig.Efi.↑ {{value}}", "1706710": "At. Riv. C.D. Siniestro Sig. 0 Coste {{value}}", "1706720": "At. Riv. Para. Sig.Esp. ↑+1 {{value}}", "1706730": "M-Compi Sig.Fís. ↑+2 M {{value}}", "1706740": "1.er M-Compi Res. Hada ↓", "1706760": "At. Riv. Env. Sig.Esp. ↑+1 {{value}}", "1706770": "Cambiaentorno Sig.Esp. ↑+1 {{value}}", "1706780": "At. Riv. Probl.Est. Sig. 0 Coste {{value}}", "1706790": "Maxiacción Sig.Esp. ↑+2 {{value}}", "1706800": "M-Compi Determinación ↑ {{value}}", "1706810": "Ord. Sig. 0 Coste M {{value}}", "1706820": "Noqueo Sig.Esp. ↑+2 {{value}}", "1706830": "Caract. ↓ Sig.Fís. ↑+1 {{value}}", "1706840": "Ord. Sig.Fís. Esp. ↑+1 1 vez M {{value}}", "1706850": "1.ª Entrada Res. Planta ↑ {{value}}", "1706860": "M-Compi Pará.", "1706870": "Ord. Sig.Esp. ↑+1 {{value}}", "1706880": "At. Sig. 0 Coste o Sig.Esp. ↑+1", "1706890": "M-Dinamax Res. Mismo Tipo ↓ M {{value}}", "1706900": "At. Sig.Fís. ↑+1 {{value}}", "1706910": "1.er M-Compi Sig.Esp. ↑ M+{{value}}", "1706920": "Cambiaentorno Sig.Fís. ↑+1 {{value}}", "1706930": "At. Que. Sig.Fís. ↑+1 {{value}}", "1706940": "At. Riv. Sab. Sig.Efi. ↑ {{value}}", "1706950": "At. Sig.Esp. ↑+1 {{value}}", "1706960": "Acierto Sig.Fís. ↑+1 {{value}}", "1706970": "At. Sig.Fís. ↑+1 Arena {{value}}", "1706980": "Entrada Sig.Fís. ↑+{{value}}", "1706990": "M-Dinamax Sig.Fís.Esp. ↑ M+{{value}}", "1707010": "At. Efecto Bando Aliado Sig. 0 Coste {{value}}", "1707020": "At. Riv. Res. ↓ Sig. 0 Coste {{value}}", "1707030": "Acierto Retroceso {{value}}", "1707040": "Mov. Aliado Sig.Fís.Esp. ↑+1 {{value}}", "1707050": "M-Compi Sig.Fís.Esp. ↑+2 {{value}}", "1707060": "Ef. Bando Aliado o Ambos Sig. 0 Coste {{value}}", "1707070": "M-Dinamax Sig.Esp. ↑+{{value}}", "1707090": "M-Compi Sig.Fís.Esp. ↑+1 {{value}}", "1707100": "M-Dinamax Físico Sig.Fís. ↑+{{value}}", "1707110": "M-Dinamax Especial Sig.Esp. ↑+{{value}}", "1707120": "At. Círculo Sig.Fís. ↑+1 {{value}}", "1707130": "1.ª Entrada Sig.Fís. ↑ M+{{value}}", "1707140": "At. Riv. Caract. Sin Subir Sig.Fís. ↑+1 {{value}}", "1707150": "At. Veneno Env. {{value}}", "1707160": "Ef. Bando Aliado o Ambos Sig.Esp. ↑+1 {{value}}", "1707170": "Acc. Est. Sig.Esp. ↑+1 {{value}}", "1707180": "1.ª Entrada Sig.Fís. ↑+{{value}}", "1707190": "1.ª Entrada Sig.Esp. ↑+{{value}}", "1707200": "M-Compi Sig.Esp. ↑+2 {{value}}", "1707230": "Acc. Sig.Fís. ↑+1 {{value}}", "1707240": "1.er M-Compi Sig. Fís. ↑ M {{value}}", "1707250": "Guardia Sig.Esp. ↑+2 {{value}}", "1707260": "Círculo Aliado Sig. Esp. ↑+1 {{value}}", "1707270": "Guardia Sig. Esp. ↑+1 {{value}}", "1707280": "Debilitación Aliado Sig.Fís. ↑+{{value}}", "1707290": "1.er M-Compi Res. Dragón ↓ {{value}}", "1707300": "At. Ret. Par. {{value}}", "1707310": "At. PM Baya ↓ Sig.Esp. ↑+3 {{value}}", "1707320": "At. Círculo Sig. 0 Coste {{value}}", "1707330": "Mov. Compi↑+4 {{value}}", "1707340": "Car. ↓ Sig.Fís. ↑+2 {{value}}", "1707350": "Mov. Compi↑+3 {{value}}", "1707360": "M-Compi Compi↑+5 {{value}}", "1707370": "Ord. Sig.Fís. ↑+1 M {{value}}", "1707380": "Activa Círculo Sig.Fís↑+1 Mov.Esp.↑+1 M {{value}}", "1707390": "Efecto At. Rápido Sig.Fís. ↑+1 M {{value}}", "1707400": "Entrada Sig.Esp. ↑+{{value}}", "1707410": "Entrada Compi↑+{{value}}", "1707420": "1.er At. Res. Planta ↓", "1707430": "1.er Mov. Compi Sig.Fís. ↑+{{value}}", "1707440": "Mov. Est. Sig.Fís.Esp. ↑+1 M {{value}}", "1707450": "1.ª vez 0 PM Baya Sig.Esp. ↑+{{value}}", "1707460": "1.er At. Res. Veneno ↓", "1707470": "Mov. M-Dinamax Sig.Fís. ↑+{{value}}", "1707480": "Ord. Compi↑+1 M {{value}}", "1707490": "Imp. Siniestro M {{value}}", "1707500": "Imp. Volador M {{value}}", "1707510": "1.ª Acc. Sig.Esp. ↑+{{value}}", "1707520": "At. Compi↑+1 {{value}}", "1707530": "M-Dinamax Saboteador M {{value}}", "1707540": "Mov. Est. Saboteador M {{value}}", "1707550": "M-Dinamax Parálisis M {{value}}", "1707560": "Mov. Aliado Compi↑+2 {{value}}", "1707570": "Círculo Aliado Sig.Fís.Esp. ↑+1 M {{value}}", "1707580": "Maxiacción Sig.Fís. ↑+2 {{value}}", "1707590": "M-Dinamax Compi↑ M+{{value}}", "1707600": "Mov. Siguiente Mitiga Daño {{value}}", "1707610": "At. PM Baya ↓ y Sig.Fís. ↑+1 M {{value}}", "1707620": "Fallo Riv. Sig.Fís.Esp. ↑+1 M {{value}}", "1707630": "At. Sig. 0 Coste Z.Acero {{value}}", "1707640": "Imp. Eléctrico M {{value}}", "1707650": "Acierto Sig.Esp.↑+1 {{value}}", "1707660": "Acierto M-Compi↑+1 {{value}}", "1707670": "Activa Z.Voladora Sig.Esp.↑+1 M {{value}}", "1707680": "Ord. Sig.Fís. ↑+3 {{value}}", "1707690": "Aliado Activa Clima Sig.Esp. ↑+2 {{value}}", "1707700": "M-Dinamax Compi↑+{{value}}", "1707720": "Ord. Sig.Fís.Esp. ↑+1 M {{value}}", "1707730": "Fatiga Sig.Fís.Esp. ↑+2 1 vez M {{value}}", "1707740": "Aura Psíquica Sig.Esp. ↑+1 M {{value}}", "1707750": "Daño Sig.Esp. ↑+1 {{value}}", "1707760": "M-Dinamax Res. Mismo Tipo ↓ {{value}}", "1707770": "At. Riv. C.D. Fuego Sig.Esp.↑+1 {{value}}", "1707780": "At. Compi↑+2 {{value}}", "1707790": "M-Dinamax Que. {{value}}", "1707800": "At. Sig. 0 Coste Pluvial {{value}}", "1707810": "At. Sig. 0 Coste C.Hier. {{value}}", "1707820": "Siguiente Mitiga Daño 1 vez en Apuro {{value}}", "1707830": "M-Dinamax Sig.Fís.↑ M+{{value}}", "1707840": "At. Sig. 0 Coste Solar {{value}}", "1707850": "Mov. Aliado Compi↑+4 {{value}}", "1707860": "Mov. Compi↑+1 M {{value}}", "1707870": "1.er M-Compi Sig.Esp. ↑+{{value}}", "1707880": "0 PM M-Sincro Mov. No Sincro Sig.Esp. ↑+1 {{value}}", "1707890": "Mov. Aliado Sig.Efi.↑ {{value}}", "1707900": "At. Sig. 0 Z.Tierra {{value}}", "1707910": "Mov. Sig.Esp. ↑+2 M {{value}}", "1707920": "Mov. Sig.Fís. ↑+2 M {{value}}", "1707930": "Z.Tierra Curat. {{value}}", "1707940": "Voluntad Tierra Sig.Fís. ↑+2 {{value}}", "1707950": "Acierto Pluvial Compi↑+1 {{value}}", "1707960": "Daño Sig.Fís. ↑+1 M {{value}}", "1707970": "Daño Sig.Esp. ↑+1 M {{value}}", "1707980": "Imp. Roca M {{value}}", "1707990": "Imp. Hielo M {{value}}", "1708010": "1.ª vez 0 PM Acc. Est. Sig.Fís.↑ {{value}}", "1708020": "Activa Sol Sig. 0 Coste {{value}}", "1708030": "At. Sig.Esp. ↑+1 C.Eléc. {{value}}", "1708040": "Mov. Sig.Efi. ↑ M {{value}}", "1708050": "At. 0 PM Ord. Sig. 0 Coste {{value}}", "1708060": "At. 0 PM Ord. Sig.Esp. ↑+2 {{value}}", "1708070": "At. Aliado Riv. Que. Sig. Esp. ↑ Simple {{value}}", "1708080": "1.ª vez 0 PM Baya Sig.Fís. ↑ M {{value}}", "1708090": "At. Riv. Que. Sig. 0 Coste {{value}}", "1708100": "M-Compi Sig.Esp. ↑+1 M {{value}}", "1708110": "Voluntad Acero Sig.Esp. ↑+2 {{value}}", "1708120": "1.ª Entrada Sig.Esp. ↑ M+{{value}}", "1708130": "Daño M-Compi Sig.Fís. ↑+2 {{value}}", "1708140": "At. Riv. Campo Daño Fuego Sig. 0 Coste {{value}}", "1708150": "Daño Compi↑+1 M {{value}}", "1708160": "At. Sig.Esp. ↑+2 Pluvial {{value}}", "1708170": "Cambiaentorno Sig.Esp. ↑+1 M {{value}}", "1708180": "Imp. Normal M {{value}}", "1708190": "Imp. Lucha M {{value}}", "1708200": "Imp. Fuego M {{value}}", "1708220": "Acierto Sig.Fís.Esp. ↑+1 {{value}}", "1708230": "1.ª vez Sig.Esp. ↑ 6 o + Sig.Esp. ↑+{{value}}", "1708250": "Aliado Activa Z.Bicho Sig.Esp. ↑+1 {{value}}", "1708260": "M-Compi Sig.Esp. ↑+2 M {{value}}", "1708270": "Mov. Sig. 0 Coste M {{value}}", "1708280": "1.er Mov. Sig.Esp. ↑ M {{value}}", "1708290": "1.er At. Res. Normal ↓", "1708300": "Mov. Sig.Fís.Esp. ↑+2 {{value}}", "1708310": "1.er M-Compi Determinación ↑ {{value}}", "1708320": "Círculo Ali. Sig.Fís. ↑+2 {{value}}", "1708330": "Círculo Ali. M-Compi ↑+3 {{value}}", "1708340": "Caract. Ali. ↑ Mov. Compi ↑+1 {{value}}", "1708350": "Daño M-Compi Sig.Fís.Esp. ↑+1 M {{value}}", "1708360": "At. Ali. Retr. Riv. Sig.Fís.Esp. ↑+1 {{value}}", "1708370": "Daño Ata. Riv. {{value}}", "1708380": "1.ª Acc. Est. Sig. Mitiga Daño", "1708390": "Solo 1 Riv. At. Sig.Fís.Esp. ↑+1 {{value}}", "1708400": "Solo 1 Riv. At. Sig. 0 Coste {{value}}", "1708410": "1.ª Entrada y 1.er M-Compi Sig.Esp. ↑ +{{value}}", "1708420": "Acc. M-Compi ↑+2 {{value}}", "1708430": "Acc. Est. Sig.Esp. ↑+2 {{value}}", "1708440": "At. Aliado Sig.Esp. ↑+1 Solar {{value}}", "1708450": "At. Ali. Retr. Riv. M-Compi ↑+2 {{value}}", "1708460": "Z.Hada Cura {{value}}", "1708470": "Solo 1 Riv. At. Sig.Esp. ↑+1 {{value}}", "1708480": "Círculo Ali. Sig.Fís. ↑+1 M {{value}}", "1708490": "Círculo Ali. Sig. 0 Coste {{value}}", "1708500": "Cambiaentorno Sig.Fís.Esp. ↑+1 M {{value}}", "1708510": "M-Compi Aliado Sig.Fís.Esp. ↑+1 M {{value}}", "1708520": "Imp. Fantasma M {{value}}", "1708530": "Imp. Veneno M {{value}}", "1708540": "Imp. Agua M {{value}}", "1708550": "M-Compi Sig.Fís.Esp. ↑+1 M {{value}}", "1708560": "1.ª Entrada M-Compi ↑+{{value}}", "1708570": "1.ª Acc. Est. Sig.Esp. ↑ M {{value}}", "1708580": "Mov. Efecto Absorbe Daño Sig. Mov. a Todos {{value}}", "1708590": "1.er Mov. Compi Siguiente Fís. Esp. ↑ M {{value}}", "1708600": "M-Compi Sig.Fís. ↑+3 {{value}}", "1708610": "At. Aliado Riv. Probl. Est. Sig.Fís.Esp. ↑+1 {{value}}", "1708620": "At. Aliado Riv. Probl. Est. Compi↑+2 {{value}}", "1708630": "1.ª Entrada Res. Fantasma ↓ M {{value}}", "1708640": "1.ª Ord. Compi↑+10", "1708650": "At. Z.Fantasma Saboteador {{value}}", "1708660": "At. Riv. Sab. Sig. 0 Coste {{value}}", "1708670": "At. Riv. Sab. Sig.Fís.Esp. ↑+1 {{value}}", "1708680": "1.er M-Compi Res. Fantasma ↓ M {{value}}", "1708700": "Acción M-Compi ↑+1 M {{value}}", "1708710": "M-Dinamax Sig.Fís.Esp. ↑+{{value}}", "1708720": "1.ª Entrada Sig.Fís.Esp. ↑+ M {{value}}", "1708730": "1.ª Entrada M-Compi ↑+ M {{value}}", "1708740": "Voluntad Lucha Sig.Fís. ↑+2 {{value}}", "1708750": "At. Sig. 0 Coste Z.Lucha {{value}}", "1708760": "Aliado Act. C.Hier. Sig.Fís.Esp. ↑+1 M {{value}}", "1708770": "Mov. Efi. Monosabotaje {{value}}", "1708780": "Activa Z.Siniestra Sig.Esp. ↑+1 M {{value}}", "1708790": "At. Riv. C.D. Roca Sig. 0 Coste {{value}}", "1708800": "Ord. Sig.Esp. ↑+2 {{value}}", "1708810": "1.er M-Compi Sig. Mitiga Daño M", "1708820": "M-Compi Sig.Fís.Esp. ↑+2 M {{value}}", "1708840": "1.er At. Sig.Fís.Esp. ↑+{{value}}", "1708850": "At. Z.Fantasma Sig.Fís.Esp. ↑+1 {{value}}", "1708860": "1.er M-Compi Compi↑10", "1708870": "1.ª vez Activa C.Johto (Esp) Protector M", "1708880": "1.er At. Vulnerabilidad Especiales", "1708890": "C.Johto (Esp) Mov. Sig. 0 Coste {{value}}", "1708900": "Aliado Activa Z.Fantasma Sig.Esp. ↑+2 M {{value}}", "1708910": "Mov. Sig.Fís.Esp. ↑+1 M {{value}}", "1708920": "Círculo Aliado Sig. 0 Coste M {{value}}", "1708930": "Ataque Sig.Fís.Esp. ↑+1 {{value}}", "1708940": "1.ª Acc. Est. Sig. 0 Coste M", "1708950": "At. Riv. Env. M-Compi ↑+2 {{value}}", "1708960": "At. Sig.Esp. ↑+3 {{value}}", "1708970": "M-Compi Sig. Crítico M", "1708980": "Entrada Sig.Fís.Esp. M ↑+{{value}}", "1708990": "Activa C.Passio (Def) Sig.Esp. M ↑+{{value}}", "1709000": "1.er At. Res. Fuego ↓", "1709010": "Pos. Defensiva Sig. Fís.↑+1 M {{value}}", "1709020": "Pos. Defensiva Sig. Esp.↑+1 M {{value}}", "1709030": "1.er M-Compi Res. Normal ↓ M {{value}}", "1709040": "1.er M-Compi Res. Fuego ↓ M {{value}}", "1709050": "1.er M-Compi Res. Agua ↓ M {{value}}", "1709060": "1.er M-Compi Res. Eléctrico ↓ M {{value}}", "1709070": "1.er M-Compi Res. Planta ↓ M {{value}}", "1709080": "1.er M-Compi Res. Hielo ↓ M {{value}}", "1709090": "1.er M-Compi Res. Psíquico ↓ M {{value}}", "1709100": "1.er M-Compi Res. Siniestro ↓ M {{value}}", "1709110": "1.er M-Compi Res. Hada ↓ M {{value}}", "1709120": "1.er At. Planta C.Hier. y Resil. Planta ↓", "1709130": "1.er At. Roca Z.Roca y Resil. Roca ↓", "1709140": "1.er M-Compi Resiliencia Roca ↓ M {{value}}", "1709150": "1.ª vez 0 PM Voluntad Fantasma Sig.Fís. ↑+{{value}}", "1709160": "Ord. Sig.Fís. ↑+2 {{value}}", "1709170": "At. Riv. Probl. Est. M-Compi ↑+3 {{value}}", "1709180": "M-Compi Sig.Esp. ↑+1-4 M {{value}}", "1709190": "Activa C.Kanto (Esp) Sig.Esp. ↑+1 {{value}}", "1709200": "At. Ret. Solar {{value}}", "1709210": "At. Aliado Sig.Fís. ↑+1 M-Compi ↑+2", "1709220": "M-Compi Aliado Sig.Fís. ↑+2 {{value}}", "1709240": "Mov. Aliado Sig. 0 Coste {{value}}", "1709250": "Cambiaentorno Sig.Fís. ↑+1 M {{value}}", "1709260": "Mov. Aliado Sig. Mitiga Daño {{value}}", "1709270": "Debilitación M-Compi ↑ M 10", "1709280": "Maxiacc. Sig.Esp. ↑+2 M {{value}}", "1709290": "M-Compi Aliado Sig.Esp. ↑+2 {{value}}", "1709300": "Mov. Sig.Fís. ↑+2 y M-Compi ↑+4", "1709310": "Activa Z.Acero Sig.Fís.Esp. ↑+1 M {{value}}", "1709370": "At. Sig. 0 Coste y Env. C.Hier.", "1709380": "At. Sig. 0 Coste y Que. Z.Fantasma", "1709390": "At. Sig. 0 Coste y Par. Z.Dragón", "1709400": "At. Tera Sig. 0 Coste {{value}}", "1709410": "Activa C.Hier. Sig. Supereficaz ↑", "1709420": "M-Compi Aliado Sig.Fís. ↑+1 {{value}}", "1709430": "Maxiacc. Sig.Fís.Esp. ↑+1 M {{value}}", "1709440": "Entrada Sig.Fís.Esp. ↑+{{value}}", "1709470": "M-Compi Que.", "1709490": "1.er M-Compi Sig.Fís.Esp. ↑ M +{{value}}", "1709540": "At. Sig.Fís. ↑+1 M C.Hier. {{value}}", "1709550": "At. Círculo Sig.Fís. ↑+1 M {{value}}", "1801010": "Resistencia Ataque ↓ {{value}}", "1801020": "Resistencia Defensa ↓ {{value}}", "1801030": "Resistencia Ataque Especial ↓ {{value}}", "1801040": "Resistencia Defensa Especial ↓ {{value}}", "1801050": "Resistencia Velocidad ↓ {{value}}", "1801060": "Resistencia Precisión ↓ {{value}}", "1801070": "Resistencia Evasión ↓ {{value}}", "1801090": "Resistencia Caract. ↓ {{value}}", "1802010": "Inm. Ataque ↓", "1802020": "Inm. Defensa ↓", "1802030": "Inm. Ataque Especial ↓", "1802040": "Inm. Defensa Especial ↓", "1802050": "Inm. Velocidad ↓", "1802060": "Inm. Precisión ↓", "1802070": "Inm. Evasión ↓", "1802080": "Inm. Críticos ↓", "1802090": "Inm. Caract. ↓", "1802110": "Inm. Caract. ↓ Solar", "1802120": "Inm. Precisión ↑", "1802130": "C.Psí. Inm. Caract. ↓", "1802140": "Z.Hada Inm. Caract. ↓", "1802150": "Granizo Inm. Caract. ↓", "1802160": "C.Eléc. Inm. Caract. ↓ M", "1802170": "Inm. Defensa ↓ M", "1802180": "Inm. Ataque Especial ↓ M", "1802190": "Inm. Ataque ↓ M", "1802200": "Z.Hada Inm. Caract. ↓ M", "1802210": "Círculo Inm. Caract. ↓ M", "1802220": "Z.Roca Inm. Caract. ↓ M", "1802230": "Z.Bicho Inm. Caract. ↓", "1802240": "Z.Siniestra Inm. Caract. ↓", "1802250": "Z.Normal Inmun. Caract. ↓ M", "1802270": "Z.Dragón Inm. Caract. ↓ M", "1804010": "Entrada Ataque Rival M ↓ {{value}}", "1804020": "Entrada Velocidad Rival M ↓ {{value}}", "1804030": "Crít. Vel. ↑ {{value}}", "1804040": "Criticombo {{value}}", "1804050": "Acc. Vel. {{value}}", "1804060": "At. Atq. {{value}}", "1804070": "At. Def. ↓ {{value}}", "1804080": "Estoico {{value}}", "1804090": "Mejora Fortuita {{value}}", "1804100": "Caract.↓ A.Esp.↑ {{value}}", "1804110": "Debilitación Ofensiva Riv. M ↓ {{value}}", "1804120": "Daño Eva.↑ {{value}}", "1804130": "Daño Vel.↑ {{value}}", "1804140": "1.ª Fatiga Evasión ↑ {{value}}", "1804150": "D.Fís. Vel. Riv. ↓ {{value}}", "1804160": "At. Caract. ↓ {{value}}", "1804170": "Entrada Ágil {{value}}", "1804180": "Entrada Veloz {{value}}", "1804190": "Entrada Crítica {{value}}", "1804200": "A.Esp.↑ 1.er Apuro {{value}}", "1804210": "Debilitación Atq.↑ {{value}}", "1804220": "Red. A.Esp. {{value}}", "1804250": "Caract.↓ Atq.↑ {{value}}", "1804260": "Eva.↑ 1.er Apuro {{value}}", "1804270": "Aumentataques {{value}}", "1804280": "Vel.↑ 1.er Apuro {{value}}", "1804290": "Acc. A.Esp.↑ {{value}}", "1804300": "Acc. Atq.↑ M {{value}}", "1804310": "Acc. Crít. M {{value}}", "1804320": "Daño Def.↑ {{value}}", "1804330": "Daño D.Esp.↑ {{value}}", "1804340": "Def.↑ 1.er Apuro M {{value}}", "1804350": "1.ª Fatiga Velocidad ↑ {{value}}", "1804360": "Acc. Crít. {{value}}", "1804370": "Acc. D.Esp.↑ M {{value}}", "1804380": "Acc. Eva.↑ {{value}}", "1804390": "Mov. Crít.↑ M {{value}}", "1804400": "Mov. A.Esp.↑ {{value}}", "1804410": "Mov. Vel.↑ M {{value}}", "1804420": "Acierto Def. Riv. ↓ {{value}}", "1804510": "Entrada Ataque Especial ↑ {{value}}", "1804520": "Acc. A.Esp.↑ M {{value}}", "1804530": "Mov. Atq.↑ {{value}}", "1804540": "Mov. D.Esp.↑ {{value}}", "1804550": "M-Compi 5 Caract.↑ {{value}}", "1804560": "Entrada Defensa ↑ {{value}}", "1804570": "Mov. Atq.↑ M {{value}}", "1804580": "Mov. Def.↑ M {{value}}", "1804590": "Entrada Ataque ↑ {{value}}", "1804600": "Atq.↑ 1.er Apuro {{value}}", "1804610": "Entrada Precisión Rival M ↓ {{value}}", "1804620": "Mov. Vel.↑ {{value}}", "1804630": "M-Compi Atq.↑ M {{value}}", "1804640": "At. D.Esp. ↓ {{value}}", "1804650": "Mov. Def.↑ {{value}}", "1804660": "Entrada Defensa Especial ↑ {{value}}", "1804670": "Entrada Defensa Esp. Rival M ↓ {{value}}", "1804680": "Mov. Eva. {{value}}", "1804690": "Mov. Pre. ↑ M {{value}}", "1804700": "Mov. Aliado Def. {{value}}", "1804710": "Crít.↑ 1.er Apuro {{value}}", "1804720": "Acc. Eva.↑ M {{value}}", "1804730": "Mov. Eva.↑ M {{value}}", "1804740": "Fallo Riv. Atq.↑ {{value}}", "1804750": "Fallo Riv. A.Esp.↑ {{value}}", "1804760": "M-Compi Crit.↑ {{value}}", "1804770": "M-Compi Atq. Riv. M↓ {{value}}", "1804780": "Reducedefensas {{value}}", "1804800": "Noqueo Aumentataques {{value}}", "1804810": "Entrada Ataque Esp. Rival M ↓ {{value}}", "1804820": "Daño Atq.↑ {{value}}", "1804830": "At. Atq. ↓ {{value}}", "1804840": "Crít. Atq.↑ {{value}}", "1804850": "Crít. A.Esp.↑ {{value}}", "1804860": "Mov. A.Esp.↑ M {{value}}", "1804870": "Mov. D.Esp.↑ M {{value}}", "1804880": "Daño A.Esp.↑ {{value}}", "1804890": "Daño Def.↑ M {{value}}", "1804900": "At. Eva. ↓ {{value}}", "1804910": "At. Pre. ↓ {{value}}", "1804930": "At. Def. ↓ Riv. Conf. {{value}}", "1804940": "At. Def. ↓ M {{value}}", "1804950": "At. D.Esp. ↓ M {{value}}", "1804960": "At. Def. ↑ {{value}}", "1804970": "At. Vel. ↓ {{value}}", "1804980": "Mov. Crít. D.Esp. ↑ {{value}}", "1804990": "Debilitación Defensa Esp. ↓ M {{value}}", "1805030": "Granuja {{value}}", "1805050": "Lluvia Crít. {{value}}", "1805060": "Mov. Crít. Fácil {{value}}", "1805070": "Fatiga Crít. {{value}}", "1805080": "Entrada Evasión Rival M ↓ {{value}}", "1805090": "M-Compi Crítico Fácil {{value}}", "1805100": "Granizo Crítico {{value}}", "1805110": "Entrada Defensa M ↓ {{value}}", "1805120": "Mov. Efi. Crít.↑ {{value}}", "1805130": "Mov. Efi. A.Esp.↑ {{value}}", "1805160": "Superacción Crítico Fácil Arena {{value}}", "1807010": "Daño Absorbeataque {{value}}", "1807020": "At. Abs. Caract. {{value}}", "1807030": "At. Abs. Def. {{value}}", "1807040": "At. Abs. D.Esp. {{value}}", "1807050": "At. Abs Vel. {{value}}", "1807060": "At. Abs. 1 de 5 Caract. M {{value}}", "1807070": "Daño Abs. 1 de 5 Caract. {{value}}", "1807080": "At. Absorbeataque {{value}}", "1808010": "Mov. Restaurador {{value}}", "1808020": "Restauración en Apuro 1 vez {{value}}", "1808030": "M-Compi Restaurador {{value}}", "1808050": "M-Compi Carac. Riv. M ↑ ↓", "1808060": "M-Compi Restaurador M {{value}}", "1809010": "Entrada Precisión ↑ {{value}}", "1809020": "M-Compi Eva.↑ {{value}}", "1809030": "Entrada Velocidad ↑ M {{value}}", "1809040": "Acc. Crít.↑ Granizo M {{value}}", "1809050": "Mov. Caract.↑ M {{value}}", "1809060": "Entrada Caract. ↑ {{value}}", "1809070": "D.Esp.↑ 1.er Apuro {{value}}", "1809080": "Acc. D.Esp. ↑ {{value}}", "1809090": "Despejar Evasión ↓ {{value}}", "1809100": "Daño Aumentataques M {{value}}", "1809110": "Fallo Riv. Atq.↑ M {{value}}", "1809120": "M-Compi Def.↑ {{value}}", "1809130": "M-Compi Pre.↑ {{value}}", "1809140": "Entrada Caract. ↑ M {{value}}", "1809150": "M-Compi A.Esp.↑ {{value}}", "1809160": "Mov. Crít. Atq.↑ {{value}}", "1809170": "Acc. Caract. Riv. M ↓ {{value}}", "1809180": "Pos. Defensiva Def.↑ {{value}}", "1809190": "Pos. Defensiva D.Esp.↑ {{value}}", "1809200": "Pos. Defensiva Atq.↑ M {{value}}", "1809210": "At. A.Esp.↑ Pluvial {{value}}", "1809220": "Mov. Crít. Def. ↑ {{value}}", "1809230": "Fallo Riv. Eva.↑ {{value}}", "1809250": "1.er M-Compi Ataque ↑ {{value}}", "1809260": "Aumentataques M {{value}}", "1809270": "At. Rel.Im. Riv. Llena {{value}}", "1809280": "Mov. Crít. Vel. ↑ {{value}}", "1809290": "Acc. Est. Curat. M {{value}}", "1809300": "Entrada Precisión ↑ M {{value}}", "1809310": "Entrada Ataque ↑ M {{value}}", "1809320": "Entrada Ataque Especial ↑ M {{value}}", "1809330": "Entrada Ofensiva ↑ {{value}}", "1809340": "At. D.Esp.↑ {{value}}", "1809350": "At. Sue. Riv. Crít.↑ M {{value}}", "1809360": "Acc. Vel. M {{value}}", "1809370": "Red. Físicas {{value}}", "1809380": "At. Vel.↑ M {{value}}", "1809390": "Acc. Vel.↑ M Arena {{value}}", "1809400": "Sabotaje Vel.↑ {{value}}", "1809410": "1.ª Acc. Est. Ofensiva↑ M {{value}}", "1809420": "Acc. Est. Crít. ↑ {{value}}", "1809430": "Acc. Est. Caract. ↑ ×2", "1809440": "Mov. Crít.↑ {{value}}", "1809450": "At. Caract. ↓ {{value}}", "1809460": "At. Def.↑ M {{value}}", "1809470": "At. D.Esp.↑ M {{value}}", "1809480": "Entrada Defensiva ↑ {{value}}", "1809490": "Acc. Defensiva↑ Arena {{value}}", "1809500": "At. Pre .Riv. ↓ Arena {{value}}", "1809510": "Fallo Riv. Vel.↑ M {{value}}", "1809530": "Fatiga Def.↑ M {{value}}", "1809540": "Ord. D.Esp.↑ M {{value}}", "1809550": "M-Dinamax Vel. Riv. M↓ {{value}}", "1809560": "Fallo Riv. Pre.↑ M {{value}}", "1809570": "Fallo Riv. Ofensiva↑ M {{value}}", "1809580": "Aci. Est. Atq. ↓ M {{value}}", "1809590": "Aci. Est. A.Esp. ↓ M {{value}}", "1809600": "M-Dinamax Def.↑ {{value}}", "1809610": "Entrada Críticos ↑ M {{value}}", "1809620": "Ord. A.Esp.↑ M {{value}}", "1809630": "M-Compi Evasión ↓ M {{value}}", "1809640": "1.ª Fatiga Ataque ↑ {{value}}", "1809650": "Acc. Est. A.Esp.↑ M {{value}}", "1809660": "Acc. Est. Def.↑ M {{value}}", "1809670": "Red. Eva. M {{value}}", "1809680": "Red. Vel. M {{value}}", "1809690": "Daño Vel.↑ M {{value}}", "1809700": "Noqueo Ataque ↑ {{value}}", "1809710": "At. Riv. Para. Caract. ↓ {{value}}", "1809720": "At. Críticos ↑ M {{value}}", "1809730": "M-Dinamax D.Esp.↑ {{value}}", "1809740": "M-Dinamax D.Esp.↑ M {{value}}", "1809750": "At. Cara de Hielo Vel.↑ {{value}}", "1809760": "Acc. Est. Atq.↑ M {{value}}", "1809770": "Acc. Est. Caract. ↓ M {{value}}", "1809780": "Daño Defensivo↑ M {{value}}", "1809790": "At. A.Esp.↑ {{value}}", "1809800": "Ord. Atq.↑ M {{value}}", "1809810": "Acc. Defensiva↑ Granizo {{value}}", "1809820": "Mov. Est. Vel. ↑ M {{value}}", "1809830": "Mov. Est. Crít. ↑ M {{value}}", "1809850": "At. Riv. Saboteado D.Esp. ↓ {{value}}", "1809860": "At. Riv. Saboteado Ofensiva↓ {{value}}", "1809870": "Ord. A.Esp.↑ {{value}}", "1809880": "Ord. D.Esp.↑ {{value}}", "1809890": "1.ª Entrada At. Esp. Rival M ↓ {{value}}", "1809900": "At. Atq. Rival ↓ Arena {{value}}", "1809910": "1.ª Acc. Est. 5 Caract. ↑ M {{value}}", "1809920": "Reductor D.Esp. {{value}}", "1809930": "Acc. Est. Vel. ↑ M {{value}}", "1809950": "At. Riv. Sab. Caract. ↓↓ {{value}}", "1809960": "Daño Atq. ↑ M {{value}}", "1809970": "1.ª Acc. Est. Def. ↑ M {{value}}", "1809980": "1.ª Acc. Est. D.Esp. ↑ M {{value}}", "1809990": "1.ª Acc. Est. Defensiva ↑ M {{value}}", "1810010": "1.er M-Compi 5 Caract. ↑ M {{value}}", "1810020": "At. Caract. ↓ Riv. Conf. {{value}}", "1810030": "Acc. Def. ↑ M {{value}}", "1810040": "Acc. Est. D.Esp. ↑↑ M {{value}}", "1810050": "Ataque Def. ↓↓ {{value}}", "1810060": "Daño Def. Riv. ↓ {{value}}", "1810070": "Daño D.Esp. Riv. ↓ {{value}}", "1810080": "Acierto Críticos ↑ {{value}}", "1810090": "Acierto Vel. Riv. ↓ {{value}}", "1810100": "Acc. A.Esp. ↓↓ {{value}}", "1810110": "1.ª Entrada Velocidad ↑ M {{value}}", "1810120": "Entrada Defensa ↑ M {{value}}", "1810130": "Entrada Defensa Especial ↑ M {{value}}", "1810140": "Ord. A.Esp. ↑↑ {{value}}", "1810150": "Ord. Críticos ↑↑ {{value}}", "1810160": "Macrorred. D.Esp. {{value}}", "1810170": "Macrorred. Especiales {{value}}", "1810180": "Macrorred. Caract. {{value}}", "1810190": "At. Riv. Para. Vel. ↓ {{value}}", "1810200": "M-Dinamax Def. Riv. ↓ {{value}}", "1810210": "At. Riv. Para. Críticos ↑ M {{value}}", "1810220": "Acierto Caract. ↓ {{value}}", "1810230": "At. Def. ↑ M Def. Riv. M ↓ C.Hier. {{value}}", "1810240": "At. D.Esp. ↑ M D.Esp. Riv. M ↓ C.Psí. {{value}}", "1810250": "At. Vel. ↑ M Vel. Riv. M ↓ C.Eléc. {{value}}", "1810260": "Ord. Defensiva ↑ {{value}}", "1810270": "Ord. Defensiva ↑↑ {{value}}", "1810280": "Ord. Críticos ↑ M {{value}}", "1810290": "At. Vel. ↓↓ {{value}}", "1810300": "Mov. Efi. Vel. ↓↓ {{value}}", "1810310": "At. Fuego Atq. ↓ {{value}}", "1810320": "At. Agua Def. ↓ {{value}}", "1810330": "At. Bicho D.Esp. ↓ {{value}}", "1810340": "At. Bicho A.Esp. ↓ {{value}}", "1810350": "Mov. Riv. Que. Defensiva ↓ {{value}}", "1810360": "Mov. Atq. ↑↑ Crí. ↑ {{value}}", "1810370": "Posición Defensiva Defensiva ↑ M {{value}}", "1810380": "Mov. PM D.Esp. ↑ M {{value}}", "1810390": "1.er M-Compi Def. ↓ M {{value}}", "1810400": "M-Compi Precisión ↓ M {{value}}", "1810410": "At. Pre. ↑ M {{value}}", "1810420": "Superreductor Atq. {{value}}", "1810430": "Superreductor A.Esp. {{value}}", "1810440": "Superreductor D.Esp. {{value}}", "1810450": "Superreductor Vel. {{value}}", "1810460": "Superreductor Eva. {{value}}", "1810470": "M-Compi D.Esp. ↑ M {{value}}", "1810480": "M-Compi Críticos ↑ M {{value}}", "1810490": "M-Compi Eva. ↑ M {{value}}", "1810510": "Acc. Est. Def. ↑↑ {{value}}", "1810520": "Acc. Est. D.Esp. ↑↑ {{value}}", "1810530": "1.ª Fatiga A.Esp. ↑ {{value}}", "1810540": "Acierto Pluvial D.Esp. ↓ {{value}}", "1810550": "Fallo Rival Defensiva ↑ M {{value}}", "1810560": "At. Vel. ↓ M C.Eléc. {{value}}", "1810570": "At. Riv. Para. Reductor Físicas {{value}}", "1810580": "At. Riv. Env. Ofensiva ↓ {{value}}", "1810590": "At. A.Esp. ↓ {{value}}", "1810600": "Mov. Ofensiva ↑ {{value}}", "1810610": "Acc. Caract. ↓ {{value}}", "1810620": "Daño 1 de 5 Caract. ↑ M {{value}}", "1810630": "At. Riv. Que. A.D.Esp. ↓ {{value}}", "1810640": "Mov. Pre. ↑ {{value}}", "1810650": "M-Dinamax Def. ↑ M {{value}}", "1810660": "At. Riv. Env. Caract. ↓↓ {{value}}", "1810670": "At. Eva. ↑ M {{value}}", "1810680": "At. Riv. Env. Atq. ↑ {{value}}", "1810690": "At. Riv. Env. Vel. ↑ {{value}}", "1810700": "1.ª Fatiga Ofensiva ↑ {{value}}", "1810710": "Mov. 1 de 5 Caract. ↑ M {{value}}", "1810720": "At. Inesquivable Vel. ↑ M {{value}}", "1810740": "Mov. 1 de 5 Caract. ↑ {{value}}", "1810750": "Acc. Defensiva ↑ {{value}}", "1810760": "At. Rel.Im. Riv. Pre. ↓ {{value}}", "1810770": "M-Compi Def. ↓ M {{value}}", "1810780": "Cambiaentorno Eva. ↑ M {{value}}", "1810800": "Acc. D.Esp. ↓↓ {{value}}", "1810810": "Acc. Est. Riv. Env. Carac. ↓ ×{{value}}", "1810820": "Acc. Vel. ↑↑ {{value}}", "1810830": "M-Compi Vel. ↑ M {{value}}", "1810840": "Acierto Evasión ↑ {{value}}", "1810850": "1.ª PS 60% Ofensiva ↑ {{value}}", "1810860": "M-Compi D.Esp. ↑ {{value}}", "1810870": "M-Compi Defensiva ↑ {{value}}", "1810880": "At. Rival Que. At. Esp. ↓ {{value}}", "1810890": "At. Rival Atado Def. Esp. ↓ {{value}}", "1810900": "At. Absorción Atq. ↓ {{value}}", "1810910": "Acc. Características ↑ ×2", "1810920": "Acc. Atq. ↓ {{value}}", "1810940": "Acc. Est. Caract. ↑ {{value}}", "1810950": "M-Dinamax Def. ↓ M {{value}}", "1810960": "At. Riv. Que. Atq. ↓ {{value}}", "1810970": "At. Riv. Atado Vel. ↓ {{value}}", "1810980": "At. Absorción A.Esp. ↓ {{value}}", "1810990": "Acc. Est. Pre. ↑↑ M {{value}}", "1811010": "At. Riv. Que. Caract. ↓ {{value}}", "1811020": "At. Riv. Para. Defensiva ↓ {{value}}", "1811030": "M-Dinamax Atq. ↑ {{value}}", "1811040": "At. Riv. Env. Caract. ↓ {{value}}", "1811050": "Acc. Est. D.Esp. ↓ {{value}}", "1811060": "At. Ofensiva ↑ M {{value}}", "1811070": "1.er M-Compi Defensiva ↓ {{value}}", "1811080": "Acc. Def. ↓ {{value}}", "1811090": "Superacción Def. ↓↓ {{value}}", "1811100": "At. Vel. ↑↑ M {{value}}", "1811110": "At. Riv. Env. At. ↓ y At. Riv. Para. A.Esp. ↓ {{value}}", "1811120": "Superacción D.Esp. ↓↓ {{value}}", "1811130": "At. Riv. C.D. Siniestro Defensiva ↓ {{value}}", "1811140": "At. Riv. C.D. Siniestro Vel. ↑ {{value}}", "1811150": "At. Atq. ↑ M {{value}}", "1811160": "At. A.Esp. ↑ M {{value}}", "1811170": "At. Riv. Ata. Atq. ↓ {{value}}", "1811180": "Red. Ofensiva {{value}}", "1811190": "At. Eva. ↑ {{value}}", "1811200": "Mov. Ofensiva ↑ M {{value}}", "1811210": "Superacción Atq. ↓↓ {{value}}", "1811220": "Superacción A.Esp. ↓↓ {{value}}", "1811230": "Entrada Caract. ↓ M {{value}}", "1811240": "Cambiaentorno Vel. ↑ M {{value}}", "1811250": "At. Riv. Probl.Est. Caract. ↓↓ {{value}}", "1811260": "1.ª Ord. A.Esp. ↑ M {{value}}", "1811270": "Acierto Atq. ↓ {{value}}", "1811280": "Mov. Defensiva ↑ M {{value}}", "1811290": "Ord. Vel. Eva. ↑ M {{value}}", "1811300": "Mov. Ofensiva ↑↑ {{value}}", "1811310": "M-Dinamax Caract. ↓ {{value}}", "1811320": "At. Fís. Def. ↓↓ {{value}}", "1811330": "At. Esp. D.Esp. ↓↓ {{value}}", "1811340": "Acc. Est. Atq. ↓ M {{value}}", "1811350": "Acc. Est. A.Esp. ↓ M {{value}}", "1811360": "At. Defensiva ↓ {{value}}", "1811370": "M-Compi A.Esp. ↓ {{value}}", "1811380": "M-Compi A.Esp. ↑ M {{value}}", "1811390": "M-Compi 5 Caract. ↑ M {{value}}", "1811400": "At. Z.Veneno Caract. ↓ {{value}}", "1811410": "Acierto Caract. ↑↑ {{value}}", "1811420": "Entrada Atq. y Vel. ↑ {{value}}", "1811430": "Acc. Est. Def. ↓↓ {{value}}", "1811440": "At. Riv. Par. Def. ↓ {{value}}", "1811450": "Daño 1 de 5 Caract. Riv. ↓↓ {{value}}", "1811460": "1.er M-Compi Caract. ↓ ×2", "1811470": "Entrada A.Esp. y Vel. ↑ {{value}}", "1811480": "Acierto D.Esp. ↓ {{value}}", "1811490": "M-Compi 7 Caract. ↑ {{value}}", "1811500": "Ord. Ofensiva ↑ {{value}}", "1811510": "M-Dinamax Ofensiva ↑ M {{value}}", "1811520": "1.ª Acc. Est. Críticos ↑ M {{value}}", "1811530": "Acc. Est. Atq. ↓↓ {{value}}", "1811540": "Daño A.Esp. ↑ M {{value}}", "1811550": "At. Círculo Ofensiva ↓ {{value}}", "1811560": "M-Compi Ofensiva ↓ {{value}}", "1811570": "Entrada Eva. ↑ M {{value}}", "1811580": "At. Relevo Impos. Riv. 1 de 5 Caract. ↑ M {{value}}", "1811590": "1.ª Ord. Defensiva ↑ {{value}}", "1811600": "Ef. Bando Aliado o Ambos Ofensiva ↑ M {{value}}", "1811610": "Acc. Est. Def. ↓ {{value}}", "1811620": "At. Ofensiva ↓ {{value}}", "1811630": "M-Dinamax Def.E. ↓ M {{value}}", "1811640": "Mov. Aliado D.Esp. ↑ {{value}}", "1811650": "Acc. Est. A.Esp. ↑ {{value}}", "1811660": "Entrada Especiales ↑ {{value}}", "1811670": "At. Riv. Par. D.Esp. ↓ {{value}}", "1811680": "Daño Ofensiva Riv. ↓ {{value}}", "1811690": "1.ª Entrada Atq. Riv. M ↓ {{value}}", "1811700": "At. Rel.Im. Riv. Ofensiva ↓ {{value}}", "1811710": "At. Reductor Físicas Solar {{value}}", "1811720": "Mov. Llena. Doble {{value}}", "1811730": "At. Caract. ↓ 3 veces {{value}}", "1811740": "Efecto At. Rápido Caract. ↓↓ {{value}}", "1811750": "Mov. A.Esp. ↑↑ Críticos ↑ {{value}}", "1811760": "At. 2 Caract. ↓ Solar {{value}}", "1811770": "Entrada A.Esp. y Eva. ↑ {{value}}", "1811780": "Entrada A.Esp. ↑↑↑↑ Críticos ↑{{value}}", "1811790": "Superreductor Def. {{value}}", "1811800": "1.ª Entrada Caract. ↓ M {{value}}", "1811810": "At. D.Esp. ↓ Granizo {{value}}", "1811820": "1.er M-Compi Pre. Eva. ↓ M {{value}}", "1811830": "Activa Círculo Def. ↑↑ M {{value}}", "1811840": "1.ª Entrada Defensiva ↑ {{value}}", "1811850": "At. De.Esp. ↓↓ {{value}}", "1811860": "Mov. Aliado A.Esp. ↑ {{value}}", "1811870": "At. Riv. Par. Atq. ↓↓ {{value}}", "1811880": "Daño Eva. ↑↑ M {{value}}", "1811890": "Acc. Estado Defensiva ↑ {{value}}", "1811900": "1.ª Entrada Características ↑ {{value}}", "1811910": "Daño Vel. Riv. ↓↓ {{value}}", "1811920": "At. Defs. ↓ Solar {{value}}", "1811930": "M-Dinamax Def.E. ↓ {{value}}", "1811940": "1.ª vez Activa C.Sinnoh (Esp) A.Esp. ↑ {{value}}", "1811950": "M-Compi Defensiva Propia ↓ {{value}}", "1811960": "Mov. Defensiva Propia ↓ {{value}}", "1811970": "At. Riv. Que. Reductor Especiales {{value}}", "1811980": "At. Riv. Par. Ofensiva ↑ M {{value}}", "1811990": "Fallo Riv. Caract. ↑↑ M {{value}}", "1812010": "Mov. Aliado Atq. ↑ {{value}}", "1812020": "Terremoto Atq. ↓ {{value}}", "1812040": "1.ª Entrada Atq. ↑ {{value}}", "1812050": "1.ª Entrada A.Esp. ↑ {{value}}", "1812060": "At. Reductor Especiales {{value}}", "1812070": "At. Z.Hada Caract. ↓ 2 veces {{value}}", "1812080": "At. Riv. Que. Caract.↓↓ {{value}}", "1812090": "At. Riv. Ata. Vel. ↓↓ {{value}}", "1812100": "Cambiaentorno 1 de 5 Caract. ↑↑ M {{value}}", "1812110": "At. 1 o  PM Ord. D.Esp. ↓ {{value}}", "1812120": "At. 0 PM Ord. Caract. ↓↓ {{value}}", "1812130": "At. Riv. Conf. Pre. ↓ {{value}}", "1812140": "At. Caract. ↓↓ {{value}}", "1812150": "At. Riv. Que. Ofensiva ↓ {{value}}", "1812160": "At. Atq. ↓↓ {{value}}", "1812170": "Acierto Vel. ↑ {{value}}", "1812180": "At. A.Esp. ↓↓↓↓ {{value}}", "1812190": "1.ª Acc. Est. A.Esp. ↑ {{value}}", "1812200": "1.ª Acc. Est. Críticos ↑ {{value}}", "1812210": "At. D.Esp. ↓↓↓ {{value}}", "1812220": "At. Aliado Riv. Probl. Est. Caract. ↓ {{value}}", "1812240": "Daño Misma Caract. ↑↑ M {{value}}", "1812260": "Acc. Est. Vel. ↑↑↑↑↑↑ {{value}}", "1812270": "At. Aliado Vel. ↑ Solar M {{value}}", "1812280": "At. Ali. Riv. Ata. Caract. ↑ {{value}}", "1812290": "Acc. A.Esp. ↓ {{value}}", "1812300": "At. Pre. ↓↓↓ {{value}}", "1812310": "M-Dinamax Defensiva ↑ {{value}}", "1812320": "At. Def. ↓ Solar {{value}}", "1812330": "At. Z.Lucha D.Esp. ↓ {{value}}", "1812340": "Activa C.Teselia (Esp) Def. ↑↑ M {{value}}", "1812350": "At. Defensiva ↑↑ M {{value}}", "1812360": "1.ª Entrada Caract. ↑ M {{value}}", "1812370": "A Bocajarro Ofensiva ↓ {{value}}", "1812380": "At. Riv. Que. Defensiva ↓ {{value}}", "1812390": "Activa C.Teselia (Esp) Atq. ↑↑ M {{value}}", "1812400": "Activa C.Teselia (Esp) A.Esp. ↑↑ M {{value}}", "1812410": "Teracristalización Atq. ↑ {{value}}", "1812420": "Ataque Caract. ↓↓ Pluvial {{value}}", "1812430": "1.ª vez Activa C.D. Roca Atq. ↑ {{value}}", "1812440": "1.ª vez Activa C.D. Roca Críticos ↑ {{value}}", "1812450": "At. Riv. C.D. Roca Caract. ↓↓ {{value}}", "1812460": "Mov. Atq. y Vel. ↑ M {{value}}", "1812470": "At. Riv. Que. Físicas ↓↓ +{{value}}", "1812480": "At. Riv. Env. Defensiva ↓ {{value}}", "1812490": "At. Def. ↓↓↓↓↓↓ {{value}}", "1812500": "At. D.Esp. ↓↓↓↓↓↓ {{value}}", "1812510": "Círculo Aliado Vel. ↑↑ M {{value}}", "1812520": "1.ª vez Activa C.Johto (Esp) A.Esp. ↑ M {{value}}", "1812530": "1.ª vez Activa C.Johto (Esp) Crít. ↑ M {{value}}", "1812540": "At. Fís. Sig.Fís. ↑+3 {{value}}", "1812550": "At. Esp. Sig.Espe. ↑+3 {{value}}", "1812560": "1.ª Entrada Ofensiva Riv. M ↓ {{value}}", "1812570": "At. A.Esp ↓↓ {{value}}", "1812580": "At. Def. y Vel. ↓ {{value}}", "1812590": "At. Riv. Conf. D.Esp. ↓↓ {{value}}", "1812600": "At. Def. ↓↓↓ {{value}}", "1812610": "1.ª Entrada Críticos ↑ {{value}}", "1812620": "Pos. Defensiva Defensa Riv. M ↓↓↓↓ {{value}}", "1812630": "Pos. Defensiva D.Esp. Riv. M ↓↓↓↓ {{value}}", "1812640": "Superacción Defensiva ↓↓ {{value}}", "1812650": "Mov. Misma Caract. ↓↓ {{value}}", "1812660": "At. Misma Caract.t ↓ 2 veces {{value}}", "1812670": "1.ª Entrada Defensiva ↑ M {{value}}", "1812690": "Mov. Atq. ↓↓ {{value}}", "1812700": "Mov. A.Esp. ↓↓ {{value}}", "1812710": "At. Físicas ↓↓ {{value}}", "1812720": "1.ª Entrada A.Esp. ↑{{value}} Críticos ↑↑↑", "1812730": "Acc. Est. Ofensiva ↓ {{value}}", "1812740": "At. Def. ↓↓ C.Hier. {{value}}", "1812750": "At. Z.Roca Atq. ↓↓ {{value}}", "1812760": "At. Riv. Conf. Caract. ↓↓ {{value}}", "1812770": "At. Reductor Físicas {{value}}", "1812780": "Rebote Caract. ↓", "1812790": "Activa Círculo Vel. ↑↑ M {{value}}", "1812810": "At. Caract. ↓ C.Eléc. {{value}}", "1812820": "1.ª Entrada Furor -1 y Críticos ↑↑↑", "1812840": "At. Atq. ↑↑ M {{value}}", "1812850": "At. A.Esp. ↑↑ M {{value}}", "1812860": "1.er M-Compi Caract. ↓ M 10 veces", "1901010": "At. Penetrante", "1902010": "Mitiga Físico 1.er Apuro Bando", "1902020": "M-Compi C.Hier.", "1902040": "Entrada Bloqueo Probl.Est. Bando", "1902050": "1.er M-Compi Acelerador Bando", "1902080": "Sol Duradero {{value}}", "1902090": "Lluvia Duradera {{value}}", "1902110": "1.er M-Compi Radiante", "1902120": "1.er M-Compi Lluvioso", "1902130": "1.er M-Compi Arenoso", "1902150": "Acc. Despejado {{value}}", "1902160": "1.er M-Compi Bloq. Críticos Bando", "1902180": "1.er M-Compi C.Eléc.", "1902190": "Arena Duradera {{value}}", "1902200": "1.ª Entrada Arenosa Inm. Arena", "1902210": "1.ª Acc. Est. Aceleradora Bando", "1902220": "Acc. Est. Aceleradora Bando", "1902230": "Acelerador 1.er Apuro Bando", "1902240": "1.er M-Compi Z.Tierra", "1902250": "1.ª Entrada Z.Tierra", "1902260": "Mitiga Físico Duradero {{value}}", "1902270": "Mitiga Especial Duradero {{value}}", "1902280": "Bloqueo Probl.Est. Duradero {{value}}", "1902290": "M-Dinamax C.Eléc.", "1902300": "1.ª Entrada Z.Acero", "1902310": "Z.Hada Duradera {{value}}", "1902320": "1.ª Entrada Z.Hada", "1902330": "1.ª Entrada Z.Dragón", "1902340": "M-Compi Lluvioso", "1902350": "M-Compi C.Eléc.", "1902360": "1.ª Entrada Z.Voladora", "1902370": "Mov. Acelerador Bando {{value}}", "1902380": "Z.Roca Duradera {{value}}", "1902390": "M-Compi Acelerador Bando", "1902410": "1.er M-Compi Z.Lucha", "1902420": "1.ª Entrada C.Eléc. y Duradero {{value}}", "1902430": "1.ª Entrada Z.Hada y Duradera {{value}}", "1902440": "1.ª Entrada C.Hier. y Duradero {{value}}", "1902450": "1.ª Entrada C.Psí. y Duradero {{value}}", "1902460": "Caract. Riv. ↑ Impos. Duradero {{value}}", "1902470": "Mov. Mitiga Físico Bando {{value}}", "1902480": "Z.Hielo Pedrisco", "1902490": "M-Compi C.Psí.", "1902500": "M-Compi Z.Hada", "1902510": "1.ª Entrada Z.Hielo", "1902520": "Granizo Duradero {{value}}", "1902530": "Z.Hielo Duradera {{value}}", "1902540": "Noqueo Acelerador Bando {{value}}", "1902550": "1.ª Entrada Z.Fantasma", "1902570": "1.er M-Compi Pedrisco", "1902580": "Z.Dragón Duradera {{value}}", "1902590": "M-Compi Z.Siniestra", "1902610": "C.D. Siniestro Duradero {{value}}", "1902620": "1.er M-Compi Caract. Bando Riv. ↑ Impos.", "1902630": "Mov. Bloqueo Críticos Bando {{value}}", "1902640": "Z.Veneno Duradera {{value}}", "1902650": "1.er M-Compi Z.Veneno", "1902660": "C.Eléc. Duradero {{value}}", "1902670": "1.er M-Compi Z.Normal", "1902680": "C.Teselia (Fís) Duradero {{value}}", "1902690": "M-Compi Z.Voladora", "1902700": "Z.Voladora Duradera {{value}}", "1902710": "C.Kanto (Esp) Duradero {{value}}", "1902720": "Ord. Bloqueo Críticos Bando {{value}}", "1902730": "C.Johto (Fís) Duradero {{value}}", "1902740": "C.Hier. Duradero {{value}}", "1902760": "1.ª Entrada Z.Roca", "1902770": "M-Compi Z.Roca", "1902780": "Z.Acero Duradera {{value}}", "1902790": "C.Sinnoh (Def) Duradero {{value}}", "1902800": "1.ª Entrada C.Eléc.", "1902810": "1.ª Entrada Z.Veneno", "1902820": "Z.Tierra Duradera {{value}}", "1902830": "Mov. Caract. Bando Rival ↑ Imposible {{value}}", "1902840": "1.ª Acc. Est. Z.Acero", "1902850": "C.Teselia (Def) Duradero {{value}}", "1902860": "1.er At. Caract. Bando Riv. ↑ Impos.", "1902870": "1.ª Entrada Z.Siniestra", "1902880": "C.Galar (Esp) Duradero {{value}}", "1902900": "M-Dinamax Acelerador Bando", "1902910": "Z.Fantasma Duradera {{value}}", "1902920": "Z.Siniestra Duradera {{value}}", "1902930": "C.Alola (Esp) Duradero {{value}}", "1902940": "C.Alola (Def) Duradero {{value}}", "1902950": "Ord. Aceleradora Bando {{value}}", "1902960": "C.Passio (Def) Duradero {{value}}", "1902970": "M-Compi Z.Hielo", "1902980": "1.ª Entrada C.Hier.", "1902990": "Gigarredoble C.Hier.", "1903020": "Inm. C.D. Fuego", "1903080": "Inm. C.D. Veneno", "1903130": "Inm. C.D. Roca", "1903160": "Inm. C.D. Siniestro", "1903170": "Inm. C.D. Acero", "1904020": "Resistencia C.D. Fuego {{value}}", "1904080": "Resistencia C.D. Veneno {{value}}", "1904130": "Resistencia C.D. Roca {{value}}", "1904160": "Resistencia C.D. Siniestro {{value}}", "1904170": "Resistencia C.D. Acero {{value}}", "1904190": "Resistencia Campos Daño {{value}}", "1905010": "1.ª Danza Lluvia Z.Hada", "1905030": "Maxipuño Z.Lucha", "1905040": "Maxiciclón Z.Voladora", "1905050": "M-Dinamax Radiante", "1905060": "1.er M-Compi Z.Hielo", "1905070": "1.er M-Compi Z.Dragón", "1905080": "1.er Día Soleado C.Hier.", "1905090": "M-Dinamax Z.Normal", "1905100": "Z.Normal Duradera {{value}}", "1905110": "C.Paldea (Def) Duradero {{value}}", "1905120": "M-Dinamax Z.Fantasma", "1905130": "1.ª Entrada C.Psí.", "1905140": "1.ª Acc. Z.Lucha", "1905150": "M-Dinamax Z.Veneno", "1905160": "1.ª Acc. C.Psí.", "1905170": "C.Psí. Duradero {{value}}", "1905180": "1.ª Entrada C.D. Veneno", "1905190": "1.er M-Compi Z.Roca", "1905200": "1.er At. Lluvioso", "1905220": "Daño Arenoso {{value}}", "1905230": "Gigacastigo Z.Hada", "1905240": "1.ª Voluntad Hada C.Eléc.", "1905250": "Maxilito Z.Roca", "1905260": "1.ª Entrada Z.Bicho", "1905270": "Z.Bicho Duradera {{value}}", "1905290": "Maxitemblor Z.Tierra", "1905300": "C.Eléc. Z.Veneno", "1905310": "1.er M-Compi C.Hier.", "1905320": "1.ª Entrada Z.Normal", "1905330": "1.ª Ord. C.Hier.", "1905340": "1.ª Entrada C.Alola (Esp)", "1905350": "M-Compi C.D. Fuego", "1905360": "Activa Lluvia C.Galar (Esp)", "1905370": "Activa C.Hier. C.Galar (Fís)", "1905380": "Activa Sol C.Galar (Def)", "1905390": "M-Compi Cielo Despejado {{value}}", "1905400": "1.ª Entrada C.Paldea (Esp)", "1905410": "1.er M-Compi C.Paldea (Esp)", "1905420": "Velocidad Z.Tierra", "1905430": "M-Compi C.D. Veneno", "1905440": "C.D. Veneno Duradero {{value}}", "1905480": "C.Kanto (Def) Duradero {{value}}", "1905490": "C.Hoenn (Def) Duradero {{value}}", "1905500": "1.er M-Compi C.Kanto (Def)", "1905510": "1.er M-Compi C.Hoenn (Def)", "1905520": "1.er M-Compi C.Paldea (Def)", "1905530": "C.Sinnoh (Esp) Duradero {{value}}", "1905540": "Barra Acelerada Duradera {{value}}", "1905550": "C.Hoenn (Fís) Duradero {{value}}", "1905560": "C.Johto (Defe) Duradero {{value}}", "1905570": "1.ª Unidad de Paldea Z.Hada", "1905580": "M-Dinamax Z.Bicho EX", "1905590": "C.Johto (Esp) Duradero {{value}}", "1905600": "1.ª Entrada C.Johto (Esp)", "1905610": "1.ª Orden C.Paldea (Def)", "1905620": "1.ª Entrada C.Teselia (Def)", "1905630": "1.er M-Compi C.Teselia (Def)", "1905640": "M-Dinamax Z.Dragón", "1905650": "Z.Lucha Duradera {{value}}", "1905660": "1.er M-Compi C.Johto (Def)", "1905670": "1.er M-Compi C.Kalos (Def)", "1905680": "1.er M-Compi C.Galar (Def)", "1905690": "C.Kalos (Def) Duradero {{value}}", "1905700": "C.Galar (Def) Duradero {{value}}", "1905710": "1.ª Entrada C.Sinnoh (Defensivo)", "1905720": "1.er Ataque Z-Voladora EX", "1905730": "1.ª Entrada Mitiga Esp. Bando y Duradero {{value}}", "1905740": "1.er At. Z.Fantasma", "1905750": "1.er At. Z.Fantasma y Duradera {{value}}", "1905760": "M-Compi Mitiga Especial Bando", "1905770": "Activa Sol Z.Lucha", "1905780": "1.ª Entrada C.Paldea (Def)", "1905790": "1.ª Entrada C.Teselia (Esp)", "1905800": "Entrada C.Johto (Fís) y Sig.Fís. ↑ M {{value}}", "1905810": "1.er At. Z.Roca", "1905820": "1.er At. Z.Dragón", "1905830": "1.er M-Compi C.Kanto (Fís)", "1905840": "1.er At. Z.Veneno EX", "1905850": "1.er M-Compi C.Sinnoh (Esp)", "1905860": "1.ª Ord. Z.Fantasma EX", "1905870": "1.er At. C.Eléc. EX", "1905880": "1.er At. Z.Tierra EX", "1905890": "1.er M-Compi Z.Hada", "1905900": "Sol y Z.Lucha Duraderos {{value}}", "1905910": "1.er At. C.Paldea (Def)", "1905920": "1.er M-Compi C.Sinnoh (Def)", "1905930": "1.er M-Compi C.Alola (Def)", "1905940": "1.ª Entrada C.Hoenn (Def)", "1905950": "C.D. Roca Duradero {{value}}", "1905960": "Teracristalización Z.Siniestra", "1905970": "C.Teselia (Esp) Duradero {{value}}", "1905980": "1.ª Entrada Z.Lucha", "1905990": "1.ª Entrada C.Galar (Def)", "1906000": "1.ª Entrada C.Galar (Def) y Duradero {{value}}", "1906010": "1.ª Entrada C.Sinnoh (Esp)", "1906020": "1.ª Entrada C.Sinnoh (Esp) y Duradero {{value}}", "1906030": "1.ª Entrada C.Kanto (Fís) y Duradero {{value}}", "1906040": "1.er At. C.Kanto (Esp)", "1906050": "1.er M-Compi C.Kanto (Esp)", "1906060": "Aliado Activa Sol Z.Tierra", "1906070": "1.er M-Compi Z.Fantasma", "1906080": "1.er At. C.Psí. y Duradero {{value}}", "1906090": "1.er M-Compi C.Teselia (Fís)", "1906100": "C.Paldea (Esp) Duradero {{value}}", "1906110": "1.ª Acc. Est. Z.Hielo EX", "1906120": "1.ª Entrada C.Passio (Def)", "1906130": "Ord. C.Kanto (Esp)", "1906140": "1.er M-Compi Z.Voladora", "1906150": "1.er At. Z.Veneno", "1906160": "1.ª Ord. Z.Bicho", "1906170": "1.er At. Radiante", "1906180": "1.er At. Radiante y Duradero {{value}}", "1906190": "M-Compi Z.Normal", "1906200": "At. M-Sincro C.Hier.", "1906210": "Ataque Mov. S C.Hier. y Duradero {{value}}", "1906220": "1.ª Acc. Est. Z.Hada", "1906230": "1.er At. Z.Bicho", "1906240": "1.er M-Compi C.Psí.", "1906270": "1.ª Entrada Z.Voladora Permanente", "1906300": "1.ª Entrada C.Kanto (Esp)", "1906310": "1.er At. Z.Hielo", "1906320": "1.ª Acc. Estado Z.Tierra", "1906330": "1.ª Ord. Z.Voladora", "1906340": "1.er M-Compi Z.Veneno y Duradera {{value}}", "1906360": "M-Dinamax Z.Siniestra", "1906370": "1.er At. Z.Hada", "1906380": "1.er At. C.Johto (Defensivo)", "1906390": "C.Hier. y Z.Roca Duraderos {{value}}", "1906400": "Mov. Lluvioso", "1906410": "Mov. Z.Siniestra", "1906420": "Mov. Lluvioso y Z.Siniestra", "1906430": "Lluvia y Z.Siniestra Duraderas {{value}}", "1906440": "1.er M-Compi Lluvioso y Duradero {{value}}", "1906450": "C.Sinnoh (Fís) Duradero {{value}}", "1906460": "1.er At. Z.Roca y Duradera {{value}}", "1906470": "1.er At. M-Sincro Z.Lucha EX", "1906480": "C.Kalos Triple Duradero {{value}}", "1906490": "C.Paldea (Fís) Duradero {{value}}", "1906500": "Activa Z.Acero C.Galar (Defensivo)", "1906560": "C.Kanto (Fís) Duradero {{value}}", "1906570": "C.Galar (Fís) Duradero {{value}}", "1906580": "1.er M-Compi C.Johto (Fís)", "1906590": "1.er M-Compi C.Johto (Esp)", "1906600": "1.er M-Compi C.Galar (Fís)", "1906610": "1.er M-Compi C.Galar (Esp)", "1906620": "1.ª Teraexplosión Gema Irisada Z.Normal", "1906630": "1.er M-Compi C.Kanto Triple y Duradero {{value}}", "1906640": "1.er At. C.Eléc.", "1906650": "1.ª Entrada C.Kanto (Fís)", "1906660": "1.ª Entrada C.Kanto (Def)", "1906670": "1.er At. Z.Siniestra y Duradera {{value}}", "1906680": "1.ª Entrada Z.Hada Permanente", "1906710": "1.ª Entrada Z.Siniestra Permanente", "1906720": "1.er M-Compi Z.Lucha y Z.Lucha Inm. Crít. M", "1906730": "1.ª vez 0 PM Esfera Aural PC: C.Kalos (Esp.)", "1906740": "C.Kalos (Esp) Duradero {{value}}", "1906750": "1.ª vez 0 PM Golpe Roca DC: C.Kalos (Fís.)", "1906760": "C.Kalos (Fís) Duradero {{value}}", "1906770": "Mitiga Físico Especial Duradero {{value}}", "1906780": "Mov. Mitiga Físico Especial Bando {{value}}", "1906790": "1.er At. Z.Voladora", "1906830": "1.er M-Compi Z.Normal y Duradera {{value}}", "1906840": "Entrada C.Psí.", "1906850": "1.er At. C.Hier.", "1906860": "1.er At. C.Hier. y Duradero {{value}}", "1906880": "1.er At. Z.Lucha", "2001010": "Inm. Arena", "2101010": "Inm. Golpes Críticos", "2101020": "Inm. Críticos Pluvial M", "2101030": "Z.Siniestra Inm. Críticos M", "2101040": "Z.Hielo Inm. Críticos M", "2101050": "C.Paldea (Def) Inm. Crít. M", "2101060": "C.Psí. Inm. Críticos", "2101070": "Inm. Golpes Críticos M", "2101080": "C.D. Veneno Inm. Críticos M", "2101090": "Barra Acelerada Inm. Críticos M", "2101100": "C.Teselia (Esp) Inmun. Crít. M", "2101110": "Z.Roca Inmunidad Críticos M", "2101130": "Z.Normal Inmunidad Críticos M", "2101140": "Campo Inm. Críticos", "2101150": "Z.Voladora Inm. Críticos", "2101160": "Z.Dragón Inm. Críticos M", "2201010": "Aire Nocivo {{value}}", "2201020": "Incordio {{value}}", "2201030": "Condena {{value}}", "2201040": "Crítico Ruin {{value}}", "2201050": "Efectos Secundarios ↑ {{value}}", "2201060": "Estados Negativos ↑ {{value}}", "2301030": "C.Psí. D.Esp. ↑", "2301040": "Inm. Arena Defensiva↑", "2301050": "Vigor Ataque ↑ {{value}}", "2301060": "Acc. Objetivo Múltiple", "2301070": "M-Compi Acción Objetivo Múltiple", "2301090": "Fatiga Defensiva↑ {{value}}", "2301100": "Granizo Defensiva↑", "2301120": "Acc. Est. Caract. ↑ M {{value}}", "2301130": "M-Compi Objetivo Múltiple", "2301140": "M-Dinamax Objetivo Múltiple", "2301150": "Efecto Bando Aliado 5 Caract. ↑ {{value}}", "2301160": "PS ↓ Ataque Especial ↑ {{value}}", "2301170": "Acc. M-Dinamax Objetivo Múltiple", "2301180": "Acc. Est. Caract. Riv. M ↓ {{value}}", "2301190": "Sol Ataque ↑ {{value}}", "2301200": "C.Eléc. A.Esp. ↑ {{value}}", "2301230": "Durante Tera 5 Caract. ↑ {{value}}", "5130206": "Ausencia Cambios Aplacadora {{value}}", "5130207": "Entereza Aplacadora {{value}}", "5130212": "Ausencia Cambios Negativos Aplacadora {{value}}", "5210101": "Entereza Inm. Críticos", "9901120": "Mitiga Agua y Lluvia Curat.", "9901920": "Ausencia Efectos Negativos Aplacadora {{value}}" }, "it": { "1101120": "Supereff. curativa {{value}}", "1101140": "Supereff. curativa-G {{value}}", "1101160": "Curamos. curapiù-G {{value}}", "1101170": "Uso eliomos. curat.-G {{value}}", "1101180": "Uso eliomos. curativa {{value}}", "1101220": "Centrabers. curativo {{value}}", "1101310": "Confusatt. curativo {{value}}", "1101350": "Paralizzatt. curativo {{value}}", "1101450": "Impediatt. curativo {{value}}", "1101460": "Ust.emer. attacco curapiù {{value}}", "1101470": "Avvelenatt. curativo {{value}}", "1101500": "Paralizzatt. curativo-G {{value}}", "1101520": "UniDynam. curativo-G {{value}}", "1101540": "Imprigionatt. alleato curativo {{value}}", "1101580": "Zona Normale Unireaz. curativa {{value}}", "1101590": "Fatica reazione tecniche baccons. e curativa {{value}}", "1201010": "Colmapiog.{{value}}", "1201040": "Colmasab. {{value}}", "1201050": "Colmagrand. {{value}}", "1201060": "Campo El.colma {{value}}", "1201070": "Campo Psi.colma {{value}}", "1201220": "Zona Normale colmab. {{value}}", "1201230": "Zona Ghiaccio colmab.{{value}}", "1201240": "Cerchia colmab. {{value}}", "1201250": "Ambiente colmab. {{value}}", "1202010": "CC {{value}}", "1202060": "Ciclo continuo G {{value}}", "1202090": "Cileccar. {{value}}", "1202100": "Attacco riempib. {{value}}", "1202150": "Statomossa riempib. {{value}}", "1202170": "Fallimento riempib. {{value}}", "1202180": "Oscurotuffo riempib. {{value}}", "1202190": "Centrabers. riempib. {{value}}", "1202200": "Confusatt. riempib. doppio {{value}}", "1202210": "Attacco ineludibile riempib. {{value}}", "1202220": "Campo Psichico uso mossa riempib. {{value}}", "1202230": "Ustione attacco riempib. doppio {{value}}", "1202240": "Pioggia centrabers. riempib. {{value}}", "1202250": "Vietacam. attaccar. doppio {{value}}", "1202260": "Confusatt. alleato riempib. doppio {{value}}", "1202270": "Confusatt. alleato riempib. {{value}}", "1301020": "Sabb.forza {{value}}", "1301030": "Ritors. {{value}}", "1301130": "Scot.forza {{value}}", "1301140": "Gran.forza {{value}}", "1301150": "Cong.forza {{value}}", "1301170": "Confu.forza {{value}}", "1301180": "Confo.forza {{value}}", "1301200": "Nemicofor. {{value}}", "1301210": "Accanifor. {{value}}", "1301220": "Impedifor. {{value}}", "1301250": "Tent.forza {{value}}", "1301260": "Add.forza {{value}}", "1301270": "Avvel.forza {{value}}", "1301280": "Imprig.forza {{value}}", "1301320": "Rallentaf.", "1301360": "Feritofor. {{value}}", "1301470": "Motivofor.", "1301480": "Vietacam. raff. {{value}}", "1301500": "Salutentr. Iperefficace", "1301510": "Cambioviet. raff. {{value}}", "1301520": "Colmasole raff. {{value}}", "1301530": "Colmapioggia raff. {{value}}", "1301560": "Schivasabb. raff. {{value}}", "1301580": "Meteocalmo raff. {{value}}", "1301590": "Scontabar. {{value}}", "1301600": "Gelofaccia ultraeff. {{value}}", "1301610": "Campo Psi.forza {{value}}", "1301620": "Zona Drago raff. {{value}}", "1301630": "Meteo potenziam. {{value}}", "1301640": "Tecniche ultraeff. {{value}}", "1301680": "Zona Buio raff. {{value}}", "1301690": "Zona Spettro raff. {{value}}", "1301730": "Zerobonus raff. {{value}}", "1301750": "Imprecis. raff. {{value}}", "1301770": "Zona Acciaio raff. {{value}}", "1301780": "Campod. Roccia nemico raff. {{value}}", "1301790": "Contracc.pot. {{value}}", "1301800": "Zona Folletto raff. {{value}}", "1301810": "Zona Coleottero raff. {{value}}", "1301830": "Attaccaum. rafforzante {{value}}", "1301840": "Arguzia raff. {{value}}", "1301870": "Zona Volante raff. {{value}}", "1301890": "Campo Elettrifor.-G {{value}}", "1301900": "Campo Psichifor.-G {{value}}", "1301910": "Imprigionaf. tecniche {{value}}", "1301940": "Velocità raff. {{value}}", "1301950": "Difesaum. raff. {{value}}", "1301960": "Sagacia raff. {{value}}", "1301970": "Imprigion.-G {{value}}", "1301980": "Grandinf. tecniche {{value}}", "1301990": "Campod. Buio nemico raff. {{value}}", "1302040": "Contracc. {{value}}", "1302120": "Sabbia smorzad. {{value}}", "1302160": "Zona Acciaio smorzad. {{value}}", "1302170": "Zona Lotta smorzad. {{value}}", "1302180": "Zona Folletto smorzad. speciale-G {{value}}", "1302190": "Campo Erboso smorzad. fisico-G {{value}}", "1302200": "Grandine smorzad. {{value}}", "1302210": "Zona Buio smorzad. {{value}}", "1302220": "Zona Coleott. smorzad.-G {{value}}", "1302230": "Zona Drago smorzad. {{value}}", "1302240": "Cerchia smorzad. {{value}}", "1302250": "Sabbia smorzad. speciale-G {{value}}", "1302260": "Zona Folletto smorzad.-G {{value}}", "1302270": "Zona Terra smorzad. {{value}}", "1302280": "Grandine smorzad. fisico-G {{value}}", "1302290": "Zona Roccia smorzad. fisico-G {{value}}", "1302300": "Zona Roccia smorzad. speciale-G {{value}}", "1302310": "Campod. Buio nemico smorzad.-G {{value}}", "1302320": "Frangiprot. smorzad.-G {{value}}", "1302330": "Zona Ghiaccio smorzad. speciale-G {{value}}", "1302340": "Sole smorzad. speciale-G {{value}}", "1302350": "Avvelenasc.-G {{value}}", "1302370": "Smorzad. fisico-G {{value}}", "1302380": "Effetto alleacampo smorzad.-G {{value}}", "1302390": "Campo Erboso smorzad.-G {{value}}", "1302420": "Sole EX smussam. plurime Acqua {{value}}", "1302430": "Pioggia EX smussam. plurime Fuoco {{value}}", "1302440": "Campo colmabarra smorzad. {{value}}", "1302450": "Smorzad. solare-G {{value}}", "1303020": "Multicolp.", "1303040": "Multicolpo triplo+", "1306020": "Att.omaggio {{value}}", "1306030": "Ricaricatt. veloce {{value}}", "1306040": "Ricaricam. {{value}}", "1306050": "Colpo attaccom. {{value}}", "1306060": "Ricaricatt. veloce scottato {{value}}", "1306080": "Mossa ripristin. {{value}}", "1306120": "Rapidatt. ricaricavoce {{value}}", "1306130": "Mono Fatica Att.omaggio {{value}}", "1306150": "Unimossa squadra sincrom. {{value}}", "1306180": "Prima Unimossa statom. {{value}}", "1306190": "Primo uso Campo Elettrico sincrom. {{value}}", "1306200": "Mono attacco statom. {{value}}", "1306230": "Unimossa sincrom. {{value}}", "1306240": "Sciagura sincrom. 32", "1306250": "Unimossa sincrom. 50 {{value}}", "1306260": "Attacco sincrom. 32 {{value}}", "1306270": "Uso Analisi di Unima sincrom. {{value}}", "1306290": "Uso prima statomossa sincrom. {{value}}", "1308020": "Cerchia Unima (fis) raff. {{value}}", "1308040": "Ambiente raff.-G {{value}}", "1308060": "Normoeff. rafforzante {{value}}", "1308070": "Grandinf.-G {{value}}", "1308080": "Sabbiaf. tecniche {{value}}", "1308090": "Cerchia Pasio (dif) potenziat.-G {{value}}", "1308110": "Velocità alleata raff. {{value}}", "1308120": "Campod. Buio nemico raff.-G {{value}}", "1308130": "Difesaum. potenziatec. {{value}}", "1308140": "Avvelenaf.-G {{value}}", "1308170": "Zerobonus raff.-G {{value}}", "1308180": "Cerchia di Paldea (difensiva) raff.-G {{value}}", "1308200": "Cerchia di Unima (difensiva) raff.-G {{value}}", "1308210": "Campod. Veleno nemico raff.-G {{value}}", "1308220": "Addorment.-G {{value}}", "1308230": "Confondi.-G {{value}}", "1308250": "Zona Folletto raff.-G {{value}}", "1308290": "Terremoto raff. {{value}}", "1308300": "Fiaccamento raff. {{value}}", "1308320": "Zona Ghiaccio raff. {{value}}", "1308330": "Sciagura accanita multipot. ×2", "1308350": "Frangiprot. potenziat. {{value}}", "1308360": "Alleacolpo raff. {{value}}", "1308370": "Zona Drago raff.-G {{value}}", "1308400": "Zona Lotta raff.-G {{value}}", "1308420": "Cerchia di Unima (danni speciali) raff.-G {{value}}", "1308430": "Zona Drago potenziat. {{value}}", "1308450": "Campod. Roccia nemico raff.-G {{value}}", "1401030": "Impeto dannosp. Spettro", "1501020": "Colpospr. {{value}}", "1501030": "Prima Uniacceler. {{value}}", "1501040": "Mono rapidifficoltà G {{value}}", "1501080": "Mono Rapidiff. {{value}}", "1501110": "Vietacam. sprintatt. {{value}}", "1501120": "Contabb. {{value}}", "1501130": "Supereff. sprint {{value}}", "1501140": "Colpo abbassac. {{value}}", "1501150": "Mossaspr. solare {{value}}", "1501160": "Mossaspr. piovosa {{value}}", "1501180": "Contratt. sprint {{value}}", "1501230": "Attesattacco doppiospr. {{value}}", "1501300": "Rapidatt. doppiosprint {{value}}", "1501310": "Rapidatt. sprint {{value}}", "1501400": "Prima autocer. di Sinnoh (danni speciali) sprint {{value}}", "1501480": "UniTera. sprint {{value}}", "1601110": "Confo.forza Unimossa {{value}}", "1601130": "Rallentaf. Unimossa", "1601170": "Add.forza Unimossa {{value}}", "1601200": "Cong.forza Unimossa {{value}}", "1601210": "Tent.forza Unimossa {{value}}", "1601290": "Scot.forza Unimossa {{value}}", "1601300": "Unipotenza vietacam. {{value}}", "1601350": "Avvelenaf. Unimossa {{value}}", "1601360": "Intralciaf. Unimossa", "1601370": "Unicondens.", "1601460": "UniDynamax ultraeff. {{value}}", "1601500": "Unipotenza imprig. {{value}}", "1601520": "Imprecis. unipotente {{value}}", "1601540": "UniDyna. attaccaum. {{value}}", "1601570": "Unipotenza altrocam. {{value}}", "1601610": "Unipotenza agilaum. {{value}}", "1601650": "Unipotenza Campod. Acciaio nemico {{value}}", "1601670": "Frangiprot. unipotente {{value}}", "1601710": "Cerchia Unima (fis) unipotente {{value}}", "1601740": "Cerchia Johto (fis) unipotente {{value}}", "1601760": "Cerchia Unima (dif) unipotente {{value}}", "1601770": "Frangiprot. raff.-G {{value}}", "1601780": "Avvelenaf. UniDynamax {{value}}", "1601790": "Cerchia Paldea (fis) unipotente {{value}}", "1601800": "Cerchia Alola (spe) unipotente {{value}}", "1601810": "Unipotenza sconfort. {{value}}", "1601830": "Imprig. unipotente-G {{value}}", "1601890": "Unipot. Campo Psichico {{value}}", "1601900": "Arguzia UniDynapot. {{value}}", "1601920": "Vietacambio raff.-G {{value}}", "1601940": "Campod. Veleno nemico unipotente-G {{value}}", "1602010": "Prima Unimossa attaccom. {{value}}", "1602040": "Unimossa ripristin. {{value}}", "1602050": "Mono Unimossa ripristin. {{value}}", "1602080": "Mono emergenza ricaricatt. veloce {{value}}", "1602090": "Unimossa ricaricav. {{value}}", "1603010": "Pioggia UniDynapot. {{value}}", "1603100": "Campod. Roccia nemico unipot.-G {{value}}", "1701120": "Impedibl.", "1701130": "Impedibl. piovoso", "1701150": "Impedibl. solare", "1701160": "Impedibl. meteocalmo", "1701260": "Zona Buio impedibl.", "1701280": "Campo Erboso impedibl.", "1701320": "Campo Psichico bloccaff.-G", "1701330": "Plurireazione sprezzamb.-G", "1701340": "Zona Drago impedibl.", "1701350": "Bloccaffl.", "1701370": "Zona Acciaio bloccaffl.-G", "1701380": "Zona Terra bloccaffl.-G", "1701440": "Grandine impedibl.", "1701460": "Campoda. Veleno nemico bloccaffl.-G", "1701470": "Cerchia bloccaffl.-G", "1701480": "Campo colmabarra bloccaffl.-G", "1702010": "Avvelenam. {{value}}", "1702020": "Paralizzam. {{value}}", "1702030": "Addormentam. {{value}}", "1702060": "Confondim. {{value}}", "1702070": "Tentennam. {{value}}", "1702080": "Imprigionam. {{value}}", "1703020": "Guarigr. {{value}}", "1703030": "Toglimp.", "1703080": "Guarising. {{value}}", "1703090": "Alleaguarig. {{value}}", "1703150": "Mossa toglimp. {{value}}", "1703160": "Unimossa svincol.-G {{value}}", "1704060": "Resistimos. {{value}}", "1704070": "Confondimp. {{value}}", "1704100": "Impattoss. {{value}}", "1704110": "Macchiad. {{value}}", "1704130": "Tentennatt. {{value}}", "1704170": "Addormentimp. Unimossa", "1704190": "Congelimp. {{value}}", "1704210": "Prima Uniresist.-G", "1704220": "Iperavvel. {{value}}", "1704240": "Confondic. {{value}}", "1704260": "Mossarec. {{value}}", "1704300": "Mossarec.-G", "1704350": "Prep.mossa ipereff. {{value}}", "1704360": "Cambioviet. azzeracosto {{value}}", "1704380": "Cambioviet. curativo {{value}}", "1704570": "Attacco sparg. {{value}}", "1704580": "Annient. Iperefficace", "1704600": "Supereff. azzeracosto {{value}}", "1704620": "Voce ipersp. singola-G {{value}}", "1704640": "Supereff. iperefficace {{value}}", "1704650": "Mossa azzerac. {{value}}", "1704680": "Fatica statomossa ipersp. singola-G {{value}}", "1704740": "Confondiatt. {{value}}", "1704830": "Zona Coleot. curativa {{value}}", "1704840": "Mono curamos. iper singola-G {{value}}", "1704850": "Unimossa ipereffic. {{value}}", "1705010": "Attizzat. {{value}}", "1705020": "Imprigionap. {{value}}", "1705030": "Avvelenap. {{value}}", "1705050": "Bloccaff. duraturo {{value}}", "1705060": "Paralizzap. {{value}}", "1706130": "Alleasingolo iperspec. {{value}}", "1706140": "Avvelenatt. azzeracosto {{value}}", "1706170": "Attacco imprigion. {{value}}", "1706210": "Scottatt. ipersp. singolo {{value}}", "1706230": "Unimossa iperavv.-G {{value}}", "1706240": "Avvelenatt. ipereff. {{value}}", "1706260": "Primatt. frangiprot. Terra", "1706280": "Prima Unimossa ipereff.-G", "1706290": "Primatt. frangiprot. Acciaio", "1706310": "Primatt. frangiprot.", "1706320": "Mono voce bloccaff.-G {{value}}", "1706330": "Primavoce frangiprot. Buio-G", "1706390": "Tentennatt. zerobonus {{value}}", "1706420": "Tentennatt. ineludibile {{value}}", "1706450": "UniDynamax d'impatto frangiprot. Veleno-G {{value}}", "1706460": "Veleniss. alleato", "1706510": "Campod. Acciaio nemico att.zera {{value}}", "1706520": "Tensoatt. iperfisico triplo {{value}}", "1706550": "Rapidatt. iperfisico singolo {{value}}", "1706560": "Scottatt. iperefficace {{value}}", "1706590": "Reazione ipereff. {{value}}", "1706610": "Attacco spargivar. {{value}}", "1706620": "Reazione avvel. {{value}}", "1706630": "Congelatt. iperspeciale singolo {{value}}", "1706660": "Impacciatt. minore {{value}}", "1706670": "Primatt. frangiprot. Folletto", "1706710": "Campod. Buio nemico attaccazz. {{value}}", "1706720": "Paralizzatt. ipersp. singolo {{value}}", "1706740": "Primo Unimpatto frangiprot. Folletto", "1706760": "Avvelenatt. iperspeciale singolo {{value}}", "1706820": "Annient. iperspeciale doppio {{value}}", "1706850": "Primentrata prot. ↑  Erba {{value}}", "1706860": "Unimpatto paralizz.", "1706890": "UniDynamax d'impatto frangiprot. stessotipo-G {{value}}", "1706910": "Prima Unimossa iperspec.-G {{value}}", "1706920": "Alleamb. iperfisico singolo {{value}}", "1706940": "Impediatt. ipereff. {{value}}", "1706950": "Attacco ipersp. singolo {{value}}", "1706960": "Centrabers. iperfisico singolo {{value}}", "1706970": "Sabbiatt. iperfisico singolo {{value}}", "1707020": "Frangiprot. attacco azzeracosto {{value}}", "1707030": "Centrabers. tentenn. {{value}}", "1707110": "UniDynamax speciale ipersp. {{value}}", "1707120": "Cerchiatt. iperfisico singolo {{value}}", "1707160": "Auto alleacampo o tuttocampo ipersp. singolo {{value}}", "1707170": "Uso statomossa ipersp. singola {{value}}", "1707190": "Primentrata ipersp. {{value}}", "1707200": "Unimossa ipersp. doppia {{value}}", "1707250": "Attesa ipersp. doppia {{value}}", "1707260": "Alleacerchia ipersp. singola {{value}}", "1707270": "Attesa ipersp. singola {{value}}", "1707290": "Primo Unimpatto frangiprot. Drago {{value}}", "1707300": "Tentennatt. paralizzante {{value}}", "1707310": "Attacco baccon. e ipersp. triplo {{value}}", "1707330": "Mossa Unibonus quadr. {{value}}", "1707340": "Fiacc. iperfisica doppia {{value}}", "1707390": "Rapidatt. iperfisico singolo-G {{value}}", "1707400": "Entrata ipersp. {{value}}", "1707420": "Primattacco frangiprot. Erba", "1707450": "Prima baccazero ipersp. {{value}}", "1707460": "Primatt. frangiprot. Veleno", "1707530": "UniDynamax d'impatto impacc.-G {{value}}", "1707540": "Mossa di stato spargimp. {{value}}", "1707550": "UniDynamax d'impatto paralizz.-G {{value}}", "1707610": "Attacco baccons. e iperfisico singolo-G {{value}}", "1707630": "Zona Acciaio attaccaz. {{value}}", "1707650": "Centrab. ipersp. singolo {{value}}", "1707660": "Centrab. Unibonus singolo {{value}}", "1707670": "Autozona Volante ipersp. singola-G {{value}}", "1707690": "Alleameteo ipersp. doppio {{value}}", "1707740": "Uso Volere Psichico ipersp. singolo-G {{value}}", "1707750": "Reazione ipersp. singola {{value}}", "1707760": "UniDynamax d'impatto frangiprot. stessotipo {{value}}", "1707770": "Campod. Fuoco nemico attacco ipersp. singolo {{value}}", "1707800": "Pioggiatt. azzeracosto {{value}}", "1707810": "Campo Erboso attaccazz. {{value}}", "1707840": "Attacco solare azzerac. {{value}}", "1707880": "Sincrozero attacco fuorisincro ipersp. singolo {{value}}", "1707890": "Alleamossa ipereff. {{value}}", "1707900": "Zona Terra attaccaz. {{value}}", "1707910": "Mossa ipersp. doppia-G {{value}}", "1707950": "Pioggia centrabers. Unibonus singolo {{value}}", "1707970": "Reazione ipersp. singola-G {{value}}", "1708020": "Autoschi. azzeracosto {{value}}", "1708030": "Attaccampo Elettrico ipersp. singolo {{value}}", "1708050": "Vocezero attacco azzerac. {{value}}", "1708060": "Vocezero attacco ipersp. doppio {{value}}", "1708070": "Scottattacco alleato ipersp. singolo {{value}}", "1708090": "Scottatt. azzerac. {{value}}", "1708100": "Unimossa ipersp. singola-G {{value}}", "1708110": "Uso Volontà Acciaio ipersp. doppia {{value}}", "1708120": "Primentrata ipersp.-G {{value}}", "1708140": "Campod. Fuoco nemico attaccaz. {{value}}", "1708160": "Pioggiatt. ipersp. doppio {{value}}", "1708170": "Alleamb. ipersp. singolo-G {{value}}", "1708220": "Centrabers. iper singolo {{value}}", "1708230": "Primo ipersp. seipiù ipersp. {{value}}", "1708250": "Alleazona Coleottero ipersp. singola {{value}}", "1708260": "Unimossa ipersp. doppia-G {{value}}", "1708280": "Primo uso mossa ipersp.-G {{value}}", "1708290": "Primatt. frangiprot. Normale", "1708320": "Alleacer. iperfisica doppia {{value}}", "1708330": "Alleacer. Unibonus triplo {{value}}", "1708360": "Tentennem. attacco alleato iper singolo {{value}}", "1708370": "Reazione imprig. {{value}}", "1708430": "Uso statomossa ipersp. doppia {{value}}", "1708440": "Elioatt. alleato ipersp. singolo {{value}}", "1708450": "Tentennem. attacco alleato Unibonus doppio {{value}}", "1708470": "Mononemico attacco ipersp. singolo {{value}}", "1708480": "Alleacer. iperfisica singola-G {{value}}", "1708490": "Alleacer. azzeracosto {{value}}", "1708500": "Alleamb. iper singolo-G {{value}}", "1708560": "Primentrata Unibonus 1", "1708570": "Uso prima statomossa ipersp.-G {{value}}", "1708610": "Alleatt. accanito iper singolo {{value}}", "1708620": "Alleatt. accanito Unibonus doppio {{value}}", "1708630": "Primentr. frangiprot. Spettro-G {{value}}", "1708650": "Zona Spettro impacc. {{value}}", "1708660": "Impediat. azzeracosto {{value}}", "1708670": "Impediat. iper singolo {{value}}", "1708680": "Prima Unimossa frangiprot. Spettro-G {{value}}", "1708690": "Primentr. ipereff.-G", "1708700": "Attività Unibonus singola-G  {{value}}", "1708720": "Primentr. iper-G {{value}}", "1708730": "Primentr. Unibonus-G {{value}}", "1708770": "Supereff. impacc. minore {{value}}", "1708780": "Autozona Buio iperspe. singola-G {{value}}", "1708790": "Campod. Roccia nemico attacc. {{value}}", "1708800": "Voce ipersp. doppia {{value}}", "1708830": "Primentr. iperavv.-G", "1708840": "Primatt. iper {{value}}", "1708880": "Primatt. vulnerabilità speciale", "1708920": "Alleacerc. azzeracosto-G {{value}}", "1708940": "Uso prima statom. azzeracosto-G", "1708990": "Autocerchia di Pasio (difensiva) ipersp.-G {{value}}", "1709000": "Primatt. frangiprotezione Fuoco", "1801010": "Cocciut. {{value}}", "1801030": "Convinz. {{value}}", "1801060": "Scrutam. {{value}}", "1801070": "Antizav. {{value}}", "1801090": "Illuminaz. {{value}}", "1802100": "Scrollasabb.", "1803020": "Trasferib.", "1804040": "Probabilc. {{value}}", "1804220": "Impattorab. {{value}}", "1804250": "Compensatt. {{value}}", "1804290": "Migliorarg. {{value}}", "1804300": "Miglioratt.-G {{value}}", "1804340": "Prima difesemerg.-G {{value}}", "1804350": "Prima faticacc. {{value}}", "1804370": "Migliorten.-G {{value}}", "1804380": "Migliorel. {{value}}", "1804400": "Mossarg. {{value}}", "1804420": "Centrabers. rompidif. {{value}}", "1804520": "Migliorarg.-G {{value}}", "1804570": "Mossatt.-G {{value}}", "1804600": "Prima assaltem. {{value}}", "1804640": "Sconfortatt. {{value}}", "1804670": "Entrata sconfort.-G {{value}}", "1804720": "Migliorel.-G {{value}}", "1804730": "Mosselus.-G {{value}}", "1804740": "Cileccatt. {{value}}", "1804750": "Cileccarg. {{value}}", "1804800": "Annientatt. {{value}}", "1804810": "Entrata frastorn.-G {{value}}", "1804830": "Smorzatt. {{value}}", "1804860": "Mossarg.-G {{value}}", "1804900": "Intralciatt. {{value}}", "1804910": "Abbagliatt. {{value}}", "1804930": "Confusatt. rompidifesa {{value}}", "1804950": "Sconfortatt.-G {{value}}", "1804960": "Schermatt. {{value}}", "1804970": "Rallentatt. {{value}}", "1805030": "Furbacch. {{value}}", "1805080": "Entrata intralc.-G {{value}}", "1805110": "Entrata rompiguar.-G {{value}}", "1805120": "Supereff. colprob. {{value}}", "1805130": "Supereff. arguta {{value}}", "1807010": "Reazione assorbiatt. {{value}}", "1807020": "Assorbiran. {{value}}", "1807030": "Attacco assorbidif.{{value}}", "1807040": "Attacco assorbisag. {{value}}", "1807050": "Attacco assorbivel. {{value}}", "1807060": "Attacco assorbim. pentarand.-G {{value}}", "1807070": "Reazione assorbim. pentarand. {{value}}", "1807080": "Attacco assorbiatt. {{value}}", "1809050": "Mossa miglioran.-G {{value}}", "1809060": "Entrata miglioran. {{value}}", "1809070": "Prima sagacemer. {{value}}", "1809080": "Migliorten. {{value}}", "1809090": "Scacciabr. intralc. {{value}}", "1809100": "Reazione iperoff.-G {{value}}", "1809110": "Cileccatt.-G {{value}}", "1809140": "Entrata miglioran.-G {{value}}", "1809160": "Colpoffens. {{value}}", "1809210": "Pioggiatt. arguto {{value}}", "1809230": "Cileccagil. {{value}}", "1809330": "Entrata iperoff. {{value}}", "1809370": "Impatto disarm. {{value}}", "1809410": "Prima statomossa iperoff.-G {{value}}", "1809430": "Statomossa doppiob.", "1809460": "Schermatt.-G {{value}}", "1809480": "Entrata corazz. {{value}}", "1809550": "UniDynamax rallent.-G {{value}}", "1809560": "Cileccam.-G {{value}}", "1809570": "Cilecca iperoff.-G {{value}}", "1809590": "Statomossa frastorn.-G {{value}}", "1809670": "Impatto intralc.-G {{value}}", "1809680": "Impatto rallent.-G {{value}}", "1809700": "Annientam. offensivo {{value}}", "1809710": "Paralizzatt. pentamalus {{value}}", "1809720": "Attacco colprob.-G {{value}}", "1809800": "Voce incoraggiatt.-G {{value}}", "1809900": "Sabbiatt. imponente {{value}}", "1809910": "Uso prima statomos. pentaum.-G {{value}}", "1809920": "Impatto sconfort. {{value}}", "1809930": "Uso statomos. turbo-G {{value}}", "1809970": "Uso prima statomos. difensiva-G {{value}}", "1809980": "Uso prima statomos. sagace-G {{value}}", "1809990": "Uso prima statomos. iperdif.-G {{value}}", "1810010": "Prima Unimossa pentaum.-G {{value}}", "1810020": "Confusatt. peggiorand. {{value}}", "1810060": "Reazione rompidif. {{value}}", "1810070": "Reazione sconfort. {{value}}", "1810080": "Centrabers. colprob. {{value}}", "1810090": "Centrabers. rallent. {{value}}", "1810190": "Paralizzatt. rallentante {{value}}", "1810210": "Paralizzattacco colprob.-G {{value}}", "1810220": "Centrabers. fiaccante {{value}}", "1810270": "Voce corazzata doppiogr. {{value}}", "1810290": "Rallentatt. doppiogrado {{value}}", "1810300": "Supereff. rallentante doppiogrado {{value}}", "1810320": "Attacco Acqua rompidif. {{value}}", "1810330": "Attacco Coleottero sconfort. {{value}}", "1810340": "Attacco Coleottero frastorn. {{value}}", "1810350": "Scottimp. rompidif. {{value}}", "1810430": "Tecniche d'impatto frastorn. {{value}}", "1810440": "Tecniche d'impatto sconfort. {{value}}", "1810450": "Tecniche d'impatto rallent. {{value}}", "1810460": "Tecniche d'impatto intralc. {{value}}", "1810480": "Unimossa colprob.-G {{value}}", "1810510": "Uso statomossa difensiva doppiogr. {{value}}", "1810520": "Uso statomossa sagace doppiogr. {{value}}", "1810540": "Pioggia centrabers. sconfort. {{value}}", "1810550": "Cilecca iperdifens.-G {{value}}", "1810570": "Paralizzatt. disarmante {{value}}", "1810580": "Avvelenatt. disorientante {{value}}", "1810630": "Scottatt. angoscian. {{value}}", "1810660": "Avvelenatt. malus doppiogrado {{value}}", "1810680": "Avvelenatt. offensivo {{value}}", "1810690": "Avvelenatt. turbo {{value}}", "1810740": "Mossa bonus pentarand. {{value}}", "1810790": "Uso Desiderio Fatale miglior. unico doppiogrado-G", "1810800": "Impeto sconfort. doppiogrado {{value}}", "1810810": "Statomossa avv.malus ×{{value}}", "1810840": "Centrabers. agile {{value}}", "1810850": "Primafatica 60% iperoff.{{value}}", "1810880": "Scottatt. frastorn. {{value}}", "1810890": "Imprigionatt. sconfort. {{value}}", "1810900": "Attacco assorbisal. imponente {{value}}", "1810930": "Uso Desiderio Fatale miglior. unico-G", "1810940": "Uso statomossa migliorand. {{value}}", "1810950": "UniDynamax rompidif.-G {{value}}", "1810960": "Scottatt. imponente {{value}}", "1810970": "Imprigionatt. rallentante {{value}}", "1810980": "Attacco assorbisal. frastorn. {{value}}", "1811010": "Scottatt. fiaccante {{value}}", "1811020": "Paralizzatt. difese ↓ {{value}}", "1811040": "Avvelenatt. fiaccante {{value}}", "1811050": "Uso statomossa d'impatto sconfort. {{value}}", "1811060": "Attacco iperoff.-G {{value}}", "1811070": "Primo Unimpatto difese ↓ {{value}}", "1811080": "Impeto rompidif. {{value}}", "1811100": "Attacco turbo doppiogr.-G {{value}}", "1811110": "Avvelenatt. imponente & Paralizzatt. frastorn. {{value}}", "1811130": "Campod. Buio nemico attacco difese ↓ {{value}}", "1811140": "Campod. Buio nemico attacco turbo {{value}}", "1811170": "Imprigionatt. imponente {{value}}", "1811180": "Impatto disorient. {{value}}", "1811200": "Mossa iperoff.-G {{value}}", "1811220": "Tecniche d'impatto frastorn. doppiogrado {{value}}", "1811250": "Attacco accanito malus doppiogr. {{value}}", "1811270": "Centrabers. imponente {{value}}", "1811300": "Mossa iperoff. doppiogrado {{value}}", "1811320": "Attacco fisico rompidif. doppiogr. {{value}}", "1811330": "Attacco speciale sconfort. doppiogr. {{value}}", "1811350": "Uso statomossa frastorn.-G {{value}}", "1811360": "Attacco difese ↓ {{value}}", "1811370": "Unimpatto frastorn. {{value}}", "1811390": "Unimossa pentaum.-G {{value}}", "1811410": "Centrabers. miglior. doppiogr. {{value}}", "1811430": "Uso statomossa d'impatto rompidifesa doppiogr. {{value}}", "1811440": "Paralizzatt. rompidif. {{value}}", "1811450": "Reazione malus pentarandom doppiogr. {{value}}", "1811480": "Centrabers. sconfort. {{value}}", "1811510": "UniDynamax iperoff.-G {{value}}", "1811520": "Uso prima statomossa colproabile.-G {{value}}", "1811530": "Uso statomossa d'impatto imponente doppiogr. {{value}}", "1811550": "Cerchiatt. disorientante {{value}}", "1811580": "Vietacambio attacco bonus pentarand.-G {{value}}", "1811590": "Primavoce iperdif. {{value}}", "1811600": "Auto alleacampo o tuttocampo iperoff.-G {{value}}", "1811630": "UniDynamax d'impatto sconfort.-G {{value}}", "1811670": "Paralizzatt. sconfort. {{value}}", "1811680": "Reazione disorient.{{value}}", "1811700": "Vietacambio attacco disorient. {{value}}", "1811730": "Peggior. triplo {{value}}", "1811740": "Rapidatt. fiaccante doppiogr.{{value}}", "1811750": "Mossarguzia doppiogr. colprob. monogr. {{value}}", "1811780": "Entrata arguta quadr. colprob. {{value}}", "1811790": "Tecniche d'impatto rompidif. {{value}}", "1811800": "Primentr. ettamalus-G {{value}}", "1811810": "Grandinatt. sconfort. {{value}}", "1811830": "Autocerchia corazzata doppiogr.-G {{value}}", "1811840": "Primentrata iperdif. {{value}}", "1811850": "Attacco sconfort. doppiogr. {{value}}", "1811870": "Paralizzatt. imponente doppiogr. {{value}}", "1811880": "Reazione agile doppiogr.-G {{value}}", "1811890": "Uso statomossa iperdif. {{value}} ", "1811910": "Reazione rallentante doppiogr.{value}}", "1811920": "Attacco solare rompidif. {{value}}", "1811930": "UniDynamax d'impatto sconfort. {{value}}", "1811940": "Prima autocer. di Sinnoh (danni speciali) arguta {{value}}", "1811950": "Unimossa autorom. {{value}}", "1811960": "Mossa autorom. {{value}}", "1811980": "Paralizzatt. iperoff.-G {{value}}", "1811990": "Cilecca migliorandom doppiogr.-G {{value}}", "1812070": "Zona Folletto peggiorand. doppio {{value}}", "1812080": "Scottatt. malus doppiogr. {{value}}", "1812090": "Imprigionatt. rallentante doppiogr. {{value}}", "1812100": "Alleamb. bonus pentar. doppiogr.-G {{value}}", "1812110": "Voce unopiù attacco sconfort. {{value}}", "1812120": "Vocezero attacco malus doppiogr. {{value}}", "1812130": "Confusatt. guastamira {{value}}", "1812140": "Peggiorand. doppiogr. {{value}}", "1812150": "Scottatt. disorient. {{value}}", "1812160": "Smorzatt. doppiogr. {{value}}", "1812170": "Centrabers. turbo {{value}}", "1812180": "Attacco frastorn. quadr. {{value}}", "1812200": "Uso prima statomossa colprob. {{value}}", "1812210": "Attacco sconfort. triplogr. {{value}}", "1812220": "Alleatt. accanito fiacc. {{value}}", "1812240": "Reazione migliorand. unico doppiogr.-G {{value}}", "1812260": "Uso statomossa turbo sestupl. {{value}}", "1812270": "Elioatt. alleato turbo-G {{value}}", "1812280": "Imprigionatt. alleato miglior. {{value}}", "1812300": "Abbagliatt. triplogrado {{value}}", "1812310": "UniDynamax iperdif. {{value}}", "1812320": "Rompidif. solare {{value}}", "1812330": "Zona Lotta attacco sconfort. {{value}}", "1812340": "Autocer. di Unima (danni speciali) corazz. doppiogr.-G {{value}}", "1812350": "Attacco corazzato doppiogr.-G {{value}}", "1812360": "Primentr. ettaumento-G {{value}}", "1812380": "Scottatt. difese ↓  {{value}}", "1812390": "Autocer. di Unima (danni speciali) off. doppia-G {{value}}", "1812400": "Autocer. di Unima (danni speciali) arguta doppia-G {{value}}", "1812410": "UniTera. offensivo {{value}}", "1812420": "Pioggiatt. fiacc. doppiogr. {{value}}", "1812430": "Primo autocam. Roccia offensivo {{value}}", "1812440": "Primo autocam. Roccia colprob. {{value}}", "1812450": "Campod. Roccia nemico malus doppiogr. {{value}}", "1812460": "Mossa turboff.-G {{value}}", "1812470": "Scottatt. disarmante doppiogr. {{value}}", "1812480": "Avvelenatt. difese ↓  {{value}}", "1812490": "Attacco rompidif. sest. {{value}}", "1812500": "Attacco sconfort. sest. {{value}}", "1812510": "Alleacerchia turbo doppiogr.-G {{value}}", "1812550": "Attacco speciale ipersp. triplo {{value}}", "1812560": "Primentr. disorient.-G {{value}}", "1812570": "Attacco frastorn. doppiogr. {{value}}", "1812610": "Primentr. colprob. {{value}}", "1902040": "Entrata campo bloccapr.", "1902260": "Smorzad. fisico duraturo {{value}}", "1902270": "Smorzad. speciale duraturo {{value}}", "1902280": "Bloccaprob. duraturo {{value}}", "1902400": "Primentrata smorzad. fisico", "1902470": "Mossacampo smorzad. fisico {{value}}", "1902540": "Annientam. campo colmab. {{value}}", "1902560": "Primentrata smorzad. speciale", "1902610": "Campod. Buio nemico duraturo {{value}}", "1902680": "Cerchia Unima (fis) duratura {{value}}", "1902710": "Cerchia Kanto (spe) duratura {{value}}", "1902730": "Cerchia Johto (fis) duratura {{value}}", "1902750": "Autocampo bloccacolpi campo smorzad.", "1902790": "Cerchia Sinnoh (dif) duratura {{value}}", "1902850": "Cerchia Unima (dif) duratura {{value}}", "1902860": "Primatt. campo bloccabonus", "1902880": "Cerchia Galar (spe) duratura {{value}}", "1902930": "Cerchia Alola (spe) duratura {{value}}", "1902940": "Cerchia Alola (dif) duratura {{value}}", "1902960": "Cerchia Pasio (dif) duratura {{value}}", "1903080": "Campod. Veleno negato", "1903130": "Campodan. Roccia negato", "1903160": "Campod. Buio negato", "1903170": "Campod. Acciaio negato", "1904080": "Campod. Veleno ridotto {{value}}", "1904130": "Campodan. Roccia ridotto {{value}}", "1904160": "Campod. Buio ridotto {{value}}", "1904170": "Campod. Acciaio ridotto {{value}}", "1905020": "Gigafiamm. schiarita", "1905180": "Primentrata Campod. Veleno", "1905200": "Primatt. burrascoso", "1905220": "Reazione portasab. {{value}}", "1905260": "Primentrata Zona Coleott.", "1905380": "Autoschiar. Cerchia di Galar (difensiva)", "1905440": "Campod. Veleno nemico duraturo {{value}}", "1905720": "Primatt. Zona Volante EX", "1905730": "Smorzad. speciale primentrata e duraturo {{value}}", "1905740": "Primatt. Zona Spettro", "1905750": "Zona Spettro primatt. e duratura {{value}}", "1905760": "Unicampo smorzad. speciale", "1905770": "Autosch. Zona Lotta", "1905790": "Primentr. Cerchia di Unima (danni speciali)", "1905810": "Primatt. Zona Roccia", "1905820": "Primatt. Zona Drago", "1905840": "Primatt. Zona Veleno EX", "1905870": "Primatt. Campo Elettrico EX", "1905880": "Primatt. Zona Terra EX", "1905910": "Primatt. Cerchia di Paldea (difensiva)", "1905940": "Primentr. Cerchia di Hoenn (difensiva)", "1905950": "Campod. Roccia nemico duraturo {{value}}", "1905980": "Primentr. Zona Lotta", "1905990": "Primentr. Cerchia di Galar (difensiva)", "1906000": "Cerchia di Galar (dif.) primentr. e duratura {{value}}", "1906010": "Primentr. Cerchia di Sinnoh (danni speciali)", "1906020": "Cerchia di Sinnoh (danni speciali) primentr. e duratura {{value}}", "1906030": "Cerchia di Kanto (danni fisici) primentr. e duratura {{value}}", "1906040": "Primatt. Cerchia di Kanto (danni speciali)", "1906080": "Campo Psichico primatt. e duraturo {{value}}", "1906120": "Primentr. Cerchia di Pasio (difensiva)", "1906150": "Primatt. Zona Veleno", "1906170": "Primatt. schiarita", "1906180": "Primatt. schiarita & Solleone", "1906230": "Primatt. Zona Coleottero", "1906730": "Prima Sferapulsar S 0 Cerchia di Kalos (speciali)", "1906750": "Primo Spaccaroccia S 0 Cerchia di Kalos (fisici)", "2101080": "Campod. Veleno nemico barrier.-G ", "2101100": "Cerchia di Unima (danni speciali) barrierc.-G", "2201050": "Facileff. {{value}}", "2201060": "Affliggim. {{value}}", "2301040": "Schivasabb. corazzato", "2301090": "Fatica iperdif. {{value}}", "2301100": "Grandine iperdif.", "2301120": "Uso statomos. spargibonus {{value}}", "2301140": "UniDynamax diffuso ", "2801020": "Animo battagl.di Hoenn", "2801030": "Determ. di Hoenn", "2801070": "Determ. di Alola", "9901490": "Occasione perfetta " }, "ja": { "1101010": "初ピンチ時 HP回復{{value}}", "1101020": "HP回復量↑{{value}}", "1101030": "相手失敗時 HP回復{{value}}", "1101040": "技後 HP回復{{value}}", "1101050": "瀕死時 味方HP 中回復{{value}}", "1101060": "B技後 HP中回復{{value}}", "1101070": "B技後 HP中回復G{{value}}", "1101080": "味方に 技後 HP中回復{{value}}", "1101090": "防御成功時 HP回復{{value}}", "1101100": "攻撃時 HP回復G{{value}}", "1101110": "被攻撃時 HP回復G{{value}}", "1101120": "抜群時 HP回復{{value}}", "1101130": "技急所時 HP回復{{value}}", "1101140": "抜群時 HP回復G{{value}}", "1101150": "初ピンチ時 HP全回復", "1101160": "回復技後 HP中回復G{{value}}", "1101170": "晴れ時 技使用時 HP回復G{{value}}", "1101180": "晴時 技使用時 HP回復{{value}}", "1101190": "闘Z時 被攻撃時 HP回復G{{value}}", "1101200": "技使用時 HP回復{{value}}", "1101220": "命中時 HP回復{{value}}", "1101230": "闘Z時 被攻撃時 HP回復{{value}}", "1101240": "悪Z時 技使用時 HP回復G{{value}}", "1101250": "BD技後 HP回復{{value}}", "1101260": "初HP半減時 HP回復{{value}}", "1101270": "初B技後 HP中回復G{{value}}", "1101290": "被攻撃時 HP回復{{value}}", "1101300": "闘Z時 HP回復{{value}}", "1101310": "混乱相手 攻撃時 HP回復{{value}}", "1101320": "異常相手 攻撃時 HP回復G{{value}}", "1101330": "GF時技後 HP回復G{{value}}", "1101340": "初HP60%時 HP回復{{value}}", "1101350": "麻痺相手 攻撃時 HP回復{{value}}", "1101360": "攻撃時 HP中回復{{value}}", "1101370": "無Z時 HP回復{{value}}", "1101380": "初P変化技 使用時 HP回復{{value}}", "1101390": "攻撃時 HP回復{{value}}", "1101400": "T技後 HP中回復{{value}}", "1101410": "毒Z時 HP回復{{value}}", "1101420": "氷Z時 技使用時 HP回復G{{value}}", "1101430": "初B技後 HP中回復{{value}}", "1101440": "C時 HP回復{{value}}", "1101450": "妨害状態相手 攻撃時 HP回復{{value}}", "1101460": "ピンチ時 火傷時 攻撃時 HP中回復{{value}}", "1101470": "毒相手 攻撃時 HP回復{{value}}", "1101480": "回復技後 HP回復{{value}}", "1101490": "飛Z時 HP回復{{value}}", "1101500": "麻痺相手 攻撃時 HP回復G{{value}}", "1101520": "BD技後 HP回復G{{value}}", "1101530": "初B技 被攻撃時 HP回復G{{value}}", "1101540": "拘束相手 味方攻撃時 HP回復{{value}}", "1101550": "チーム B技後 HP回復G{{value}}", "1101560": "HP半減時 自己再生 回数消費 & HP回復5", "1101570": "無Z時 被攻撃時 HP回復G{{value}}", "1101580": "無Z時 B技 被攻撃時 HP回復{{value}}", "1101590": "P技B技 被攻撃時 HP半減時 きのみ消費 & HP回復{{value}}", "1101600": "チーム B技後 HP回復{{value}}", "1101610": "P技後 HP回復G{{value}}", "1101620": "氷Z時 HP回復{{value}}", "1101630": "龍Z時 HP回復{{value}}", "1101640": "HP回復量0", "1201010": "雨時 ゲージ加速{{value}}", "1201020": "晴れ時 ゲージ加速{{value}}", "1201030": "異常時 ゲージ加速{{value}}", "1201040": "砂嵐時 ゲージ加速{{value}}", "1201050": "霰時 ゲージ加速{{value}}", "1201060": "EF時 ゲージ加速{{value}}", "1201070": "PF時 ゲージ加速{{value}}", "1201080": "初登場時 ゲージ加速", "1201090": "龍Z時 ゲージ加速{{value}}", "1201100": "飛Z時 ゲージ加速{{value}}", "1201110": "W変化時 ゲージ加速{{value}}", "1201120": "悪Z時 ゲージ加速{{value}}", "1201130": "鋼Z時 ゲージ加速{{value}}", "1201140": "霊Z時 ゲージ加速{{value}}", "1201150": "虫Z時 ゲージ加速{{value}}", "1201160": "GF時 ゲージ加速{{value}}", "1201170": "闘Z時 技ゲージ加速{{value}}", "1201180": "妖Z時 ゲージ加速{{value}}", "1201190": "毒Z時 ゲージ加速{{value}}", "1201200": "岩Z時 ゲージ加速{{value}}", "1201210": "場対象時 技ゲージ加速{{value}}", "1201220": "無Z時 技ゲージ加速{{value}}", "1201230": "氷Z時 ゲージ加速{{value}}", "1201240": "C時 ゲージ加速{{value}}", "1201250": "WFZ 変化時 ゲージ加速{{value}}", "1202010": "技後 ゲージ↑{{value}}", "1202020": "B技後 ゲージ↑{{value}}", "1202030": "初ピンチ時 ゲージ↑{{value}}", "1202040": "被攻撃時 ゲージ↑{{value}}", "1202050": "B技後 ゲージ↑G{{value}}", "1202060": "技後 ゲージ↑G{{value}}", "1202080": "他者瀕死時 ゲージ↑{{value}}", "1202090": "相手失敗時 ゲージ↑{{value}}", "1202100": "攻撃時 ゲージ↑{{value}}", "1202110": "P技後 ゲージ↑{{value}}", "1202120": "技急所時 ゲージ↑{{value}}", "1202130": "急所時 ゲージ↑{{value}}", "1202140": "防御成功時 ゲージ↑{{value}}", "1202150": "P変化技 使用時 ゲージ↑{{value}}", "1202160": "とどめ時 ゲージ↑{{value}}", "1202170": "失敗時 ゲージ↑{{value}}", "1202180": "シャドーダイブ後 ゲージ↑{{value}}", "1202190": "命中時 ゲージ↑{{value}}", "1202200": "混乱相手 攻撃時 技ゲージ2↑{{value}}", "1202210": "回避不可相手 攻撃時 技ゲージ↑{{value}}", "1202220": "PF時技後 技ゲージ↑{{value}}", "1202230": "火傷時 攻撃時 ゲージ2↑{{value}}", "1202240": "雨時 命中時 技ゲージ↑{{value}}", "1202250": "交代禁止 相手 攻撃時 ゲージ2↑{{value}}", "1202260": "混乱相手 味方攻撃時 ゲージ2↑{{value}}", "1202270": "混乱相手 味方攻撃時 ゲージ↑{{value}}", "1202280": "混乱相手 攻撃時 ゲージ↑{{value}}", "1202290": "毒相手 攻撃時 ゲージ↑{{value}}", "1301010": "ピンチ時 威力↑{{value}}", "1301020": "砂嵐時 威力↑{{value}}", "1301030": "異常時 威力↑{{value}}", "1301040": "抜群時 威力↑{{value}}", "1301050": "技ゲージ分 威力↑{{value}}", "1301060": "急所時 威力↑{{value}}", "1301070": "IC時 威力↑{{value}}", "1301090": "W変化時 威力↑{{value}}", "1301100": "HP分 威力↑{{value}}", "1301110": "晴れ時 威力↑{{value}}", "1301120": "相手 麻痺時 威力↑{{value}}", "1301130": "相手 火傷時 威力↑{{value}}", "1301140": "霰時 威力↑{{value}}", "1301150": "相手 凍り時 威力↑{{value}}", "1301160": "雨時 威力↑{{value}}", "1301170": "混乱時 威力↑{{value}}", "1301180": "相手 混乱時 威力↑{{value}}", "1301190": "相手 特攻↓分 威力↑", "1301200": "相手 HP分 威力↑{{value}}", "1301210": "相手 異常時 威力↑{{value}}", "1301220": "相手 妨害時 威力↑{{value}}", "1301230": "素早さ↑分 威力↑", "1301240": "防御↑分 威力↑", "1301250": "相手 怯み時 威力↑{{value}}", "1301260": "相手 眠り時 威力↑{{value}}", "1301270": "相手 毒時 威力↑{{value}}", "1301280": "相手 拘束時 威力↑{{value}}", "1301300": "相手 命中↓分 威力↑", "1301310": "特防↑分 威力↑", "1301320": "相手 素早さ↓分 威力↑", "1301330": "回避↑分 威力↑", "1301340": "攻撃↑分 威力↑", "1301350": "命中↑分 威力↑", "1301360": "HP低下分 威力↑{{value}}", "1301370": "EF時 威力↑{{value}}", "1301380": "相手 防御↓分 威力↑", "1301390": "相手 特防↓分 威力↑", "1301400": "相手 回避率↓分 威力↑", "1301410": "相手 攻撃↓分 威力↑", "1301420": "相手 能力↓分 威力↑", "1301430": "悪技威力↑{{value}}", "1301440": "妖技威力↑{{value}}", "1301450": "ゲージ 消費増 威力↑{{value}}", "1301470": "模様別 威力↑", "1301480": "相手 交代禁止時 威力↑{{value}}", "1301490": "特攻↑分 威力↑", "1301500": "無傷登場時 次回抜群↑", "1301510": "交代禁止時 威力↑{{value}}", "1301520": "晴れ時 ゲージ加速 威力↑{{value}}", "1301530": "雨時 ゲージ加速 威力↑{{value}}", "1301540": "無傷時 威力↑{{value}}", "1301550": "素早さ↓時 威力↑{{value}}", "1301560": "砂無効 & 威力↑{{value}}", "1301570": "能力↑分 威力↑", "1301580": "W通常時 威力↑{{value}}", "1301590": "P技ゲージ 消費量 減少{{value}}", "1301600": "アイスフェイス時 抜群時 威力↑{{value}}", "1301610": "PF時 威力↑{{value}}", "1301620": "龍Z時 威力↑{{value}}", "1301630": "W変化時 P技B技 威力↑{{value}}", "1301640": "P技B技 抜群時 威力↑{{value}}", "1301650": "相手 交代禁止時 P技B技 威力↑{{value}}", "1301670": "相手 特攻特防↓分 威力↑", "1301680": "悪Z時 威力↑{{value}}", "1301690": "霊Z時 威力↑{{value}}", "1301700": "相手 混乱時 P技B技 威力↑{{value}}", "1301710": "P技B技BD技 抜群時 威力↑{{value}}", "1301720": "超威力↑{{value}}", "1301730": "相手 能力非↑時 威力↑{{value}}", "1301740": "相手 素早さ↓時 威力↑{{value}}", "1301750": "相手 命中↓時 威力↑{{value}}", "1301760": "地Z時 威力↑{{value}}", "1301770": "鋼Z時 威力↑{{value}}", "1301780": "相手 岩ダメ場時 威力↑{{value}}", "1301790": "反動技 威力↑{{value}}", "1301800": "妖Z時 威力↑{{value}}", "1301810": "虫Z時 威力↑{{value}}", "1301820": "相手 麻痺時 P技B技↑{{value}}", "1301830": "攻撃↑時 威力↑{{value}}", "1301840": "特攻↑時 威力↑{{value}}", "1301850": "GF時 威力↑{{value}}", "1301860": "相手 火傷時 P技B技↑{{value}}", "1301870": "飛Z時 威力↑{{value}}", "1301880": "HP減少時 威力↑{{value}}", "1301890": "EF時 威力↑G{{value}}", "1301900": "PF時 威力↑G{{value}}", "1301910": "相手 拘束時 P技B技↑{{value}}", "1301920": "ヒスイ に 流れる 時間", "1301930": "ヒスイ に 広がる 空間", "1301940": "素早さ↑時 威力↑{{value}}", "1301950": "防御↑時 威力↑{{value}}", "1301960": "特防↑時 威力↑{{value}}", "1301970": "相手 拘束時 威力↑G{{value}}", "1301980": "霰時 P技B技↑{{value}}", "1301990": "相手 悪ダメ場時 威力↑{{value}}", "1302010": "物理軽減{{value}}", "1302020": "ピンチ時 物理 軽減{{value}}", "1302030": "雨時 攻撃技 軽減{{value}}", "1302040": "反動 軽減{{value}}", "1302050": "特殊 軽減{{value}}", "1302060": "EF時 攻撃技 軽減{{value}}", "1302070": "無傷時 攻撃技 軽減{{value}}", "1302080": "無傷時 P技B技 軽減{{value}}", "1302090": "ピンチ時 特殊 軽減{{value}}", "1302100": "PF時 攻撃技 軽減{{value}}", "1302110": "飛Z時 攻撃技 軽減{{value}}", "1302120": "砂嵐時 攻撃技 軽減{{value}}", "1302130": "晴れ時 攻撃技 軽減{{value}}", "1302140": "GF時 攻撃技 軽減{{value}}", "1302150": "待機中 P技B技 軽減{{value}}", "1302160": "鋼Z時 攻撃技 軽減{{value}}", "1302170": "闘Z時 攻撃技 軽減{{value}}", "1302180": "妖Z時 特殊軽減G{{value}}", "1302190": "GF時 物理軽減G{{value}}", "1302200": "霰時 攻撃技 軽減{{value}}", "1302210": "悪Z時 攻撃技 軽減{{value}}", "1302220": "虫Z時 攻撃技 軽減G{{value}}", "1302230": "龍Z時 攻撃技 軽減{{value}}", "1302240": "C時 攻撃技 軽減{{value}}", "1302250": "砂嵐時 特殊軽減G{{value}}", "1302260": "妖Z時 攻撃技 軽減G{{value}}", "1302270": "地Z時 攻撃技 軽減{{value}}", "1302280": "霰時 物理軽減G{{value}}", "1302290": "岩Z時 物理 軽減G{{value}}", "1302300": "岩Z時 特殊 軽減G{{value}}", "1302310": "相手 悪ダメ場時 攻撃技 軽減G{{value}}", "1302320": "相手 抵抗↓時 攻撃技 軽減G{{value}}", "1302330": "氷Z時 特殊 軽減G{{value}}", "1302340": "晴れ時 特殊 軽減G{{value}}", "1302350": "相手 毒時 P技B技 軽減G{{value}}", "1302360": "抜群被攻撃時 P技B技軽減G{{value}}", "1302370": "物理 ダメージ 軽減G{{value}}", "1302380": "味方の場 効果 対象時 攻撃技 軽減G{{value}}", "1302390": "GF時 攻撃技 軽減G{{value}}", "1302400": "ゲージ加速時 P技B技 軽減G{{value}}", "1302410": "抜群 被攻撃時 P技B技 軽減{{value}}", "1302420": "EX晴時 水軽減{{value}}", "1302430": "EX雨時 炎軽減{{value}}", "1302440": "ゲージ加速時 攻撃技 軽減{{value}}", "1302450": "晴れ時 攻撃技 軽減G{{value}}", "1302460": "妖Z時 攻撃技 軽減{{value}}", "1303020": "連続技 回数最大化", "1303030": "晴れ時 必中化", "1303040": "連続技回数 3回以上化", "1303050": "必中化 & P技B技 急所化", "1303060": "破壊光線 必中化", "1303070": "必中化 & 反動ダメ無効", "1305010": "妖チェンジ", "1305020": "飛チェンジ", "1305030": "水チェンジ", "1305040": "炎チェンジ", "1305050": "電チェンジ", "1305060": "草チェンジ", "1305070": "岩チェンジ", "1305080": "地チェンジ", "1305090": "超チェンジ", "1305100": "虫チェンジ", "1305110": "氷チェンジ", "1305120": "悪チェンジ", "1305130": "鋼チェンジ", "1305140": "霊チェンジ", "1305150": "毒チェンジ", "1305160": "闘チェンジ", "1305170": "龍チェンジ", "1306020": "技後 回数回復{{value}}", "1306030": "攻撃時 速攻回数 回復{{value}}", "1306040": "P技後 回数回復{{value}}", "1306050": "急所時 回数回復{{value}}", "1306060": "火傷相手 攻撃時 速攻回数 回復{{value}}", "1306070": "P技B技後 技回数回復{{value}}", "1306080": "技後 P技回数回復{{value}}", "1306100": "異常相手 攻撃時 技回数回復{{value}}", "1306110": "初B技後 S技 回数回復{{value}}", "1306120": "速攻技後 T技回数回復{{value}}", "1306130": "HP半減時 一度 技回数回復{{value}}", "1306140": "B技後 きのみ 回数 回復{{value}}", "1306150": "チームB技後 S技 回数回復{{value}}", "1306160": "S技後 T技回数回復{{value}}", "1306170": "初B技後 きのみ 回数回復{{value}}", "1306180": "初B技後 P変化技 回数回復{{value}}", "1306190": "初EF使用時 S技 回数回復{{value}}", "1306200": "攻撃時 一度 P変化技 回数回復{{value}}", "1306210": "初きのみ0時 回数回復{{value}}", "1306220": "攻撃時 きのみ 回数回復{{value}}", "1306230": "B技後 S技 回数回復{{value}}", "1306240": "祟り目後 S技回数 32回復", "1306250": "B技後 S技回数 50回復{{value}}", "1306260": "攻撃時 S技回数 32回復{{value}}", "1306270": "イッシュの分析 使用時 S技 回数回復{{value}}", "1306280": "被攻撃時 きのみ 回数 回復{{value}}", "1306290": "初P変化技 使用時 S技回数回復{{value}}", "1306300": "初カントーの 分析0 時技回数回復{{value}}", "1306310": "おてんば人魚の 底力", "1306320": "初B技後 バツグン↑ 回数回復{{value}}", "1306330": "初ミニキズぐすりG0 時技回数回復{{value}}", "1307010": "反動無効 9", "1307020": "反動ダメージ 無効{{value}}", "1307030": "初HP10%時耐久", "1308010": "毒Z時 威力↑{{value}}", "1308020": "イッシュC 物理時 威力↑{{value}}", "1308030": "相手 麻痺時 威力↑G{{value}}", "1308040": "WFZ 変化時 威力↑G{{value}}", "1308050": "岩Z時 威力↑{{value}}", "1308060": "非抜群時 威力↑{{value}}", "1308070": "霰時 威力↑G{{value}}", "1308080": "砂嵐時 P技B技↑{{value}}", "1308090": "パシオC 防御時 P技B技↑G{{value}}", "1308100": "晴れ時 威力↑G{{value}}", "1308110": "味方 素早さ↑時 威力↑{{value}}", "1308120": "相手 悪ダメ場時 威力↑G{{value}}", "1308130": "防御↑時 P技B技↑{{value}}", "1308140": "相手 毒時 威力↑G{{value}}", "1308150": "相手 妨害状態時 威力↑G{{value}}", "1308160": "W変化時 威力↑G{{value}}", "1308170": "相手 能力非↑時 威力↑G{{value}}", "1308180": "パルデアC 防御時 威力↑G{{value}}", "1308190": "相手 異常時 威力↑G{{value}}", "1308200": "イッシュC 防御時 威力↑G{{value}}", "1308210": "相手 毒ダメ場 時威力↑G{{value}}", "1308220": "相手 眠り時 威力↑G{{value}}", "1308230": "相手 混乱時 威力↑G{{value}}", "1308240": "相手 火傷時 威力↑G{{value}}", "1308250": "妖Z時 威力↑G{{value}}", "1308260": "砂嵐時 威力↑G{{value}}", "1308270": "相手 素早さ↓時 P技 B技 BD技 ↑G{{value}}", "1308280": "晴れ時 P技B技↑G{{value}}", "1308290": "じしん 威力↑{{value}}", "1308300": "相手 能力↓時威力↑{{value}}", "1308310": "晴時 地面↑G{{value}}", "1308320": "氷Z時 威力↑{{value}}", "1308330": "相手異常時 祟り目 威力2倍", "1308350": "相手 抵抗↓時 P技B技↑{{value}}", "1308360": "味方 急所時 威力↑{{value}}", "1308370": "龍Z時 威力↑G{{value}}", "1308380": "破壊光線 威力↑{{value}}", "1308390": "HP半分 以上時 B技↑{{value}}", "1308400": "闘Z時 威力↑G{{value}}", "1308410": "インファ 威力↑{{value}}", "1308420": "イッシュC 特殊時 威力↑G{{value}}", "1308430": "龍Z時 P技B技↑{{value}}", "1308440": "晴時 10万馬力き 威力2倍", "1308450": "相手 岩ダメ場時 威力↑G{{value}}", "1308460": "冷凍 ビーム 威力2倍", "1308470": "毒Z時 威力↑G{{value}}", "1308480": "F時 P技B技↑{{value}}", "1308490": "ジョウトC 防御時 威力↑G{{value}}", "1308500": "能力↑分 威力↑G", "1308510": "岩Z時 P技B技↑{{value}}", "1308520": "地Z時 P技B技↑{{value}}", "1308530": "初B技使用時 B技{{plus}}倍", "1308540": "草 威力↑G{{value}}", "1308550": "龍 威力↑G{{value}}", "1308560": "無Z時 威力↑G{{value}}", "1308580": "無Z時 威力↑{{value}}", "1308590": "相手 防御↓時 威力↑{{value}}", "1308600": "ボルテージ↑分 威力↑", "1401010": "瀕死時 爆発", "1401020": "眠り相手 P技後 追加ダメージ", "1401030": "P技後 霊特殊追加ダメージ", "1401040": "P技2回使用時 はめつのねがい", "1501010": "初登場時 BC加速{{value}}", "1501020": "技急所時 BC加速{{value}}", "1501030": "初B技後 BC加速{{value}}", "1501040": "ピンチ時 BC加速G{{value}}", "1501050": "登場時 BC加速{{value}}", "1501060": "技後 BC加速{{value}}", "1501070": "被攻撃時 BC加速{{value}}", "1501080": "ピンチ時 BC加速{{value}}", "1501090": "相手失敗時 BC加速{{value}}", "1501100": "防御成功時 BC加速{{value}}", "1501110": "交代禁止相手 攻撃時 BC加速{{value}}", "1501120": "P技後 BC加速{{value}}", "1501130": "抜群時 BC加速{{value}}", "1501140": "急所時 BC加速{{value}}", "1501150": "晴れ時 技後 BC加速{{value}}", "1501160": "雨時 技後 BC加速{{value}}", "1501170": "BD技後 BC加速{{value}}", "1501180": "反撃時 BC加速{{value}}", "1501190": "HP半減時 BC加速{{value}}", "1501200": "初P変化技 使用時 BC加速{{value}}", "1501210": "初ピンチ時 BC加速{{value}}", "1501220": "待機攻撃時 BC加速{{value}}", "1501230": "待機攻撃時 BC2加速{{value}}", "1501240": "初技後 BC加速{{value}}", "1501250": "初防御成功時 BC加速{{value}}", "1501290": "HP60%時 一度BC加速{{value}}", "1501300": "速攻技後 BC2加速{{value}}", "1501310": "速攻技後 BC加速{{value}}", "1501320": "T技後 BC加速{{value}}", "1501330": "初きのみ0時 BC加速{{value}}", "1501340": "P変化技 使用時 BC加速{{value}}", "1501350": "龍願 使用時 BC加速{{value}}", "1501360": "初Ｔ技後 BC加速{{value}}", "1501370": "悪願 使用時 BC加速{{value}}", "1501380": "飛願 使用時 BC加速{{value}}", "1501390": "初EF使用時 BC加速{{value}}", "1501400": "初シンオウC 特殊 発生時 BC加速{{value}}", "1501410": "地願 使用時 BC加速{{value}}", "1501420": "初P変化技0時 BC加速{{value}}", "1501430": "鋼願 使用時 BC加速{{value}}", "1501440": "初パルデア の結束: BC加速{{value}}", "1501450": "初登場時 &初B技後 BC加速{{value}}", "1501460": "初物理⇑6 以上時 BC加速{{value}}", "1501470": "闘願 使用時 BC加速{{value}}", "1501480": "Bテラスタル時B C加速{{value}}", "1501490": "イッシュの情熱 使用時 BC加速{{value}}", "1501500": "瀕死時 BC加速{{value}}", "1501510": "自身 カントーC 特殊 発生時 BC加速{{value}}", "1501520": "登場時 BC加速{{value}}", "1501530": "初登場時 BC加速 & 特攻1↑", "1501540": "初登場時 BC2加速 & 急所率1↑", "1501550": "初登場時 BC3加速 & 無Z化", "1501560": "テラスタルエ ネルギーの 増幅", "1501570": "初霊の 願い0時 BC加速{{value}}", "1501580": "初カントーの 分析0時 BC加速{{value}}", "1501590": "自身 サークル 発生時 BC加速{{value}}", "1501600": "自身 鋼Z 発生時 BC加速{{value}}", "1502010": "B技後 BC上限 減少{{value}}", "1601020": "B技後 晴れ化", "1601030": "B技 抜群時 威力↑{{value}}", "1601040": "晴れ時 B技威力↑{{value}}", "1601050": "素早さ↑分 B技威力↑", "1601060": "攻撃↑分 B技威力↑", "1601070": "回避↑分 B技威力↑", "1601080": "B技 急所時 威力↑{{value}}", "1601090": "霰時 B技威力↑{{value}}", "1601100": "相手 麻痺時 B技威力↑{{value}}", "1601110": "相手 混乱時 B技威力↑{{value}}", "1601120": "雨時 B技 威力↑{{value}}", "1601130": "相手 素早さ↓分 B技↑", "1601140": "B技後 霰化", "1601150": "相手 攻撃↓分 B技威力↑", "1601160": "相手 特防↓分 B技威力↑", "1601170": "相手 眠り時 B技威力↑{{value}}", "1601180": "砂嵐時 B技威力↑{{value}}", "1601190": "B技後 砂嵐化", "1601200": "相手 凍り時 B技威力↑{{value}}", "1601210": "相手 怯み時 B技威力↑{{value}}", "1601220": "相手 防御↓分 B技威力↑", "1601230": "EF時 B技 威力↑{{value}}", "1601240": "能力↑分 B技威力↑", "1601250": "相手 命中↓分 B技↑", "1601260": "ピンチ時 B技威力↑{{value}}", "1601270": "初B技後 タイプ 変化", "1601280": "相手 特攻↓分 B技威力↑", "1601290": "相手 火傷時 B技↑{{value}}", "1601300": "相手 交代禁止時 B技威力↑{{value}}", "1601310": "W変化時 B技威力↑{{value}}", "1601320": "相手 攻撃↓時 B技↑{{value}}", "1601330": "特攻↑時 B技威力↑{{value}}", "1601340": "W通常時 B技威力↑{{value}}", "1601350": "相手 毒時 B技威力↑{{value}}", "1601360": "相手 回避↓分 B技威力↑", "1601370": "技ゲージ分 B技威力↑", "1601380": "防御↑分 B技威力↑", "1601390": "特防↑分 B技威力↑", "1601400": "相手 麻痺時 BD技↑{{value}}", "1601410": "龍Z時 B技威力↑{{value}}", "1601420": "相手 能力↓分 B技威力↑", "1601430": "鋼Z時 B技威力↑{{value}}", "1601440": "特攻↑分 B技威力↑", "1601450": "相手 妨害時 B技↑{{value}}", "1601460": "BD技 抜群時 威力↑{{value}}", "1601470": "命中↑時 B技↑{{value}}", "1601480": "攻撃↑時 B技↑{{value}}", "1601490": "防御↑時 B技↑{{value}}", "1601500": "相手 拘束時 B技威力↑{{value}}", "1601510": "B技急所化", "1601520": "相手 命中↓時 B技↑{{value}}", "1601540": "攻撃↑時 BD技威力↑{{value}}", "1601550": "相手 特攻↓時 B技↑{{value}}", "1601560": "相手 異常時 B技威力↑{{value}}", "1601570": "F変化時 B技威力↑{{value}}", "1601580": "素早さ↑時 B技威力↑{{value}}", "1601590": "特防↑時 B技威力↑{{value}}", "1601600": "HP減少時 B技威力↑{{value}}", "1601610": "回避率↑時 B技威力↑{{value}}", "1601620": "相手 素早さ↓時 B技↑{{value}}", "1601630": "相手 能力非↑時 B技↑{{value}}", "1601640": "妖Z時 B技威力↑{{value}}", "1601650": "鋼ダメ場時 B技威力↑{{value}}", "1601660": "B技 威力↑G{{value}}", "1601670": "相手 抵抗↓時 B技↑{{value}}", "1601680": "悪Z時 B技威力↑{{value}}", "1601690": "GF時 B技威力↑{{value}}", "1601700": "毒Z時 B技威力↑{{value}}", "1601710": "イッシュC 物理時 B技 威力↑{{value}}", "1601720": "異常時 B技 威力↑{{value}}", "1601730": "C時 B技↑G{{value}}", "1601740": "ジョウトC 物理時 B技 威力↑{{value}}", "1601750": "岩Z時 B技威力↑{{value}}", "1601760": "イッシュC 防御時 B技 威力↑{{value}}", "1601770": "相手 抵抗↓時 威力↑G{{value}}", "1601780": "相手 毒時 BD技↑{{value}}", "1601790": "パルデアC 物理時 B技 威力↑{{value}}", "1601800": "アローラC 特殊時 B技 威力↑{{value}}", "1601810": "相手 特防↓時 B技↑{{value}}", "1601820": "飛Z時 B技威力↑{{value}}", "1601830": "相手 拘束時 B技↑G{{value}}", "1601840": "無Z時 B技↑{{value}}", "1601850": "霰時 B技威力 ↑G{{value}}", "1601860": "パルデアC 防御時 B技↑G{{value}}", "1601870": "きのみ0時 B技↑{{value}}", "1601880": "イッシュC 防御時 B技↑G{{value}}", "1601890": "PF時 B技 威力↑{{value}}", "1601900": "特攻↑時 BD技 威力↑{{value}}", "1601910": "相手 交代禁止時 B技↑G{{value}}", "1601920": "相手 交代禁止時 威力↑G{{value}}", "1601930": "地Z時 B技↑{{value}}", "1601940": "相手 毒ダメ場 時B技↑G{{value}}", "1601950": "相手 能力↓時 B技↑{{value}}", "1601960": "氷Z時 B技↑{{value}}", "1601970": "シンオウC 特殊時 B技↑G{{value}}", "1601980": "無Z時 B技↑G{{value}}", "1601990": "雨時 B技威力↑G{{value}}", "1602010": "初B技後 技回数回復{{value}}", "1602020": "B技後 速攻回数 回復{{value}}", "1602030": "初B技後 回復回数 回復{{value}}", "1602040": "B技後 P技回数回復{{value}}", "1602050": "B技後 一度 P技回数回復{{value}}", "1602060": "初B技後 T技回数回復{{value}}", "1602070": "初B技後 速攻回数 回復{{value}}", "1602080": "ピンチ時 一度 速攻 回数回復{{value}}", "1602090": "B技後 T技 回数回復{{value}}", "1602100": "BD技後 S技 回数回復{{value}}", "1602110": "BD技後 P変化技 回数回復{{value}}", "1602120": "初技後 技回数回復{{value}}", "1602130": "チーム B技後 ワイガ 回数回復{{value}}", "1602140": "初P変化技 使用時 トーチカ 回数回復{{value}}", "1602150": "BD技後 バツグン↑ 回数回復{{value}}", "1603010": "雨時 BD技威力↑{{value}}", "1603020": "ゲージ加速時 B技↑G{{value}}", "1603030": "ゲージ加速時 B技↑{{value}}", "1603040": "虫Z時 B技↑G{{value}}", "1603050": "C時 B技威力↑{{value}}", "1603060": "味方 素早さ↑時 B技↑{{value}}", "1603070": "WFZ 変化時 B技↑G{{value}}", "1603080": "闘Z時 B技↑{{value}}", "1603090": "晴れ時 B技 BD技 ↑{{value}}", "1603100": "相手 岩ダメ場時 B技↑G{{value}}", "1603110": "F時 B技↑{{value}}", "1603120": "闘Z時 B技↑G{{value}}", "1603130": "ジョウトC 特殊時B技↑G{{value}}", "1603140": "相手 抵抗↓時 B技↑G{{value}}", "1603150": "GF時 BD技 威力↑{{value}}", "1603160": "悪Z時 B技↑G{{value}}", "1603180": "パルデアC 物理時 威力↑G{{value}}", "1701010": "毒無効", "1701020": "火傷無効", "1701030": "麻痺無効", "1701040": "凍り無効", "1701050": "霰無効", "1701060": "眠り無効", "1701070": "混乱無効", "1701080": "怯み無効", "1701100": "晴れ時 異常無効", "1701110": "眠り無効G", "1701120": "妨害無効", "1701130": "雨時 妨害無効", "1701140": "一撃必殺 無効", "1701150": "晴れ時 妨害無効", "1701160": "W通常時 妨害無効", "1701180": "PF時 異常無効", "1701190": "GF時 異常無効", "1701200": "EF時 妨害無効", "1701210": "EF時 異常無効", "1701220": "怯み無効G", "1701230": "晴れ時 異常妨害無効G", "1701240": "毒無効G", "1701260": "悪Z時 妨害状態無効", "1701270": "岩Z時 異常無効", "1701280": "GF時 妨害無効", "1701290": "妖Z時 異常無効G", "1701300": "霰時 異常無効", "1701310": "被攻撃時 攻撃特攻↑ 無視", "1701320": "PF時 異常妨害無効G", "1701330": "P技B技BD技 被攻撃時 WFZ 威力↑ 無視G", "1701340": "龍Z時 妨害状態無効", "1701360": "氷Z時 異常無効G", "1701370": "鋼Z時 異常妨害 無効G", "1701380": "地Z時 異常妨害 無効G", "1701390": "霰無効G", "1701400": "C時 異常無効", "1701410": "砂嵐無効G", "1701420": "GF時 異常妨害 無効G", "1701430": "眠り 怯み 無効G", "1701440": "霰時 妨害 無効", "1701450": "毒Z時 異常無効G", "1701460": "相手 毒ダメ場 時異常妨害無効G", "1701470": "C時 異常妨害無効G", "1701480": "ゲージ加速時 異常妨害無効G", "1701490": "虫Z時 異常無効", "1701500": "火無効G", "1701510": "妖Z時 異常妨害 無効G", "1702010": "毒耐性{{value}}", "1702020": "麻痺耐性{{value}}", "1702030": "眠り耐性{{value}}", "1702040": "火傷耐性{{value}}", "1702050": "凍り耐性{{value}}", "1702060": "混乱耐性{{value}}", "1702070": "怯み耐性{{value}}", "1703010": "B技後 状態悪化 解除", "1703020": "P技後 異常解除G{{value}}", "1703030": "妨害解除", "1703040": "瀕死時 味方 異常解除", "1703060": "B技後 異常解除", "1703070": "技後 異常解除G", "1703080": "P技後 異常 解除{{value}}", "1703090": "味方に 技後 異常解除{{value}}", "1703100": "B技後 異常解除G{{value}}", "1703110": "BD技後 異常解除G{{value}}", "1703120": "技後 妨害解除{{value}}", "1703130": "技後 異常解除{{value}}", "1703150": "技後 妨害状態 解除{{value}}", "1703160": "B技後 デメリット変化 解除G{{value}}", "1703170": "Ｔ技後 異常解除G{{value}}", "1704010": "異常妨害 回復後 無効化", "1704020": "無傷登場時 こらえる", "1704030": "霰時 HP回復{{value}}", "1704040": "再度 こらえる{{value}}", "1704050": "晴時 HP回復{{value}}", "1704060": "技後 こらえる{{value}}", "1704070": "技後 混乱付与{{value}}", "1704080": "ピンチ時 技後注目", "1704090": "砂嵐時 HP回復{{value}}", "1704100": "技後 毒付与{{value}}", "1704110": "変化技 異常付与G{{value}}", "1704120": "登場時 次回急所", "1704130": "攻撃時 怯み付与{{value}}", "1704140": "B技後 次回急所", "1704150": "雨時 HP回復{{value}}", "1704160": "無傷登場時 回復付帯", "1704170": "B技後 眠り付与", "1704180": "技後 注目", "1704190": "技後 凍り付与{{value}}", "1704200": "登場時 次回必中", "1704210": "初B技後 こらえるG", "1704220": "技後 猛毒付与{{value}}", "1704230": "相手に 技後 眠り付与{{value}}", "1704240": "技急所時 混乱付与{{value}}", "1704250": "技後 次回急所{{value}}", "1704260": "技後 回復付帯{{value}}", "1704270": "初登場時 次回急所G", "1704280": "EF時 HP回復{{value}}", "1704290": "PF時 HP回復{{value}}", "1704300": "技後 回復付帯G", "1704310": "登場時 次ゲージ 消費0", "1704320": "B技後 次ゲージ 消費0", "1704330": "B技後 回復付帯G", "1704340": "初B技後 こらえる", "1704350": "技後 次回抜群↑{{value}}", "1704360": "交代禁止時 攻撃時 次ゲージ 消費無{{value}}", "1704370": "登場時 次回抜群↑", "1704380": "交代禁止時 HP回復{{value}}", "1704390": "急所時 次ゲージ 消費無{{value}}", "1704400": "毒 火傷 麻痺 同調", "1704410": "P技後 次ゲージ 消費無{{value}}", "1704420": "P変化技 使用時 次回抜群↑{{value}}", "1704430": "晴れ時 P技後 次回抜群↑{{value}}", "1704440": "雨時 P技後 次回抜群↑{{value}}", "1704450": "BD技後 次ダメ防御", "1704460": "被攻撃時 次ゲージ 消費無{{value}}", "1704470": "BD技後 回復付帯", "1704480": "攻撃時 次ゲージ 消費無{{value}}", "1704490": "初ピンチ時 次回抜群↑", "1704500": "初HP半減時 次ダメ防御", "1704510": "初B技後 次回抜群↑", "1704520": "失敗時 物理⇑{{value}}", "1704530": "BD技後 次回抜群↑", "1704540": "相手に B技後 交代禁止 付与", "1704550": "B技後 回復付帯", "1704560": "T技後 物理⇑1 付与{{value}}", "1704570": "攻撃時 異常付与G{{value}}", "1704580": "とどめ時 次回抜群↑", "1704600": "抜群時 次ゲージ 消費無{{value}}", "1704610": "シャドーダイブ後 次回抜群↑", "1704620": "T技後 特殊⇑1 付与G{{value}}", "1704630": "T技後 次ゲージ 消費無{{value}}", "1704640": "抜群時 次回抜群↑{{value}}", "1704650": "技後 次ゲージ 消費無{{value}}", "1704660": "B技後 物理⇑1 付与{{value}}", "1704670": "B技後 眠り 付与G", "1704680": "HP半減時 P変化技 使用時 特殊⇑1 付与G{{value}}", "1704690": "初B技後 次ダメ防御", "1704700": "霊Z時 HP回復{{value}}", "1704710": "T技後 次回抜群↑{{value}}", "1704720": "初B技後 次ゲージ 消費無G", "1704730": "初登場時 物理･特殊⇑{{value}}", "1704740": "攻撃時 混乱付与{{value}}", "1704750": "P変化技 使用時 物理･特殊⇑1 付与G{{value}}", "1704760": "PF時 攻撃時 次ゲージ 消費無{{value}}", "1704770": "HP半減時 次ゲージ 消費無G{{value}}", "1704780": "BD技後 特殊⇑1 付与G{{value}}", "1704790": "P変化技後 物⇑1 付与{{value}}", "1704800": "被攻撃時 麻痺付与{{value}}", "1704810": "攻撃時 妨害付与{{value}}", "1704820": "急所時 次回急所{{value}}", "1704830": "虫Z時 HP回復{{value}}", "1704840": "回復技後 物理特殊⇑1 付与G{{value}}", "1704850": "B技後 次回抜群↑{{value}}", "1704860": "B技後 特殊⇑1 付与{{value}}", "1704870": "技後 特殊⇑1 付与{{value}}", "1704880": "技後 物理⇑1 付与{{value}}", "1704890": "GF時 HP回復{{value}}", "1704900": "B技後 一度 特殊⇑1 付与G{{value}}", "1704910": "回数技使用時 特殊⇑1 付与G{{value}}", "1704920": "技後 物理特殊⇑1 付与{{value}}", "1704930": "登場時 特殊⇑G{{value}}", "1704940": "初ピンチ時 特殊⇑{{value}}", "1704950": "登場時 次ダメ防御", "1704960": "被攻撃時 火傷付与{{value}}", "1704970": "攻撃時 麻痺付与{{value}}", "1704980": "技後 特殊⇑1 付与G{{value}}", "1704990": "初登場時 回復付帯", "1705010": "相手 火傷 ダメージ ↑{{value}}", "1705020": "相手 拘束 ダメージ↑{{value}}", "1705030": "相手 毒ダメージ↑{{value}}", "1705040": "混乱相手 自身攻撃率 ↑{{value}}", "1705050": "異常妨害無効時間 延長{{value}}", "1705060": "麻痺相手 失敗率↑{{value}}", "1706010": "電攻撃時 麻痺付与{{value}}", "1706020": "氷攻撃時 凍り付与{{value}}", "1706030": "技後 物理⇑2 付与{{value}}", "1706040": "初ピンチ時 物理⇑{{value}}", "1706050": "T技後 物理･特殊⇑1 付与{{value}}", "1706060": "待機時 物理⇑1 付与{{value}}", "1706070": "P変化技使用時 次ゲージ 消費無{{value}}", "1706080": "鋼Z時 HP回復{{value}}", "1706090": "悪Z時 HP回復{{value}}", "1706100": "B技後 一度 物理⇑1 付与G{{value}}", "1706110": "初登場時 こらえるG", "1706120": "攻撃時 火傷付与{{value}}", "1706130": "味方に技後 特殊⇑1 付与{{value}}", "1706140": "毒相手 攻撃時 次ゲージ 消費無{{value}}", "1706150": "P変化技使用時 物理･特殊⇑1 付与{{value}}", "1706160": "岩Z時 HP回復{{value}}", "1706170": "攻撃時 バインド付与{{value}}", "1706180": "初防御成功時 物理⇑1付与G{{value}}", "1706190": "能力↓時 次ゲージ 消費無{{value}}", "1706200": "被攻撃時 毒麻痺眠り付与{{value}}", "1706210": "火傷相手 攻撃時 特殊⇑1付与{{value}}", "1706220": "相手失敗時 物理･特殊⇑1 付与{{value}}", "1706230": "B技後 猛毒付与G{{value}}", "1706240": "毒相手 攻撃時 次回抜群威力↑{{value}}", "1706250": "B技BD技後 物理⇑1付与G{{value}}", "1706260": "初攻撃時 地抵抗↓", "1706270": "一度だけ 再度こらえる", "1706280": "初B技後 次回抜群威力↑G", "1706290": "初攻撃時 鋼抵抗↓", "1706300": "登場時 回復付帯G", "1706310": "初攻撃時 弱点タイプ抵抗↓", "1706320": "T技後 一度 異常妨害無効化G{{value}}", "1706330": "初T技後 悪抵抗↓G", "1706340": "能力非↑相手 攻撃時 次ゲージ 消費無{{value}}", "1706390": "能力非↑相手 攻撃時 怯み付与{{value}}", "1706400": "麻痺相手 攻撃時 次ゲージ 消費無{{value}}", "1706410": "初P変化技 使用時 竜抵抗↓", "1706420": "回避不可相手 攻撃時 怯み付与{{value}}", "1706430": "技後 物理⇑1付与G{{value}}", "1706440": "PF時攻撃時 物理⇑1付与{{value}}", "1706450": "BD技後 毒抵抗↓G{{value}}", "1706460": "味方毒付与時 猛毒付与", "1706470": "技後 物理⇑1付与{{value}}", "1706480": "初HP60%時 次ダメ防御", "1706490": "技後 物理⇑3付与{{value}}", "1706500": "P変化技 使用時 物理⇑2 付与{{value}}", "1706510": "鋼ダメ場時 攻撃時 次ゲージ 消費無{{value}}", "1706520": "ボルテージ↑時 攻撃時 物理⇑3 付与{{value}}", "1706530": "BD技後 次ゲージ 消費無", "1706540": "P変化技 使用時 物理⇑1 付与G{{value}}", "1706550": "速攻技後 物理⇑1 付与{{value}}", "1706560": "火傷相手 攻撃時 次回抜群威力↑{{value}}", "1706570": "B技後 物理⇑2 付与{{value}}", "1706580": "相手失敗時 物理⇑2 付与{{value}}", "1706590": "被攻撃時 次回抜群威力↑{{value}}", "1706600": "B技後 次回 ゲージ消費無G{{value}}", "1706610": "攻撃時 変化付与G{{value}}", "1706620": "被攻撃時 相手に 毒付与{{value}}", "1706630": "凍り相手 攻撃時 特殊⇑1 付与{{value}}", "1706640": "技後 特殊⇑2 付与{{value}}", "1706650": "BD技後 次ゲージ 消費無G", "1706660": "攻撃時 妨害状態1種付与{{value}}", "1706670": "初攻撃時 妖抵抗↓", "1706680": "B技後 一度 特殊⇑2 付与G{{value}}", "1706690": "交代禁止相手 攻撃時 次回ゲージ消費無{{value}}", "1706700": "交代禁止相手 攻撃時 次回抜群威力↑{{value}}", "1706710": "相手 悪ダメ場時 攻撃時 次ゲージ 消費無{{value}}", "1706720": "麻痺相手 攻撃時 特殊⇑1 付与{{value}}", "1706730": "B技後 物理⇑2 付与G{{value}}", "1706740": "相手に 初B技後 妖抵抗↓", "1706760": "毒相手 攻撃時 特殊⇑1 付与{{value}}", "1706770": "味方が WFZ 発生時 特殊⇑1 付与{{value}}", "1706780": "異常相手 攻撃時 次ゲージ 消費無{{value}}", "1706790": "B技BD技後 特殊⇑2 付与{{value}}", "1706800": "B技後 ボルテージ↑{{value}}", "1706810": "T技後 次ゲージ 消費無G{{value}}", "1706820": "とどめ時 特殊⇑2 付与{{value}}", "1706830": "能力↓時 物理⇑1付与{{value}}", "1706840": "T技後 一度 物理･特殊⇑1 付与G{{value}}", "1706850": "初登場時 草抵抗↑{{value}}", "1706860": "相手に B技後 麻痺付与", "1706870": "T技後 特殊⇑1 付与{{value}}", "1706880": "攻撃時 次ゲージ 消費無 か 特殊⇑1 付与", "1706890": "相手に BD技後 同タイプ 抵抗↓G{{value}}", "1706900": "攻撃時 物理⇑1 付与{{value}}", "1706910": "初B技後 特殊⇑G{{value}}", "1706920": "味方が WFZ 発生時 物理⇑1 付与{{value}}", "1706930": "火傷時 攻撃時 物理⇑1 付与{{value}}", "1706940": "妨害状態相手 攻撃時 次回抜群威力↑{{value}}", "1706950": "攻撃時 特殊⇑1 付与{{value}}", "1706960": "命中時 物理⇑1 付与{{value}}", "1706970": "砂嵐時 攻撃時 物理⇑1 付与{{value}}", "1706980": "登場時 物理⇑{{value}}", "1706990": "BD技後 物理･特殊⇑G{{value}}", "1707010": "味方の場 効果対象時 攻撃時 次ゲージ 消費無{{value}}", "1707020": "抵抗↓相手 攻撃時 次ゲージ 消費無{{value}}", "1707030": "命中時 怯み 付与{{value}}", "1707040": "味方に 技後 物理･特殊⇑1 付与{{value}}", "1707050": "B技後 物理･特殊 ⇑2 付与{{value}}", "1707060": "自身全体か 味方の場 発生時 次ゲージ 消費無{{value}}", "1707070": "BD技後 特殊⇑{{value}}", "1707080": "回復技後 回復付帯G", "1707090": "B技後 物理･特殊⇑1 付与{{value}}", "1707100": "物理 BD技後 物理⇑{{value}}", "1707110": "特殊 BD技後 特殊⇑{{value}}", "1707120": "C時 攻撃時 物理⇑1 付与{{value}}", "1707130": "初登場時 物理⇑G{{value}}", "1707140": "能力 非↑相手 攻撃時 物理⇑ 1付与{{value}}", "1707150": "毒攻撃時 毒付与{{value}}", "1707160": "自身全体か 味方の場 発生時 特殊⇑1 付与{{value}}", "1707170": "P変化技 使用時 特殊⇑1 付与{{value}}", "1707180": "初登場時 物理⇑{{value}}", "1707190": "初登場時 特殊⇑{{value}}", "1707200": "B技後 特殊⇑2 付与{{value}}", "1707220": "初登場時 眠り付与G", "1707230": "P技後 物理⇑1 付与{{value}}", "1707240": "初B技後 物理⇑G{{value}}", "1707250": "待機時 特殊⇑2 付与{{value}}", "1707260": "味方が C 発生時 特殊⇑1 付与{{value}}", "1707270": "待機時 特殊⇑1 付与{{value}}", "1707280": "味方瀕死時 物理⇑{{value}}", "1707290": "相手に 初B技後 龍抵抗↓{{value}}", "1707300": "攻撃時 怯み付与 & 麻痺付与{{value}}", "1707310": "攻撃時 きのみ回数 消費 & 特殊⇑3 付与{{value}}", "1707320": "C時 攻撃時 次ゲージ 消費無{{value}}", "1707330": "技後 B技⇑4 付与{{value}}", "1707340": "能力↓時 物理⇑2 付与{{value}}", "1707350": "技後 B技⇑3 付与{{value}}", "1707360": "B技後 B技⇑5 付与{{value}}", "1707370": "T技後 物理⇑1 付与G{{value}}", "1707380": "自身 C 発生時物理 特殊⇑1 付与G{{value}}", "1707390": "速攻技後 物理⇑1 付与G{{value}}", "1707400": "登場時 特殊⇑{{value}}", "1707410": "登場時 B技⇑{{value}}", "1707420": "初攻撃時 草抵抗↓", "1707430": "初B技後 物理⇑{{value}}", "1707440": "変化技 使用時 物理･特殊⇑1 付与G{{value}}", "1707450": "初きのみ0時 特殊⇑{{value}}", "1707460": "初攻撃時 毒抵抗↓", "1707470": "BD技後 物理⇑{{value}}", "1707480": "Ｔ技後 B技⇑1 付与G{{value}}", "1707490": "悪技 威力↑G{{value}}", "1707500": "飛 威力↑G{{value}}", "1707510": "初P技後 特殊⇑{{value}}", "1707520": "攻撃時 B技⇑1 付与{{value}}", "1707530": "相手に BD技後 妨害状態 付与G{{value}}", "1707540": "変化技 妨害状態 付与G{{value}}", "1707550": "相手に BD技後 麻痺付与G{{value}}", "1707560": "味方に 技後 B技⇑2 付与{{value}}", "1707570": "味方が C 発生時 物理･特殊⇑1 付与G{{value}}", "1707580": "B技BD技後 物理⇑2 付与{{value}}", "1707590": "BD技後 B技⇑G{{value}}", "1707600": "技後 次ダメ防御{{value}}", "1707610": "攻撃時 きのみ回数 消費 & 物理⇑1 付与G{{value}}", "1707620": "相手失敗時 物理･特殊⇑1 付与G{{value}}", "1707630": "鋼Z時 攻撃時 次ゲージ 消費無{{value}}", "1707640": "電 威力↑G{{value}}", "1707650": "命中時 特殊⇑1 付与{{value}}", "1707660": "命中時 B技⇑1 付与{{value}}", "1707670": "自身 飛Z 発生時 特殊⇑1 付与G{{value}}", "1707680": "T技後 物理⇑3 付与{{value}}", "1707690": "味方が W 発生時 特殊⇑2 付与{{value}}", "1707700": "BD技後 B技⇑{{value}}", "1707710": "初登場時 次ダメ防御", "1707720": "T技後 物理･特殊⇑1 付与G{{value}}", "1707730": "HP半減時 一度 物理･特殊⇑2 付与G{{value}}", "1707740": "PF 使用時 特殊⇑1 付与G{{value}}", "1707750": "被攻撃時 特殊⇑1 付与{{value}}", "1707760": "相手に BD技後 同タイプ 抵抗↓{{value}}", "1707770": "相手 炎ダメ場時 攻撃時 特殊⇑1 付与{{value}}", "1707780": "攻撃時 B技⇑2 付与{{value}}", "1707790": "相手に BD技後 火傷付与{{value}}", "1707800": "雨時 攻撃時 次ゲージ 消費無{{value}}", "1707810": "GF時 攻撃時 次ゲージ 消費無{{value}}", "1707820": "ピンチ時 一度 次ダメ防御{{value}}", "1707830": "BD技後 物理⇑G{{value}}", "1707840": "晴時 攻撃時 次ゲージ 消費無{{value}}", "1707850": "味方に 技後 B技⇑4 付与{{value}}", "1707860": "技後 B技⇑1 付与G{{value}}", "1707870": "初B技後 特殊⇑{{value}}", "1707880": "S技 回数0時 非S技攻撃時 特殊⇑1 付与{{value}}", "1707890": "味方に 技後 次回抜群威力↑{{value}}", "1707900": "地Z時 攻撃時 次ゲージ 消費無{{value}}", "1707910": "技後 特殊⇑2 付与G{{value}}", "1707920": "技後 物理⇑2 付与G{{value}}", "1707930": "地Z時 HP回復{{value}}", "1707940": "地願 使用時 物理⇑2 付与{{value}}", "1707950": "雨時 命中時 B技⇑1 付与{{value}}", "1707960": "被攻撃時 物理⇑1 付与G{{value}}", "1707970": "被攻撃時 特殊⇑1 付与G{{value}}", "1707980": "岩 威力↑G{{value}}", "1707990": "氷 威力↑G{{value}}", "1708010": "初P変化技0時 物理⇑{{value}}", "1708020": "自身 晴 発生時 次ゲージ 消費無{{value}}", "1708030": "EF時 攻撃時 特殊⇑1付与{{value}}", "1708040": "技後 次回抜群威力↑G{{value}}", "1708050": "T技回数0時 攻撃時 次ゲージ 消費無{{value}}", "1708060": "T技回数0時 攻撃時 特殊⇑2 付与{{value}}", "1708070": "火傷相手 味方攻撃時 特殊⇑1付与{{value}}", "1708080": "初きのみ0時 物理⇑G{{value}}", "1708090": "火傷相手 攻撃時 次ゲージ 消費無{{value}}", "1708100": "B技後 特殊⇑1 付与G{{value}}", "1708110": "鋼願 使用時 特殊⇑2 付与{{value}}", "1708120": "初登場時 特殊⇑G{{value}}", "1708130": "B技 被攻撃時 物理⇑2付与{{value}}", "1708140": "相手 炎ダメ場時 攻撃時 次ゲージ 消費無{{value}}", "1708150": "被攻撃時 B技⇑1付与G{{value}}", "1708160": "雨時 攻撃時 特殊⇑2付与{{value}}", "1708170": "味方が WFZ 発生時 特殊⇑1 付与G{{value}}", "1708180": "無 威力↑G{{value}}", "1708190": "闘 威力↑G{{value}}", "1708200": "炎 威力↑G{{value}}", "1708210": "初登場時 自身眠り", "1708220": "命中時 物理･ 特殊⇑1 付与{{value}}", "1708230": "初特殊⇑6 以上時 特殊⇑{{value}}", "1708250": "味方が 虫Z 発生時 特殊⇑1 付与{{value}}", "1708260": "B技後 特殊⇑2 付与G{{value}}", "1708270": "技後 次ゲージ 消費無G{{value}}", "1708280": "初技使用時 特殊⇑G{{value}}", "1708290": "初攻撃時 無抵抗↓", "1708300": "技後 物理･特殊⇑2付与{{value}}", "1708310": "初B技後 ボルテージ↑{{value}}", "1708320": "味方が C 発生時 物理⇑2 付与{{value}}", "1708330": "味方が C 発生時 B技⇑3 付与{{value}}", "1708340": "味方能力↑ 時B技⇑1 付与{{value}}", "1708350": "B技 被攻撃時 物理･特殊⇑1 付与G{{value}}", "1708360": "怯み相手 味方攻撃時 物理･特殊⇑1 付与{{value}}", "1708370": "被攻撃時 拘束時付与{{value}}", "1708380": "初P変化技 使用時 次ダメ防御", "1708390": "相手1体時 攻撃時 物理･ 特殊⇑1付与{{value}}", "1708400": "相手1体時 攻撃時 次ゲージ 消費無{{value}}", "1708410": "初登場時 &初B技後 特殊⇑{{value}}", "1708420": "P技後 B技⇑2 付与{{value}}", "1708430": "P変化技 使用時 特殊⇑2 付与{{value}}", "1708440": "晴時 味方攻撃時 特殊⇑1 付与{{value}}", "1708450": "怯み相手 味方攻撃時 B技⇑2 付与{{value}}", "1708460": "妖Z時 HP回復{{value}}", "1708470": "相手1体時 攻撃時 特殊⇑1 付与{{value}}", "1708480": "味方が C 発生時 物理⇑1 付与G{{value}}", "1708490": "味方が C 発生時 次ゲージ 消費無{{value}}", "1708500": "味方が WTZ 発生時 物理･特殊⇑1 付与G{{value}}", "1708510": "チームB技後 物理･特殊⇑1 付与G{{value}}", "1708520": "霊 威↑G{{value}}", "1708530": "願 威↑G{{value}}", "1708540": "水 威↑G{{value}}", "1708550": "B技後 物理･特殊⇑1 付与G{{value}}", "1708560": "初登場時 B技⇑{{value}}", "1708570": "初P変化技 使用時 特殊⇑G{{value}}", "1708580": "技後 次回 全体技 引受け{{value}}", "1708590": "初B技後 物理･特殊⇑G{{value}}", "1708600": "B技後 物理⇑3 付与{{value}}", "1708610": "異常相手 味方攻撃時 物理･特殊⇑1 付与{{value}}", "1708620": "異常相手 味方攻撃時 B技⇑2 付与{{value}}", "1708630": "初登場時 霊抵抗↓G{{value}}", "1708640": "初T技後 B技⇑10", "1708650": "霊Z時 攻撃時 妨害付与{{value}}", "1708660": "妨害状態相手 攻撃時 次ゲージ 消費無{{value}}", "1708670": "妨害状態相手 攻撃時 物理･特殊⇑1 付与{{value}}", "1708680": "初B技後 霊抵抗↓G{{value}}", "1708690": "初登場時 次回抜群威力↑G", "1708700": "P技後 B技⇑1 付与G{{value}}", "1708710": "BD技後 物理･特殊⇑{{value}}", "1708720": "初登場時 物理･特殊⇑G{{value}}", "1708730": "初登場時 B技⇑G{{value}}", "1708740": "闘願 使用時 物理⇑2 付与{{value}}", "1708750": "闘Z時 攻撃時 次ゲージ 消費無{{value}}", "1708760": "味方が GF 発生時 物理･特殊⇑1 付与G{{value}}", "1708770": "抜群時 妨害状態1種付与{{value}}", "1708780": "自身 悪Z 発生時 特殊⇑1 付与G{{value}}", "1708790": "相手 岩ダメ場時 攻撃時 次ゲージ 消費無{{value}}", "1708800": "T技後 特殊⇑2 付与{{value}}", "1708810": "初B技後 次ダメ防御G", "1708820": "B技後 物理･特殊 ⇑2 付与G{{value}}", "1708830": "初登場時 猛毒付与G", "1708840": "初攻撃時 物理･特殊⇑{{value}}", "1708850": "霊Z時 攻撃時 物･特⇑1 付与{{value}}", "1708860": "初B技後 B技⇑10", "1708870": "初ジョウトC 特殊 発生時 こらえるG", "1708880": "初攻撃時 特殊ブレイク付与", "1708890": "ジョウトC 特殊 時技後 次ゲージ 消費無{{value}}", "1708900": "味方が 霊 発生時 物･特⇑2G{{value}}", "1708910": "技後 物理･特殊⇑1 付与G{{value}}", "1708920": "味方が C 発生時 次ゲージ 消費無G{{value}}", "1708930": "攻撃時 物理･特殊⇑1 付与{{value}}", "1708940": "初P変化技 使用時 次ゲージ 消費無G", "1708950": "毒相手 攻撃時 B技⇑2 付与{{value}}", "1708960": "攻撃時 特殊⇑3 付与{{value}}", "1708970": "B技後 次回急所G", "1708980": "登場時 物理･特殊⇑ G{{value}}", "1708990": "自身 パシオC 防御 発生時 特殊⇑G{{value}}", "1709000": "初攻撃時 炎抵抗↓", "1709010": "防御成功時 物理⇑1 付与G{{value}}", "1709020": "防御成功時 特殊⇑1 付与G{{value}}", "1709030": "初B技後 無抵抗↓G{{value}}", "1709040": "初B技後 炎抵抗↓G{{value}}", "1709050": "初B技後 水抵抗↓G{{value}}", "1709060": "初B技後 電抵抗↓G{{value}}", "1709070": "初B技後 草抵抗↓G{{value}}", "1709080": "初B技後 氷抵抗↓G{{value}}", "1709090": "初B技後 超抵抗↓G{{value}}", "1709100": "初B技後 悪抵抗↓G{{value}}", "1709110": "初B技後 妖抵抗↓G{{value}}", "1709120": "初草攻撃時 GF化 & 草抵抗↓", "1709130": "初岩攻撃時 岩Z化 & 岩抵抗↓", "1709140": "初B技後 岩抵抗↓G{{value}}", "1709150": "初霊の 願い0時 物理⇑{{value}}", "1709160": "T技後 物理⇑2 付与{{value}}", "1709170": "異常相手 攻撃時 B技⇑3 付与{{value}}", "1709180": "B技後 特殊⇑1~4統一 付与G{{value}}", "1709190": "自身 カントーC 特殊 発生時 特殊⇑1 付与{{value}}", "1709200": "晴時 攻撃時 怯み付与{{value}}", "1709210": "味方攻撃時 自身 物理⇑1 B技⇑2", "1709220": "チームB技後 物理⇑2 付与{{value}}", "1709230": "初ギガ インパクト後 物理ブレイク付与", "1709240": "味方に 技後 次ゲージ 消費無{{value}}", "1709250": "味方が WFZ 発生時 物理⇑1 付与G{{value}}", "1709260": "味方に 技後 次ダメ防御{{value}}", "1709270": "瀕死時 B技⇑ G10", "1709280": "B技BD技後 特殊⇑2 付与G{{value}}", "1709290": "チームB技後 特殊⇑2 付与{{value}}", "1709300": "技後 物理⇑2 B技⇑4", "1709310": "自身 鋼Z 発生時 物理･特殊⇑1 付与G{{value}}", "1709370": "GF時 攻撃時 次ゲージ消費0 & 毒付与", "1709380": "霊Z時 攻撃時 次ゲージ 消費0 & 火付与", "1709390": "龍Z時 攻撃時 次ゲージ 消費0 & 麻痺付与", "1709400": "Bテラスタル時 攻撃時 次ゲージ 消費無{{value}}", "1709410": "自身 GF 発生時 次回抜群威力↑", "1709420": "チームB技後 物理⇑1 付与{{value}}", "1709430": "B技BD技後 物理･特殊⇑1 付与G{{value}}", "1709440": "登場時 物理･特殊⇑{{value}}", "1709470": "相手に B技後 火付与", "1709490": "初B技後 物理･特殊⇑{{value}}", "1709540": "GF時 攻撃時 物理⇑1 付与G{{value}}", "1709550": "サークル時 攻撃時 物理⇑1 付与G{{value}}", "1801010": "攻撃↓耐性{{value}}", "1801020": "防御↓耐性{{value}}", "1801030": "特攻↓耐性{{value}}", "1801040": "特防↓耐性{{value}}", "1801050": "素早さ↓耐性{{value}}", "1801060": "命中↓耐性{{value}}", "1801070": "回避↓耐性{{value}}", "1801090": "全↓耐性{{value}}", "1802010": "攻撃↓無効", "1802020": "防御↓無効", "1802030": "特攻↓無効", "1802040": "特防↓無効", "1802050": "素早さ↓無効", "1802060": "命中↓無効", "1802070": "回避↓無効", "1802080": "急所率↓無効", "1802090": "全↓無効", "1802100": "砂嵐時 全↓無効", "1802110": "晴れ時 全↓無効", "1802120": "命中率↑無効", "1802130": "PF時 全↓無効", "1802140": "妖Z時 全↓無効", "1802150": "霰時 全↓無効", "1802160": "EF時 全↓無効G", "1802170": "防御↓無効G", "1802180": "特攻↓無効G", "1802190": "攻撃↓無効G", "1802200": "妖Z時 全↓無効G", "1802210": "C時 全↓無効G", "1802220": "岩Z時 全↓無効G", "1802230": "虫Z時 全↓無効", "1802240": "悪Z時 全↓無効", "1802250": "無Z時 全↓無効G", "1802260": "全↓無効 & P技B技 急所化", "1802270": "龍Z時 全↓無効G", "1803010": "瀕死時 能力引継", "1803020": "交代時 能力引継", "1804010": "登場時 攻撃↓G{{value}}", "1804020": "登場時 素早さ↓G{{value}}", "1804030": "急所時 素早さ↑{{value}}", "1804040": "急所時 急所率↑{{value}}", "1804050": "P技後 素早さ↑{{value}}", "1804060": "攻撃時 攻撃↑{{value}}", "1804070": "攻撃時 防御↓{{value}}", "1804080": "P技後 防御↑{{value}}", "1804090": "攻撃時 能力↑{{value}}", "1804100": "能力↓時 特攻↑{{value}}", "1804110": "瀕死時 攻撃特攻↓G{{value}}", "1804120": "被攻撃時 回避率↑{{value}}", "1804130": "被攻撃時 素早さ2↑{{value}}", "1804140": "初HP半減時 回避率↑{{value}}", "1804150": "被物理攻撃時 素早さ↓{{value}}", "1804160": "攻撃時 能力↓{{value}}", "1804170": "登場時 回避率↑{{value}}", "1804180": "登場時 素早さ↑{{value}}", "1804190": "登場時 急所率↑{{value}}", "1804200": "初ピンチ時 特攻↑{{value}}", "1804210": "他者瀕死時 攻撃↑{{value}}", "1804220": "技後 特攻↓{{value}}", "1804250": "能力↓時 攻撃↑{{value}}", "1804260": "初ピンチ時 回避率↑{{value}}", "1804270": "技後 攻撃特攻↑{{value}}", "1804280": "初ピンチ時 素早さ↑{{value}}", "1804290": "P技後 特攻↑{{value}}", "1804300": "P技後 攻撃↑G{{value}}", "1804310": "P技後 急所率↑G{{value}}", "1804320": "被攻撃時 防御↑{{value}}", "1804330": "被攻撃時 特防↑{{value}}", "1804340": "初ピンチ時 防御↑G{{value}}", "1804350": "初HP半減時 素早さ↑{{value}}", "1804360": "P技後 急所率↑{{value}}", "1804370": "P技後 特防↑G{{value}}", "1804380": "P技後 回避率↑{{value}}", "1804390": "技後 急所率↑G{{value}}", "1804400": "技後 特攻↑{{value}}", "1804410": "技後 素早さ↑G{{value}}", "1804420": "命中時 防御↓{{value}}", "1804510": "登場時 特攻↑{{value}}", "1804520": "P技後 特攻↑G{{value}}", "1804530": "技後 攻撃↑{{value}}", "1804540": "技後 特防↑{{value}}", "1804550": "B技後 能力5種↑{{value}}", "1804560": "登場時 防御↑{{value}}", "1804570": "技後 攻撃↑G{{value}}", "1804580": "技後 防御↑G{{value}}", "1804590": "登場時 攻撃↑{{value}}", "1804600": "初ピンチ時 攻撃↑{{value}}", "1804610": "登場時 命中率↓G{{value}}", "1804620": "技後 素早さ↑{{value}}", "1804630": "B技後 攻撃↑G{{value}}", "1804640": "攻撃時 特防↓{{value}}", "1804650": "技後 防御↑{{value}}", "1804660": "登場時 特防↑{{value}}", "1804670": "登場時 特防↓G{{value}}", "1804680": "技後 回避率↑{{value}}", "1804690": "技後 命中率↑G{{value}}", "1804700": "味方に 技後 防御↑{{value}}", "1804710": "初ピンチ時 急所率↑{{value}}", "1804720": "P技後 回避率↑G{{value}}", "1804730": "技後 回避率↑G{{value}}", "1804740": "相手失敗時 攻撃↑{{value}}", "1804750": "相手失敗時 特攻↑{{value}}", "1804760": "B技後 急所率↑{{value}}", "1804770": "B技後 攻撃↓G{{value}}", "1804780": "技後 防御特防↓{{value}}", "1804800": "とどめ時 攻撃特攻↑{{value}}", "1804810": "登場時 特攻↓G{{value}}", "1804820": "被攻撃時 攻撃↑{{value}}", "1804830": "攻撃時 攻撃↓{{value}}", "1804840": "急所時 攻撃↑{{value}}", "1804850": "急所時 特攻↑{{value}}", "1804860": "技後 特攻↑G{{value}}", "1804870": "技後 特防↑G{{value}}", "1804880": "被攻撃時 特攻↑{{value}}", "1804890": "被攻撃時 防御↑G{{value}}", "1804900": "攻撃時 回避率↓{{value}}", "1804910": "攻撃時 命中率↓{{value}}", "1804930": "混乱相手 攻撃時 防御↓{{value}}", "1804940": "攻撃時 防御↓G{{value}}", "1804950": "攻撃時 特防↓G{{value}}", "1804960": "攻撃時 防御↑{{value}}", "1804970": "攻撃時 素早さ↓{{value}}", "1804980": "技急所時 特防↑{{value}}", "1804990": "瀕死時 特防↓G{{value}}", "1805010": "砂嵐時 回避↑", "1805030": "異常命中↑{{value}}", "1805050": "雨時 技 急所狙い{{value}}", "1805060": "技 急所狙い{{value}}", "1805070": "HP半減時 技 急所狙い{{value}}", "1805080": "登場時 回避率↓G{{value}}", "1805090": "B技 急所狙い{{value}}", "1805100": "霰時 技 急所狙い{{value}}", "1805110": "登場時 防御↓G{{value}}", "1805120": "抜群時 急所率↑{{value}}", "1805130": "抜群時 特攻↑{{value}}", "1805140": "P技B技BD技 急所化", "1805150": "P技B技 急所化", "1805160": "砂嵐時 P技B技 急所狙い{{value}}", "1807010": "被攻撃時 攻撃能力 吸収{{value}}", "1807020": "攻撃時 能力吸収{{value}}", "1807030": "攻撃時 防御能力 吸収{{value}}", "1807040": "攻撃時 特防能力 吸収{{value}}", "1807050": "攻撃時 素早さ能力 吸収{{value}}", "1807060": "攻撃時 能力1種吸収G{{value}}", "1807070": "被攻撃時 能力1種吸収{{value}}", "1807080": "攻撃時 攻撃能力 吸収{{value}}", "1808010": "技後 ↓解除{{value}}", "1808020": "ピンチ時 ↓解除{{value}}", "1808030": "B技後 ↓解除{{value}}", "1808040": "登場時 ↓解除", "1808050": "B技後 能力↑反転G", "1808060": "B技後 ↓解除G{{value}}", "1809010": "登場時 命中率↑{{value}}", "1809020": "B技後 回避率↑{{value}}", "1809030": "登場時 素早さ↑G{{value}}", "1809040": "霰時 P技後 急所率↑G{{value}}", "1809050": "技後 能力↑G{{value}}", "1809060": "登場時 能力↑{{value}}", "1809070": "初ピンチ時 特防↑{{value}}", "1809080": "P技後 特防↑{{value}}", "1809090": "きりばらい後 回避率↓{{value}}", "1809100": "被攻撃時 攻撃特攻↑G{{value}}", "1809110": "相手失敗時 攻撃↑G{{value}}", "1809120": "B技後 防御↑{{value}}", "1809130": "B技後 命中率↑{{value}}", "1809140": "登場時 能力↑G{{value}}", "1809150": "B技後 特攻↑{{value}}", "1809160": "技急所時 攻撃↑{{value}}", "1809170": "P技 ↓G{{value}}", "1809180": "防御成功時 防御↑{{value}}", "1809190": "防御成功時 特防↑{{value}}", "1809200": "防御成功時 攻撃↑G{{value}}", "1809210": "雨時 攻撃時 特攻↑{{value}}", "1809220": "技急所時 防御↑{{value}}", "1809230": "相手失敗時 回避率↑{{value}}", "1809240": "能力↓ 効果2倍", "1809250": "初B技後 攻撃↑{{value}}", "1809260": "技後 攻撃特攻↑G{{value}}", "1809270": "交代禁止相手 攻撃時 ゲージ↑{{value}}", "1809280": "技急所時 素早さ↑{{value}}", "1809290": "P変化技後 HP回復G{{value}}", "1809300": "登場時 命中率↑G{{value}}", "1809310": "登場時 攻撃↑G{{value}}", "1809320": "登場時 特攻↑G{{value}}", "1809330": "登場時 攻撃特攻↑{{value}}", "1809340": "攻撃時 特防↑{{value}}", "1809350": "眠相手 攻撃時 急所↑G{{value}}", "1809360": "P技後 素早さ↑G{{value}}", "1809370": "技後 攻撃防御↓{{value}}", "1809380": "攻撃時 素早さ↑G{{value}}", "1809390": "砂嵐時 P技後 素早↑G{{value}}", "1809400": "被妨害時 素早さ↑{{value}}", "1809410": "初P変化技 後攻撃特攻↑G{{value}}", "1809420": "P変化技 使用時 急所↑{{value}}", "1809430": "P変化技 能力↑ 効果2倍", "1809440": "技後 急所率↑{{value}}", "1809450": "攻撃時 能力7種↓{{value}}", "1809460": "攻撃時 防御↑G{{value}}", "1809470": "攻撃時 特防↑G{{value}}", "1809480": "登場時 防御特防↑{{value}}", "1809490": "砂嵐時 P技後 防御特防↑{{value}}", "1809500": "砂嵐時 攻撃時 命中率↓{{value}}", "1809510": "相手 失敗時 素早さ↑G{{value}}", "1809520": "能力↓ 反転", "1809530": "HP半減時 防御↑G{{value}}", "1809540": "T技後 特防↑G{{value}}", "1809550": "BD技後 素早さ↓G{{value}}", "1809560": "相手 失敗時 命中率↑G{{value}}", "1809570": "相手 失敗時 攻撃特攻↑G{{value}}", "1809580": "P変化技後 攻撃↓G{{value}}", "1809590": "P変化技後 特攻↓G{{value}}", "1809600": "BD技後 防御↑{{value}}", "1809610": "登場時 急所率↑G{{value}}", "1809620": "T技後 特攻↑G{{value}}", "1809630": "B技後 回避率↓G{{value}}", "1809640": "初HP半減時 攻撃↑{{value}}", "1809650": "P変化技 使用時 特攻↑G{{value}}", "1809660": "P変化技 使用時 防御↑G{{value}}", "1809670": "相手に 技後 回避率↓G{{value}}", "1809680": "相手に 技後 素早さ↓G{{value}}", "1809690": "被攻撃時 素早さ↑G{{value}}", "1809700": "とどめ時 攻撃↑{{value}}", "1809710": "麻痺相手 攻撃時 能力{{value}}種↓{{value}}", "1809720": "攻撃時 急所率↑G{{value}}", "1809730": "BD技後 特防↑{{value}}", "1809740": "BD技後 特防↑G{{value}}", "1809750": "アイスフェイス時 攻撃時 素早さ↑{{value}}", "1809760": "P変化技 使用時 攻撃↑G{{value}}", "1809770": "P変化技 使用時 能力↓G{{value}}", "1809780": "被攻撃時 防御特防↑G{{value}}", "1809790": "攻撃時 特攻↑{{value}}", "1809800": "T技後 攻撃↑G{{value}}", "1809810": "霰時 P技後 防御特防↑{{value}}", "1809820": "変化技後 素早さ↑G{{value}}", "1809830": "変化技後 急所率↑{{value}}", "1809850": "妨害相手 攻撃時 特防↓{{value}}", "1809860": "妨害相手 攻撃時 攻撃特攻↓{{value}}", "1809870": "T技後 特攻↑{{value}}", "1809880": "T技後 特防↑{{value}}", "1809890": "初登場時 特攻↓G{{value}}", "1809900": "砂嵐時 攻撃時 攻撃↓{{value}}", "1809910": "初P変化技 使用時 能力5種↑G{{value}}", "1809920": "技後 特防↓{{value}}", "1809930": "P変化技 使用時 素早さ↑G{{value}}", "1809950": "妨害相手 攻撃時 能力2↓{{value}}", "1809960": "被攻撃時 攻撃↑G{{value}}", "1809970": "初P変化技 使用時 防御↑G{{value}}", "1809980": "初P変化技 使用時 特防↑G{{value}}", "1809990": "初P変化技 使用時 防御特防↑G{{value}}", "1810010": "初B技後 能力5種↑G{{value}}", "1810020": "混乱相手 攻撃時 能力↓{{value}}", "1810030": "P技後 防御↑G{{value}}", "1810040": "P変化技 使用時 特防2↑G{{value}}", "1810050": "攻撃時 防御2↓{{value}}", "1810060": "被攻撃時 防御↓{{value}}", "1810070": "被攻撃時 特防↓{{value}}", "1810080": "命中時 急所率↑{{value}}", "1810090": "命中時 素早さ↓{{value}}", "1810100": "P技後 特攻2↓{{value}}", "1810110": "初登場時 素早さ↑G{{value}}", "1810120": "登場時 防御↑G{{value}}", "1810130": "登場時 特防↑G{{value}}", "1810140": "T技後 特攻2↑{{value}}", "1810150": "T技後 急所率2↑{{value}}", "1810160": "P技B技BD技後 特防↓{{value}}", "1810170": "P技B技BD技後 特攻特防↓{{value}}", "1810180": "P技B技BD技後 能力↓{{value}}", "1810190": "麻痺相手 攻撃時 素早↓{{value}}", "1810200": "BD技後 防御↓{{value}}", "1810210": "麻痺相手 攻撃時 急所率↑G{{value}}", "1810220": "命中時 能力↓{{value}}", "1810230": "GF時攻撃時 防御↑G & 防御↓G{{value}}", "1810240": "PF時攻撃時 特防↑G & 特防↓G{{value}}", "1810250": "EF時攻撃時 素早↑G & 素早↓G{{value}}", "1810260": "T技後 防御特防↑{{value}}", "1810270": "T技後 防御特防2↑{{value}}", "1810280": "T技後 急所率↑G{{value}}", "1810290": "攻撃時 素早さ2↓{{value}}", "1810300": "抜群時 素早さ2↓{{value}}", "1810310": "炎攻撃時 攻撃↓{{value}}", "1810320": "水攻撃時 防御↓{{value}}", "1810330": "虫攻撃時 特防↓{{value}}", "1810340": "虫攻撃時 特攻↓{{value}}", "1810350": "火傷相手 技後防御特防↓{{value}}", "1810360": "技後 攻撃2急所率1↑{{value}}", "1810370": "防御成功時 防御特防↑G{{value}}", "1810380": "回数技使用時 特防↑G{{value}}", "1810390": "初B技後 防御↓G{{value}}", "1810400": "B技後 命中率↓G{{value}}", "1810410": "攻撃時 命中率↑G{{value}}", "1810420": "P技B技後 攻撃↓{{value}}", "1810430": "P技B技後 特攻↓{{value}}", "1810440": "P技B技後 特防↓{{value}}", "1810450": "P技B技後 素早さ↓{{value}}", "1810460": "P技B技後 回避率↓{{value}}", "1810470": "B技後 特防↑G{{value}}", "1810480": "B技後 急所率↑G{{value}}", "1810490": "B技後 回避率↑G{{value}}", "1810500": "自身能力↑ 効果2倍", "1810510": "P変化技使用時 防御2↑{{value}}", "1810520": "P変化技使用時 特防2↑{{value}}", "1810530": "初HP半減時 特攻↑{{value}}", "1810540": "雨時命中時 特防↓{{value}}", "1810550": "相手失敗時 防御特防↑G{{value}}", "1810560": "EF時攻撃時 素早↓G{{value}}", "1810570": "麻痺相手 攻撃時 攻撃防御↓{{value}}", "1810580": "毒相手 攻撃時 攻撃特攻↓{{value}}", "1810590": "攻撃時 特攻↓{{value}}", "1810600": "技後 攻撃特攻↑{{value}}", "1810610": "P技後能力↓{{value}}", "1810620": "被攻撃時 能力1種↑G{{value}}", "1810630": "火傷相手 攻撃時 攻撃特防↓{{value}}", "1810640": "技後 命中率↑{{value}}", "1810650": "BD技後 防御↑G{{value}}", "1810660": "毒相手 攻撃時 能力2↓{{value}}", "1810670": "攻撃時 回避率↑G{{value}}", "1810680": "毒相手 攻撃時 攻撃↑{{value}}", "1810690": "毒相手 攻撃時 素早↑{{value}}", "1810700": "初HP半減時 攻撃特攻↑{{value}}", "1810710": "技後 能力1種↑G{{value}}", "1810720": "回避不可相手 攻撃時 素早さ↑G{{value}}", "1810740": "技後 能力1種↑{{value}}", "1810750": "P技後 防御特防↑{{value}}", "1810760": "交代禁止相手 攻撃時 命中率↓{{value}}", "1810770": "B技後 防御↓G{{value}}", "1810780": "味方が WFZ 発生時 回避率↑G{{value}}", "1810790": "破滅の願い使用時 能力統一2↑G", "1810800": "相手に P技後 特防2↓{{value}}", "1810810": "毒相手 P変化技 能力↓効果{{value}}倍", "1810820": "P技後 素早さ2↑{{value}}", "1810830": "B技後 素早さ↑G{{value}}", "1810840": "命中時 回避率↑{{value}}", "1810850": "初HP60%時 攻撃特攻↑{{value}}", "1810860": "B技後 特防↑{{value}}", "1810870": "B技後 防御特防↑{{value}}", "1810880": "火傷相手 攻撃時 特攻↓{{value}}", "1810890": "拘束相手 攻撃時 特防↓{{value}}", "1810900": "吸収技攻撃時 攻撃↓{{value}}", "1810910": "P技能力↑ 効果2倍", "1810920": "P技後 攻撃↓{{value}}", "1810930": "破滅の願い使用時 能力統一↑G", "1810940": "P変化技 使用時 能力↑{{value}}", "1810950": "BD技後 防御↑G{{value}}", "1810960": "火傷相手 攻撃時 攻撃↓{{value}}", "1810970": "拘束相手 攻撃時 素早↓{{value}}", "1810980": "吸収技攻撃時 特攻↓{{value}}", "1810990": "P変化技 使用時 命中率2 ↑G{{value}}", "1811010": "火傷相手 攻撃時 能力↓{{value}}", "1811020": "麻痺相手 攻撃時 防御特防↓{{value}}", "1811030": "BD技後 攻撃↑{{value}}", "1811040": "毒相手 攻撃時 能力↓{{value}}", "1811050": "相手に P変化技 使用時 特防↓{{value}}", "1811060": "攻撃時 攻撃特攻↑G{{value}}", "1811070": "相手に 初B技後 防御特防 ↓{{value}}", "1811080": "相手に P技後 防御↓{{value}}", "1811090": "相手に P技B技後 防御2↓{{value}}", "1811100": "攻撃時 素早さ2↑G{{value}}", "1811110": "毒相手 攻撃時 攻撃↓ & 麻痺相手 攻撃時 特攻↓{{value}}", "1811120": "相手に P技B技後 特防2↓{{value}}", "1811130": "相手 悪ダメ場時 攻撃時 防御特防↓{{value}}", "1811140": "相手 悪ダメ場時 攻撃時 素早さ↑{{value}}", "1811150": "攻撃時 攻撃↑G{{value}}", "1811160": "攻撃時 特攻↑G{{value}}", "1811170": "拘束相手 攻撃時 攻撃↓{{value}}", "1811180": "相手に 技後 攻撃特攻↓{{value}}", "1811190": "攻撃時 回避率↑{{value}}", "1811200": "技後 攻撃特攻↑G{{value}}", "1811210": "相手に P技B技後 攻撃2↓{{value}}", "1811220": "相手に P技B技後 特攻2↓{{value}}", "1811230": "登場時 能力↓G{{value}}", "1811240": "味方が WFZ 発生時 素早さ↑G{{value}}", "1811250": "異常相手 攻撃時 能力2↓{{value}}", "1811260": "初T技後 特攻↑G{{value}}", "1811270": "命中時 攻撃↓{{value}}", "1811280": "技後 防御特防↑G{{value}}", "1811290": "T技後 素早さ 回避 ↑G{{value}}", "1811300": "技後 攻撃特攻2↑{{value}}", "1811310": "相手に BD技後 能力7種↓{{value}}", "1811320": "物理 攻撃時 防御2↓{{value}}", "1811330": "特殊 攻撃時 特防2↓{{value}}", "1811340": "P変化技 使用時 攻撃↓G{{value}}", "1811350": "P変化技 使用時 特攻 ↓G{{value}}", "1811360": "攻撃時 防御 特防 ↓{{value}}", "1811370": "相手に B技後 特攻↓{{value}}", "1811380": "B技後 特攻↑G{{value}}", "1811390": "B技後 能力5種 ↑G{{value}}", "1811400": "毒Z時 攻撃時 能力↓{{value}}", "1811410": "命中時 能力2↑{{value}}", "1811420": "登場時 攻撃素早↑{{value}}", "1811430": "相手に P変化技 使用時 防御2↓{{value}}", "1811440": "麻痺相手 攻撃時 防御↓{{value}}", "1811450": "被攻撃時 相手に 能力5種中1種 2↓{{value}}", "1811460": "相手に 初B技後 能力↓2倍", "1811470": "登場時 特攻素早さ ↑{{value}}", "1811480": "命中時 特防↓{{value}}", "1811490": "B技後 能力7種↑{{value}}", "1811500": "T技後 攻撃特攻↑{{value}}", "1811510": "BD技後 攻撃特攻↑G{{value}}", "1811520": "初P変化技 使用時 急所率↑G{{value}}", "1811530": "相手に P変化技 使用時 攻撃2↓{{value}}", "1811540": "被攻撃時 特攻↑G{{value}}", "1811550": "C時 攻撃時 攻撃特攻↓{{value}}", "1811560": "相手に B技後 攻撃特攻↓{{value}}", "1811570": "登場時 回避率↑G{{value}}", "1811580": "交代禁止相手 攻撃時 能力5種中 1種↑G{{value}}", "1811590": "初T技後 防御特防↑{{value}}", "1811600": "自身全体か 味方の場 発生時 攻撃特攻↑G{{value}}", "1811610": "相手に P変化技 使用時 防御↓{{value}}", "1811620": "攻撃時 攻撃特攻 ↓{{value}}", "1811630": "相手に BD技後 特防↓G{{value}}", "1811640": "味方に 技後 特防↑{{value}}", "1811650": "P変化技 使用時 特攻↑{{value}}", "1811660": "登場時 特攻特防 アップ{{value}}", "1811670": "麻痺相手 攻撃時 特防↓{{value}}", "1811680": "被攻撃時 相手に 攻撃&特攻↓{{value}}", "1811690": "初登場時 攻撃↓G{{value}}", "1811700": "交代禁止相手 攻撃時 攻撃特攻↓{{value}}", "1811710": "晴時 攻撃時 攻撃防御↓{{value}}", "1811720": "技後 技ゲージ2↑{{value}}", "1811730": "攻撃時 3回能力↓{{value}}", "1811740": "速攻技後 能力2↓{{value}}", "1811750": "技後 特攻2 急所率1↑{{value}}", "1811760": "晴時 攻撃時 能力2種↓{{value}}", "1811770": "登場時 特攻回避↑{{value}}", "1811780": "登場時 特攻4 急所率{{value}}↑", "1811790": "相手に P技B技後 防御↓{{value}}", "1811800": "初登場時 能力7種↓G{{value}}", "1811810": "霰時 攻撃時 特防↓{{value}}", "1811820": "初B技後 命中回避↓G{{value}}", "1811830": "自身C 発生時 防御特防2↑G{{value}}", "1811840": "初登場時 防御 特防↑{{value}}", "1811850": "攻撃時 特防2↓{{value}}", "1811860": "味方に 技後 特攻↑{{value}}", "1811870": "麻痺相手 攻撃時 攻撃2↓{{value}}", "1811880": "被攻撃時 回避率2 ↑G{{value}}", "1811890": "P変化技 使用時 防御特防↑{{value}}", "1811900": "初登場時 能力7種↑{{value}}", "1811910": "被攻撃時 相手に 素早さ2↓{{value}}", "1811920": "晴時 攻撃時 防御特防↓{{value}}", "1811930": "相手に BD技後 特防↓{{value}}", "1811940": "初シンオウC 特殊 発生時 特攻↑{{value}}", "1811950": "B技後 自身 防御特防↓{{value}}", "1811960": "技後 自身 防御特防↓{{value}}", "1811970": "火傷相手 攻撃時 特攻特防↓{{value}}", "1811980": "麻痺相手 攻撃時 攻撃特攻↑G{{value}}", "1811990": "相手失敗時 能力2↑G{{value}}", "1812010": "味方に 技後 攻撃↑{{value}}", "1812020": "地震後 攻撃↓{{value}}", "1812030": "素早さ↓ 反転", "1812040": "初登場時 攻撃↑{{value}}", "1812050": "初登場時 特攻↑{{value}}", "1812060": "攻撃時 特攻特防↓{{value}}", "1812070": "妖Z時 攻撃時 2回能力↓{{value}}", "1812080": "火傷相手 攻撃時 能力2↓{{value}}", "1812090": "拘束相手 攻撃時 素早2↓{{value}}", "1812100": "味方が WFZ 発生時 能力5種中 1種2↑G{{value}}", "1812110": "T技回数 1以上時 攻撃時 特防↓{{value}}", "1812120": "T技回数 0時 攻撃時 能力2↓{{value}}", "1812130": "混乱相手 攻撃時 命中↓{{value}}", "1812140": "攻撃時 能力2↓{{value}}", "1812150": "火傷相手 攻撃時 攻撃特攻↓{{value}}", "1812160": "攻撃時 攻撃2↓{{value}}", "1812170": "命中時 素早さ↑{{value}}", "1812180": "攻撃時 特攻4↓{{value}}", "1812190": "初P変化技 使用時 特攻↑{{value}}", "1812200": "初P変化技 使用時 急所↑{{value}}", "1812210": "攻撃時 特防3↓{{value}}", "1812220": "異常相手 味方攻撃時 能力↓{{value}}", "1812240": "被攻撃時 能力統一2↑G{{value}}", "1812260": "P変化技 使用時 素早6↑{{value}}", "1812270": "晴時 味方攻撃時 素早↑G{{value}}", "1812280": "拘束相手 味方攻撃時 能力↑{{value}}", "1812290": "相手に P技後 特攻↓{{value}}", "1812300": "攻撃時 命中率3↓{{value}}", "1812310": "BD技後 防御特防↑{{value}}", "1812320": "晴時 攻撃時 防御↓{{value}}", "1812330": "闘Z時 攻撃時 特防↓{{value}}", "1812340": "自身 イッシュC 特殊 発生時 防御特防2↑G{{value}}", "1812350": "攻撃時 防御特防2↑G{{value}}", "1812360": "初登場時 能力7種↑G{{value}}", "1812370": "インファ後 攻撃特攻↓{{value}}", "1812380": "火傷相手 攻撃時 防御特防↓{{value}}", "1812390": "自身 イッシュC 特殊 発生時 攻撃2↑G{{value}}", "1812400": "自身 イッシュC 特殊 発生時 特攻2↑G{{value}}", "1812410": "Bテラスタル 時攻撃↑{{value}}", "1812420": "雨時 攻撃時 能力2↓{{value}}", "1812430": "自身 初岩ダメ場 発生時 攻撃↑{{value}}", "1812440": "自身 初岩ダメ場 発生時 急所率↑{{value}}", "1812450": "相手 岩ダメ場時 攻撃時 能力2↓{{value}}", "1812460": "技後 攻撃素早↑G{{value}}", "1812470": "火傷相手 攻撃時 攻撃防御2↓{{value}}", "1812480": "毒相手 攻撃時 防御特防↓{{value}}", "1812490": "攻撃時 防御6↓{{value}}", "1812500": "攻撃時 特防6↓{{value}}", "1812510": "味方が C 発生時 素早2↑G{{value}}", "1812520": "初ジョウトC 特殊 発生時 特攻↑G{{value}}", "1812530": "初ジョウトC 特殊 発生時 急所↑G{{value}}", "1812540": "物理 攻撃時 物理⇑3 付与{{value}}", "1812550": "特殊 攻撃時 特殊⇑3 付与{{value}}", "1812560": "初登場時 攻撃 特攻 ↓G{{value}}", "1812570": "攻撃時 特攻2↓{{value}}", "1812580": "攻撃時 防御 素早さ↓{{value}}", "1812590": "混乱相手 攻撃時 特防2↓{{value}}", "1812600": "攻撃時 防御3↓{{value}}", "1812610": "初登場時 急所率↑{{value}}", "1812620": "防御成功時 防御4↓G{{value}}", "1812630": "防御成功時 特防4↓G{{value}}", "1812640": "相手に P技B技後 防御特防2↓{{value}}", "1812650": "相手に 技後 能力統一2↓{{value}}", "1812660": "攻撃時 2回能力統一↓{{value}}", "1812670": "初登場時 防御 特防↑G{{value}}", "1812680": "登場時 攻撃6 急所率{{value}}↑", "1812690": "相手に 技後 攻撃2↓{{value}}", "1812700": "相手に 技後 特攻2↓{{value}}", "1812710": "攻撃時 攻撃 防御2↓{{value}}", "1812720": "初登場時 特攻{{value}} 急所3↑", "1812730": "相手に P変化技 使用時 攻撃特攻↓{{value}}", "1812740": "GF時 攻撃時 防御2↓{{value}}", "1812750": "岩Z時 攻撃時 攻撃2↓{{value}}", "1812760": "混乱相手 攻撃時 能力2↓{{value}}", "1812770": "攻撃時 攻撃 防御↓{{value}}", "1812780": "能力↓反射", "1812790": "自身 サークル 発生時 素早2↑G{{value}}", "1812810": "EF時 攻撃時 能力↓{{value}}", "1812820": "初登場時 BC1加速 & 急所率3↑", "1812840": "攻撃時 攻撃2↑G{{value}}", "1812850": "攻撃時 特攻2↑G{{value}}", "1812860": "初B技後 10回能力↓G", "1902010": "初ピンチ時 場に物理軽減", "1902020": "B技後 GF化", "1902030": "初登場時 霰化", "1902040": "登場時 場に 異常防御", "1902050": "初B技後 ゲージ加速", "1902060": "初登場時 晴れ化", "1902070": "初登場時 雨化", "1902080": "晴れ時間 延長{{value}}", "1902090": "雨時間 延長{{value}}", "1902100": "初登場時 砂嵐化", "1902110": "初B技後 晴れ化", "1902120": "初B技後 雨化", "1902130": "初B技後 砂嵐化", "1902140": "初登場時 場に両壁", "1902150": "P技後 W解除{{value}}", "1902160": "初B技後 場に 急所防御", "1902170": "回復技後 ゲージ加速", "1902180": "初B技後 EF化", "1902190": "砂嵐時間 延長{{value}}", "1902200": "初登場時 砂嵐化 & 砂嵐無効", "1902210": "初P変化技 使用時 ゲージ加速", "1902220": "P変化技使用時 ゲージ加速", "1902230": "初ピンチ時 ゲージ加速", "1902240": "初B技後 地Z化", "1902250": "初登場時 地Z化", "1902260": "物理軽減 時間延長{{value}}", "1902270": "特殊軽減 時間延長{{value}}", "1902280": "状態異常防御 時間延長{{value}}", "1902290": "BD技後 EF化", "1902300": "初登場時 鋼Z化", "1902310": "妖Z 時間延長{{value}}", "1902320": "初登場時 妖Z化", "1902330": "初登場時 竜Z化", "1902340": "B技後 雨化", "1902350": "B技後 EF化", "1902360": "初登場時 飛Z化", "1902370": "技後 場にゲージ加速{{value}}", "1902380": "岩Z 時間延長{{value}}", "1902390": "B技後 技ゲージ加速", "1902400": "初登場時 場に物理軽減", "1902410": "初B技後 闘Z化", "1902420": "初登場時 EF化&EF 時間延長{{value}}", "1902430": "初登場時 妖Z化 & 妖Z 時間延長{{value}}", "1902440": "初登場時 GF化&GF 時間延長{{value}}", "1902450": "初登場時 PF化&PF 時間延長{{value}}", "1902460": "能力↑不可時間 延長{{value}}", "1902470": "技後 場に物理軽減{{value}}", "1902480": "自身 氷Z 発生時 霰化", "1902490": "B技後PF化", "1902500": "B技後 妖Z化", "1902510": "初登場時 氷Z化", "1902520": "霰 時間延長{{value}}", "1902530": "氷Z 時間延長{{value}}", "1902540": "とどめ時 場に技ゲージ加速{{value}}", "1902550": "初登場時 霊Z化", "1902560": "初登場時 場に 特殊軽減", "1902570": "初B技後 霰化", "1902580": "龍Z 時間延長{{value}}", "1902590": "B技後 悪Z化", "1902600": "初HP半減時 晴れ化", "1902610": "相手 悪ダメ場 時間延長{{value}}", "1902620": "初B技後場に 能力↑不可", "1902630": "技後 急所防御{{value}}", "1902640": "毒Z 時間延長{{value}}", "1902650": "初B技後 毒Z化", "1902660": "EF 時間延長{{value}}", "1902670": "初B技後 無Z化", "1902680": "イッシュC 物理 時間延長{{value}}", "1902690": "B技後 飛Z化", "1902700": "飛Z 時間延長{{value}}", "1902710": "カントーC 特殊 時間延長{{value}}", "1902720": "T技後 場に急所防御{{value}}", "1902730": "ジョウトC 物理 時間延長{{value}}", "1902740": "GF 時間延長{{value}}", "1902750": "自身場に 急所防御 発生時場に 物理 & 特殊軽減", "1902760": "初登場時 岩Z化", "1902770": "B技後 岩Z化", "1902780": "鋼Z 時間延長{{value}}", "1902790": "シンオウC 防御 時間延長{{value}}", "1902800": "初登場時 EF化", "1902810": "初登場時 毒Z化", "1902820": "地Z 時間延長{{value}}", "1902830": "技後 能力↑不可{{value}}", "1902840": "初P変化技 使用時 鋼Z化", "1902850": "イッシュC 防御 時間延長{{value}}", "1902860": "初攻撃時 場に 能力↑不可", "1902870": "初登場時 悪Z化", "1902880": "ガラルC 特殊 時間延長{{value}}", "1902890": "初HP半減時 霰化", "1902900": "BD技後 場に 技ゲージ加速", "1902910": "霊Z 時間延長{{value}}", "1902920": "悪Z 時間延長{{value}}", "1902930": "アローラC 特殊 時間延長{{value}}", "1902940": "アローラC 防御 時間延長{{value}}", "1902950": "T技後 場に ゲージ加速{{value}}", "1902960": "パシオC 防御 時間延長{{value}}", "1902970": "B技後 氷Z化", "1902980": "初登場時 GF化", "1902990": "キョダイコランダ後 GF化", "1903020": "炎ダメ場 無効", "1903080": "毒ダメ場 無効", "1903130": "岩ダメ場 無効", "1903160": "悪ダメ場 無効", "1903170": "鋼ダメ場 無効", "1904020": "炎ダメ場 耐性{{value}}", "1904080": "毒ダメ場 耐性{{value}}", "1904130": "岩ダメ場 耐性{{value}}", "1904160": "悪ダメ場 耐性{{value}}", "1904170": "鋼ダメ場 耐性{{value}}", "1904190": "全ダメージの場 耐性{{value}}", "1905010": "初あまごい 使用時 妖Z化", "1905020": "キョダイカキュウ後 晴れ化", "1905030": "ダイナックル後 闘Z化", "1905040": "ダイジェット後 飛Z化", "1905050": "BD技後 晴れ化", "1905060": "初B技後 氷Z化", "1905070": "初B技後 龍Z化", "1905080": "初 日本晴れ 使用時 GF化", "1905090": "BD技後 無Z化", "1905100": "無Z 時間延長{{value}}", "1905110": "パルデアC 防御 時間延長{{value}}", "1905120": "BD技後 霊Z化", "1905130": "初登場時 PF化", "1905140": "初P技後 闘Z化", "1905150": "BD技後 毒Z化", "1905160": "初P技後 PF化", "1905170": "PF時間 延長{{value}}", "1905180": "初登場時 毒ダメ場化", "1905190": "初B技後 岩Z化", "1905200": "初攻撃時 雨化", "1905210": "初きのみ0時 鋼Z化", "1905220": "被攻撃時 砂嵐化{{value}}", "1905230": "キョダイ テンバツ 後 妖Z化", "1905240": "初妖願 使用時 EF化", "1905250": "ダイロック後 岩Z化", "1905260": "初登場時 虫Z化", "1905270": "虫Z 時間延長{{value}}", "1905280": "初P技後 砂嵐化", "1905290": "ダイアース後 地Z化", "1905300": "EF使用時 毒Z化", "1905310": "初B技後 GF化", "1905320": "初登場時 無Z化", "1905330": "初T技後 GF化", "1905340": "初登場時 場に アローラC 特殊", "1905350": "B技後 炎ダメ場化", "1905360": "自身 雨 発生時 場にガラルC 特殊", "1905370": "自身 GF 発生時 場にガラルC 物理", "1905380": "自身 晴れ 発生時 場にガラルC 防御", "1905390": "B技後 W解除{{value}}", "1905400": "初登場時 場に パルデアC 特殊", "1905410": "初B技後 場に パルデアC 特殊", "1905420": "地Z時 ゲージ加速{{value}}", "1905430": "B技後 毒ダメ場化", "1905440": "相手 毒ダメ場 時間延長{{value}}", "1905450": "初登場時 EX晴れ化", "1905460": "初登場時 EX雨化", "1905470": "登場時 能力↑不可", "1905480": "カントーC 防御 時間延長{{value}}", "1905490": "ホウエンC 防御 時間延長{{value}}", "1905500": "初B技後 場に カントーC 防御", "1905510": "初B技後 場に ホウエンC 防御", "1905520": "初B技後 場に パルデアC 防御", "1905530": "シンオウC 特殊 時間延長{{value}}", "1905540": "ゲージ加速 時間延長{{value}}", "1905550": "ホウエンC 物理 時間延長{{value}}", "1905560": "ジョウトC 防御 時間延長{{value}}", "1905570": "初パルデアの 結束: 妖Z化", "1905580": "BD技後 EX虫Z化", "1905590": "ジョウトC 特殊 時間延長{{value}}", "1905600": "初登場時 ジョウトC 特殊", "1905610": "初T技後 パルデアC 防御", "1905620": "初登場時 イッシュC 防御", "1905630": "初B技後 場に イッシュC 防御", "1905640": "BD技後 龍Z化", "1905650": "闘Z 時間延長{{value}}", "1905660": "初B技後 場に ジョウトC 防御", "1905670": "初B技後 場に カロスC 防御", "1905680": "初B技後 場に ガラルC 防御", "1905690": "カロスC 防御 時間延長{{value}}", "1905700": "ガラルC 防御 時間延長{{value}}", "1905710": "初登場時 シンオウC 防御", "1905720": "初攻撃時 EX飛Z化", "1905730": "初登場時 場に 特殊軽減 & 特殊軽減 時間延長{{value}}", "1905740": "初攻撃時 霊Z化", "1905750": "初攻撃時 霊Z化 & 霊Z 時間延長{{value}}", "1905760": "B技後 場に 特殊軽減", "1905770": "自身 晴 発生時 闘Z化", "1905780": "初登場時 パルデアC 防御", "1905790": "初登場時 場にイッシュC 特殊", "1905800": "登場時 ジョウトC 物理 & 物理⇑G{{value}}", "1905810": "初攻撃時 岩Z化", "1905820": "初攻撃時 龍Z化", "1905830": "初B技後 場に カントーC 物理", "1905840": "初攻撃時 EX毒Z化", "1905850": "初B技後 場に シンオウC 特殊", "1905860": "初T技後 EX霊Z", "1905870": "初攻撃時 EXEF化", "1905880": "初攻撃時 EX地Z化", "1905890": "初B技後 妖Z化", "1905900": "晴れ & 闘Z 時間延長{{value}}", "1905910": "初攻撃時 場に パルデアC 防御", "1905920": "初B技後 場に シンオウC 防御", "1905930": "初B技後 場に アローラC 防御", "1905940": "初登場時 場にホウエンC 防御", "1905950": "相手 岩ダメ場 時間延長{{value}}", "1905960": "Bテラスタル時 悪Z化", "1905970": "イッシュC 特殊 時間延長{{value}}", "1905980": "初登場時 闘Z化", "1905990": "初登場時 場にガラルC 防御", "1906000": "初登場時 場に ガラルC 防御 & 時間延長{{value}}", "1906010": "初登場時 場にシンオウC 特殊", "1906020": "初登場時 場に シンオウC 特殊 & 時間延長{{value}}", "1906030": "初登場時 場に カントーC 物理 & 時間延長{{value}}", "1906040": "初攻撃時 場にカントーC 特殊", "1906050": "初B技後 場にカントーC 特殊", "1906060": "味方が 晴 発生時 地Z化", "1906070": "初B技後 霊Z化", "1906080": "初攻撃時 PF化 & PF時間 延長{{value}}", "1906090": "初B技後 場に イッシュC 物理", "1906100": "パルデアC 特殊 時間延長{{value}}", "1906110": "初P変化技 使用時 EX氷Z化", "1906120": "初登場時 場にパシオC 防御", "1906130": "T技後場に カントーC 特殊", "1906140": "初B技後 飛Z化", "1906150": "初攻撃時 毒Z化", "1906160": "初T技後 虫Z化", "1906170": "初攻撃時 晴れ化", "1906180": "初攻撃時 晴れ化 & 晴れ時 間延長{{value}}", "1906190": "B技後 無Z化", "1906200": "S技攻撃時 GF化", "1906210": "S技攻撃時 GF化 & GF時間 延長{{value}}", "1906220": "初P変化技 使用時 妖Z化", "1906230": "初攻撃時 虫Z化", "1906240": "初B技後 PF化", "1906250": "初登場時 永続砂嵐化", "1906260": "初登場時 永続晴れ化", "1906270": "初登場時 永続飛Z化", "1906280": "登場時 場に 物理軽減", "1906290": "登場時 場に特殊軽減", "1906300": "初登場時 場にカントーC 特殊", "1906310": "初攻撃時 氷Z化", "1906320": "初P変化技 使用時 地Z化", "1906330": "初T技後 飛Z化", "1906340": "初B技後 毒Z化 & 毒Z 時間延長{{value}}", "1906360": "BD技後 悪Z化", "1906370": "初攻撃時 妖Z化", "1906380": "初攻撃時 場にジョウト C防御", "1906390": "GF & 岩Z 時間延長{{value}}", "1906400": "技後 雨化", "1906410": "技後 悪Z化", "1906420": "技後 雨化 & 悪Z化", "1906430": "雨 & 悪Z 時間延長{{value}}", "1906440": "初B技後 雨化 & 雨 時間延長{{value}}", "1906450": "シンオウC 物理 時間延長{{value}}", "1906460": "初攻撃時 岩Z化 & 岩Z 時間延長{{value}}", "1906470": "初S技攻撃時 EX闘Z化", "1906480": "カロスC 3種 時間延長{{value}}", "1906490": "パルデアC 物理 時間延長{{value}}", "1906500": "自身 鋼Z 発生時 場にガラルC防御", "1906510": "初登場時 場に 永続物理軽減", "1906520": "初登場時 場に 永続特殊軽減", "1906560": "カントーC 物理 時間延長{{value}}", "1906570": "ガラルC 物理 時間延長{{value}}", "1906580": "初B技後 場にジョウトC 物理", "1906590": "初B技後 場にジョウトC 特殊", "1906600": "初B技後 場にガラルC 物理", "1906610": "初B技後 場にガラルC 特殊", "1906620": "初 テラバースト 虹玉後 無Z化", "1906630": "初B技後 場にカントーC 3種 & 時間延長{{value}}", "1906640": "初攻撃時 EF化", "1906650": "初登場時 場にカントーC 物理", "1906660": "初登場時 場にカントーC 防御", "1906670": "初攻撃時 悪Z化 & 悪Z 時間延長{{value}}", "1906680": "初登場時 永続妖Z化", "1906710": "初登場時 永続悪Z化", "1906720": "初B技後 こぶしZ化 & こぶしZ時 急所無効G", "1906730": "初はどうだん 神気0時 場にカロスC 特殊", "1906740": "カロスC 特殊 時間延長{{value}}", "1906750": "初いわくだき 天破0時 場にカロスC 物理", "1906760": "カロスC 物理 時間延長{{value}}", "1906770": "物理 & 特殊軽減 時間延長{{value}}", "1906780": "技後場に 物理 & 特殊軽減{{value}}", "1906790": "初攻撃時 飛Z化", "1906830": "初B技後 無Z化 & 無Z 時間延長{{value}}", "1906840": "登場時 PF化", "1906850": "初攻撃時 GF化", "1906860": "初攻撃時 GF化 & GF 時間延長{{value}}", "1906880": "初攻撃時 闘Z化", "2101020": "雨時 急所無効G", "2101030": "悪Z時 急所無効G", "2101040": "氷Z時 急所無効G", "2101050": "パルデアC 防御時 急所無効G", "2101060": "PF時 急所無効", "2101070": "急所無効G", "2101080": "相手 毒ダメ場 時急所無効G", "2101090": "ゲージ加速時 急所無効G", "2101100": "イッシュC 特殊時 急所無効G", "2101110": "岩Z時 急所無効G", "2101120": "C時 急所無効G", "2101130": "無Z時 急所無効G", "2101140": "F時 急所無効", "2101150": "飛Z時 急所無効", "2101160": "龍Z時 急所無効G", "2201010": "異常確率↑{{value}}", "2201020": "妨害確率↑{{value}}", "2201030": "↓確率↑{{value}}", "2201040": "急所時 妨害確率↑{{value}}", "2201050": "↑確率↑{{value}}", "2201060": "異常妨害 確率↑{{value}}", "2201070": "↓ 確率 & 効果 2倍", "2301010": "砂時 特防↑", "2301020": "霰時 防御↑", "2301030": "PF時 特防↑", "2301040": "砂嵐無効 & 防御特防 ↑", "2301050": "HP半分以上時 攻撃↑{{value}}", "2301060": "P技全体化", "2301070": "B技後 P技全体化", "2301090": "HP半減時 防御特防↑{{value}}", "2301100": "霰時 防御特防 ↑", "2301110": "W変化時 能力5種 ↑", "2301120": "P変化技 使用時 能力↑ 全体化{{value}}", "2301130": "B技全体化", "2301140": "BD技全体化", "2301150": "場対象時 能力5種↑{{value}}", "2301160": "HP減少時 特攻↑{{value}}", "2301170": "P技BD技全体化", "2301180": "相手に P変化技 ↓G{{value}}", "2301190": "晴れ時 攻撃↑{{value}}", "2301200": "EF時 特攻↑{{value}}", "2301210": "P技B技 全体化", "2301220": "P技B技攻撃全体化", "2301230": "Bテラスタル中能力5種↑{{value}}", "2401010": "無ガード", "2401020": "炎ガード", "2401030": "水ガード", "2401040": "電ガード", "2401050": "草ガード", "2401060": "飛ガード", "2401070": "闘ガード", "2401080": "毒ガード", "2401090": "地ガード", "2401100": "飛ガード", "2401110": "超ガード", "2401120": "虫ガード", "2401130": "岩ガード", "2401140": "霊ガード", "2401150": "龍ガード", "2401160": "悪ガード", "2401170": "鋼ガード", "2401180": "妖ガード", "2401200": "龍ガードG", "2401210": "炎ガードG", "2401220": "水ガードG", "2401240": "草ガードG", "2501010": "古代の 雄叫び", "2501020": "古代の 羽ばたき", "2501030": "古代の 雷鳴", "2801010": "ガラルの 先導", "2801020": "ホウエンの 闘志", "2801030": "ホウエンの 信念", "2801040": "イッシュの 先導", "2801050": "ホウエンの 先導", "2801060": "アローラの 先導", "2801070": "アローラの 信念", "2801080": "カロスの 先導", "2801090": "ジョウトの 信念", "2801100": "ジョウトの 闘志", "2801110": "ジョウトの 先導", "2801120": "カントーの 先導", "2801130": "カントーの 信念", "2801140": "カロスの 闘志", "2801150": "カロスの 信念", "2801160": "ガラルの 闘志", "2801170": "ガラルの 信念", "2801180": "シンオウの 闘志", "2801190": "シンオウの 信念", "2801200": "カントーの 闘志", "2801210": "イッシュの 闘志", "2801220": "パルデアの 先導", "2801230": "イッシュの 信念", "2801240": "パルデアの 闘志", "2801250": "パシオの 先導", "2801260": "パルデアの 信念", "2801270": "アローラの 闘志", "2802010": "岩の カリスマ", "2802020": "闘の カリスマ", "2802030": "炎の カリスマ", "2802040": "シンオウの 先導", "2802050": "地の カリスマ", "2802060": "超の カリスマ", "2802070": "飛の カリスマ", "2802080": "鋼の カリスマ", "2802090": "草の カリスマ", "2802100": "電の カリスマ", "2901010": "こうてつの 神話", "2901020": "りゅうの 神話", "2901030": "だいちの 神話", "2901040": "火の玉 の 神話", "2901050": "こわもての 神話", "2901060": "虫の 神話", "2902010": "こうてつの 裁き", "2902020": "りゅうの 裁き", "2902030": "だいちの 裁き", "2902040": "火の玉 の 裁き", "2902050": "こわもての 裁き", "2902060": "虫の 裁き", "3201040": "題名･彼岸に降る雨", "3201110": "レッツゴー! イーブイ!", "3201310": "守り神が もたらす実り", "3201320": "駆ける 北風を 追う男", "3201330": "高みへ 勝ちあがる 王者", "3201340": "タワー タイクーンの 言葉", "3201350": "ヒスイを 生き抜いた 術", "3201360": "あのころの スパイクタウン", "3201370": "レッツゴー! ピカチュウ!", "3201380": "クララに クラクラァ", "3201390": "エレガント 超パワー", "3201400": "ウルトラな 積み重ね", "3201410": "ミュージック スタート!", "3201420": "アカデミーを 背負う者", "3201430": "高鳴る 胸の 鼓動", "3201440": "涙を 流し 奪うもの", "3201450": "スパイクタウンの 新星", "3201460": "カロスの 大女優", "3201470": "呼び覚ます 笛の音", "3201480": "先を いく強さ", "3201490": "暗闇の 中で 眠る世界", "3201500": "青空を とぶ パイロット", "3201510": "ピンクの エリートの 意地", "3201520": "優しい 心の 青き 翼", "3201530": "古代の ハンティング スキル", "3201540": "世界を 変える 数式", "3201550": "醜い 世界を 一新する 力", "3201580": "ウォオオオーーーッ!!!", "3201590": "お待ちなさいな!", "3201610": "妖精王の 剣", "3201620": "共に 歩む 素晴らしさ", "3201630": "龍 ストーム", "3201640": "きずなを 重んじる 王", "3201650": "無限大の 王者", "3201660": "シャイニング ビューティ", "3201670": "三日月の 加護", "3201680": "素直な 心の 赤き翼", "3201690": "謎の ジムリーダーの 正体", "3201700": "受け継いだ 水の 極意", "3201710": "突然変異の いし", "3201720": "緑髪の 貴公子", "3201730": "勝利を もたらす 闘志", "3201740": "国際警察の エリート", "3201750": "戦好きの 守り神", "3201760": "命が あふれる 鱗粉", "3201770": "ポケモンへの 愛情と 信頼", "3201780": "悪を 征するもの", "3201790": "ステージマドンナの 試練", "3201800": "理性を ブッとばす 音楽", "3201810": "エレキトリカル ★ ストリーマー", "3201820": "ルーレット ゴッデスの 笑顔", "3201830": "元研究者の テクニック", "3201840": "パルデア 四天王の 露払い", "3201850": "非凡 サラリーマン", "3201860": "アリーナキャプテンの 判定", "3201870": "ウルトラな 出会い", "3201880": "元気 ハッスルちゃん", "3201900": "スター団の 何でも屋", "3201910": "猛毒は ひと粒でも 脅威!", "3201920": "カセキ ポケモンの ロマン", "3201930": "世界に 羽ばたく とり使い", "3201940": "雪のように 冷たい 現実", "3201950": "メカニック 御曹司の プライド", "3201960": "鉱山王の 令嬢", "3201970": "難関を 踏破した 実力者", "3201980": "未来からの 乱入者", "3202010": "エボリューション ファイター!", "3202020": "頭を 燃やせ 動かせ!", "3202030": "脳内 フォルダに 焼きつけろ～!", "3202040": "ファンの 期待に 応えないと", "3301050": "初登場時 くさ Bテラスタル", "3301070": "初登場時 かくとう Bテラスタル", "3301080": "初登場時 どくBテラスタル", "3301130": "初登場時 いわBテラスタル", "3301150": "初登場時 ドラゴンBテラスタル", "3301160": "初登場時 あくBテラスタル", "3301190": "初B技時 草Bテラスタル", "3301200": "初B技時 ステラBテラスタル", "5130206": "非変化時P技B技 軽減{{value}}", "5130207": "非異常時P技B技 軽減{{value}}", "5130212": "非デメリット変化時P技B技 軽減{{value}}", "5170401": "とどめ時 次回急所", "5230101": "登場時 防御{{value}}倍", "5230102": "登場時 特防{{value}}倍", "9901040": "ARシステム", "9901100": "サカキの 手腕", "9901120": "水ガード & 雨時HP回復", "9901190": "オシャレに悪へんげ", "9901200": "麗しく水へんげ", "9901210": "静かな闘志で水へんげ", "9901220": "ストイックに悪へんげ", "9901240": "パシオの エース", "9901250": "キリヤの 決意", "9901260": "マサラの 旅立ち", "9901270": "輝き舞う 白雪", "9901280": "マサラの プライド", "9901290": "轟く 白雷", "9901300": "マサラの 愛情", "9901310": "夜空を 照らす 白炎", "9901320": "サカキの 経験", "9901330": "アポロの 提案", "9901340": "アテナの 威圧", "9901350": "ラムダの 策略", "9901360": "ランスの 作戦", "9901370": "調査隊の 心得", "9901380": "スターの シャウト", "9901390": "ファクトリーの 知識", "9901400": "痛快で ハイな歌声", "9901410": "哀愁ある ローな歌声", "9901420": "カントーの 旅で 得たもの", "9901440": "古の ノスタルジー", "9901450": "演目･ 超", "9901451": "演目･ 闘", "9901460": "感情を操る 旋律", "9901470": "草タイプの 研究成果", "9901480": "作戦･ 攻撃重視", "9901490": "ベストすぎる チャンス", "9901500": "ボクへの 応援してしてー!", "9901510": "ビックリ イリュージョン!", "9901520": "雪山の 恐ろしさ", "9901530": "駆け抜ける ビリビリ", "9901540": "ちょっと つまみ食い", "9901550": "おかわりあるよ!", "9901560": "そそられる 好奇心", "9901580": "ご注文は こっち?", "9901590": "ダンシング ヒート", "9901600": "トップ チャンピオン の 圧", "9901610": "トップ チャンピオン の 輝き", "9901620": "破壊する 本能", "9901630": "赤い髪の 反抗心", "9901640": "トップ チャンピオン の 才", "9901650": "商いの チャンス", "9901660": "ジニア 先生の 授業", "9901670": "魔法の 国の ルール", "9901680": "季節を 巡らせる力", "9901690": "新米教師の 機転", "9901700": "仲間を 守る 決意", "9901710": "博士助手の 観察結果", "9901720": "社会人の テクニック", "9901730": "ぐーんと 育って!", "9901740": "触ると 危ないよ……", "9901750": "ポイズン フルコース", "9901770": "ペパー お兄さんの 元気じるし", "9901780": "秘伝 スパイスの 効能", "9901790": "アローラで みんな仲良し!", "9901800": "元気で 明るい 生徒会長", "9901810": "実る 攻撃", "9901820": "冒険を 経て 得たもの", "9901830": "さすらいの 石マニア", "9901840": "シッポ 巻いて 帰るかい!", "9901850": "龍の ドラゴン使い", "9901860": "重ねた 苦労", "9901870": "神話の 考古学者", "9901880": "ポケモンと 信じあう力", "9901890": "負けられない プライド", "9901900": "黄金の 威光", "9901910": "王家の 財力", "9901920": "小説家の 怪談語り", "9901930": "DJ悪事の 周波数", "9901940": "未来の 王を 支える力", "9901980": "最後まで立っていた者が勝つ!!", "9901990": "サカキの 欲望", "9902000": "熱狂の 声に 応える 王者", "9902010": "チャンピオン タイム!", "9902020": "無敵の ダンデ", "9902040": "爆発する 芸術性", "9902050": "ポイズン 食らわば 皿まで!", "9902070": "呼べよ すなあらし!", "9902080": "荒れくるう 記念撮影", "9902090": "カッチカチ ですのー!", "9902100": "紳士的な コンビネーション", "9902110": "穏やかな コンビネーション", "9902120": "粘り腰の 勝負", "9902130": "熱くなる コンビネーション", "9902140": "腹ペコの こどう", "9902150": "自分だけの 宝物", "9902160": "愛情の お返し", "9902170": "贈る 花束", "9902180": "食いしんぼう エンジン", "9902190": "止められない 好奇心", "9902200": "伝わる 優しい心", "9902210": "花開く 才能", "9902220": "借景の ごとき 巨体", "9902230": "無双の 剛力", "9902240": "紅色の 力の 覚醒", "9902250": "神話に 残る 終わりの 大地", "9902260": "ホウエンの 熱気", "9902270": "藍色の 力の 覚醒", "9902280": "神話に 残る 始まりの 海", "9902290": "ホウエンの 恵み", "9902300": "ポケモンと ヒトの 架け橋", "9902310": "数学の 天才", "9902320": "負けず 嫌いな 御曹司", "9902330": "香ばしい 戦略", "9902340": "化石発掘の 成果", "9902350": "高みで 感じる 風", "9902360": "冷めきった 情熱", "9902370": "ガラルを 救った剣", "9902380": "虹色に 輝く 炎", "9902390": "優等生の ヒソヒソ話", "9902400": "マンテンボシの 成績", "9902410": "食いしん坊な 相棒", "9902420": "お嬢の ライドテクニック", "9902430": "暗闇に 揺らめく 人魂", "9902440": "修験者 教師の 怖い話", "9902450": "群れを 率いる 鋼の 輝き", "9902460": "気持ちは 負けてない……!", "9902470": "封じられし 邪悪な 念", "9902480": "弱り目に たたりめ", "9902490": "集合する 魂", "9902500": "深き 海を 泳ぎし者", "9902510": "熱き 大地を 駆ける者", "9902520": "放浪の チャンピオン", "9902540": "ダイマックス･ ランウェイ", "9902550": "雨降る まばゆい ステージ", "9902560": "めっちゃ 元気やでー!", "9902570": "命 爆発ッ!!", "9902590": "未来の 鋼刃", "9902600": "砕けぬ エリート 意識", "9902610": "歴史に 刻む 名前", "9902620": "強さを 競う 純真", "9902630": "重ねてきた 苦労", "9902640": "歌と 舞踏の ステージ", "9902730": "ハイリスク･ ハイリターン", "9902740": "サイコロは 投げられた!", "9902830": "楽しいこと しましょう!", "9902840": "レッツ バカンス!", "9902900": "芽吹く 季節の 始まり", "9902910": "オカルト 研究部の 部長", "9902940": "かいふく プログラム", "9903200": "ダイゴ(スペシャル)の一心", "9903210": "マジコスシロナ(アナザー2)の本気", "9903240": "N(22シーズン)の本気", "9903270": "リーリエ(24シーズン)の本気", "9903280": "ジュン(スペシャル)の全霊", "9903290": "ユウリ(アナザー)の一心", "9903350": "120番道路の思い出", "9903490": "マッハ2の上昇志向", "9903580": "一気に たたみかけるよ!", "9903590": "急所って どこよ!", "9903730": "た~まや~!", "9903740": "着色に取りかかるぞ!", "9903750": "ワタシの 思うがままに!", "9903830": "攻めて 攻めまくる ことよ!", "9903840": "色直しと いこうぜ!", "9903930": "さあ! お祭りだ!", "9903970": "特大の 感謝だ!", "9904090": "フラッシュたくよー!", "9904100": "シャッタースピード ↑!" }, "ko": { "1101010": "첫 위기 시 HP 회복 {{value}}", "1101020": "HP 회복기술 회복량 증가 {{value}}", "1101030": "상대 실패 시 HP 회복 {{value}}", "1101040": "기술 후 HP 회복 {{value}}", "1101050": "기절 시 같은 편 HP 중 회복 {{value}}", "1101060": "B기술 후 HP 중 회복 {{value}}", "1101070": "B기술 후 HP 중 회복 G{{value}}", "1101080": "같은 편에게 기술 후 HP 중 회복 {{value}}", "1101090": "방어 성공 시 HP 회복 {{value}}", "1101100": "공격 시 HP 회복 G{{value}}", "1101110": "피격 시 HP 회복 G{{value}}", "1101120": "발군 시 HP 회복 {{value}}", "1101130": "기술 급소 시 HP 회복 {{value}}", "1101140": "발군 시 HP 회복 G{{value}}", "1101150": "첫 위기 시 HP 모두 회복", "1101160": "회복기술 후 HP 중 회복 G{{value}}", "1101170": "맑을 시 기술 사용 시 HP 회복 G{{value}}", "1101180": "맑을 시 기술 사용 시 HP 회복 {{value}}", "1101190": "주먹존 시 피격 시 HP 회복 G{{value}}", "1101200": "기술 사용 시 HP 회복 {{value}}", "1101210": "휴이의 열의", "1101220": "명중 시 HP 회복 {{value}}", "1101230": "주먹존 시 피격 시 HP 회복 {{value}}", "1101240": "공포존 시 기술 사용 시 HP 회복 G{{value}}", "1101250": "BD기술 후 HP 회복 {{value}}", "1101260": "첫 HP 반감 시 HP 회복 {{value}}", "1101270": "첫 B기술 후 HP 중 회복 G{{value}}", "1101280": "스파이크의 오기", "1101290": "피격 시 HP 회복 {{value}}", "1101300": "주먹존 시 HP 회복 {{value}}", "1101310": "혼란 상대 공격 시 HP 회복 {{value}}", "1101320": "상태이상 상대 공격 시 HP 회복 G{{value}}", "1101330": "GF 시 기술 사용 시 HP 회복 G{{value}}", "1101340": "첫 HP 60% 시 HP 회복 {{value}}", "1101350": "마비 상대 공격 시 HP 회복 {{value}}", "1101360": "공격 시 HP 중회복 {{value}}", "1101370": "순백존 시 HP 회복 {{value}}", "1101380": "첫 P변화기술 사용 시 HP 회복 {{value}}", "1101390": "공격 시 HP 회복 {{value}}", "1101400": "T기술 후 HP 중 회복 {{value}}", "1101410": "맹독존 시 HP 회복 {{value}}", "1101420": "고드름존 시 기술 사용 시 HP 회복 G{{value}}", "1101430": "첫 B기술 후 HP 중 회복 {{value}}", "1101440": "서클 시 HP 회복 {{value}}", "1101450": "방해 상태 상대 공격 시 HP 회복 {{value}}", "1101460": "위기 시 화상 시 공격 시 HP 중 회복 {{value}}", "1101470": "독 상대 공격 시 HP 회복 {{value}}", "1101480": "회복 기술 후 HP 회복 {{value}}", "1101490": "푸른하늘존 시 HP 회복 {{value}}", "1101500": "마비 상대 공격 시 HP 회복 G{{value}}", "1101520": "BD기술 후 HP 회복 G{{value}}", "1101530": "첫 B기술 피격 시 HP 회복 G{{value}}", "1101540": "바인드 상대 같은 편 공격 시 HP 회복 {{value}}", "1101550": "팀 B기술 후 HP 회복 G{{value}}", "1101560": "HP 반감 시 HP 회복 횟수 소비 & HP 회복 5", "1101570": "순백존 시 피격 시 HP 회복 G{{value}}", "1101580": "순백존 시 B기술 피격 시 HP 회복 {{value}}", "1101590": "P기술 B기술 피격 시 HP 반감 시 나무열매 소비 & HP 회복 {{value}}", "1101600": "팀 B기술 후 HP 회복 {{value}}", "1101610": "P기술 후 HP 회복 G{{value}}", "1101620": "고드름존 시 HP 회복 {{value}}", "1101630": "용의존 시 HP 회복 {{value}}", "1101640": "HP 회복량 0", "1201010": "비 올 시 기술게이지 가속 {{value}}", "1201020": "맑을 시 기술게이지 가속 {{value}}", "1201030": "상태이상 시 기술게이지 가속 {{value}}", "1201040": "모래바람 시 기술게이지 가속 {{value}}", "1201050": "싸라기눈 시 기술게이지 가속 {{value}}", "1201060": "EF 시 기술게이지 가속 {{value}}", "1201070": "PF 시 기술게이지 가속 {{value}}", "1201080": "첫 등장 시 필드에 기술게이지 가속", "1201090": "용의존 시 기술게이지 가속 {{value}}", "1201100": "푸른하늘존 시 기술게이지 가속 {{value}}", "1201110": "날씨 변화 시 게이지 가속 {{value}}", "1201120": "공포존 시 기술게이지 가속 {{value}}", "1201130": "강철존 시 기술게이지 가속 {{value}}", "1201140": "원령존 시 기술게이지 가속 {{value}}", "1201150": "비단벌레존 시 기술게이지 가속 {{value}}", "1201160": "GF 시 기술게이지 가속 {{value}}", "1201170": "주먹존 시 기술게이지 가속 {{value}}", "1201180": "정령존 시 게이지 가속 {{value}}", "1201190": "맹독존 시 게이지 가속 {{value}}", "1201200": "암석존 시 기술게이지 가속 {{value}}", "1201210": "같은 편 필드 효과 대상 시 기술게이지 가속 {{value}}", "1201220": "순백존 시 기술게이지 가속 {{value}}", "1201230": "고드름존 시 게이지 가속 {{value}}", "1201240": "서클 시 게이지 가속 {{value}}", "1201250": "날씨 필드 존 변화 시 게이지 가속 {{value}}", "1202010": "기술 후 기술게이지 증가 {{value}}", "1202020": "B기술 후 기술게이지 증가 {{value}}", "1202030": "첫 위기 시 게이지 증가 {{value}}", "1202040": "피격 시 기술게이지 증가 {{value}}", "1202050": "B기술 후 기술게이지 증가 G{{value}}", "1202060": "기술 후 기술게이지 증가 G{{value}}", "1202080": "자신 외 기절 시 게이지 ↑{{value}}", "1202090": "상대 실패 시 기술게이지 ↑{{value}}", "1202100": "공격 시 기술게이지 증가 {{value}}", "1202110": "P기술 후 기술게이지 증가 {{value}}", "1202120": "기술 급소 시 기술게이지 증가 {{value}}", "1202130": "급소 시 기술게이지 증가 {{value}}", "1202140": "방어 성공 시 기술게이지 ↑{{value}}", "1202150": "P변화기술 사용 시 게이지 ↑{{value}}", "1202160": "결정타 시 기술게이지 증가 {{value}}", "1202170": "실패 시 기술게이지 증가 {{value}}", "1202180": "섀도다이브 후 기술게이지 증가 {{value}}", "1202190": "명중 시 기술게이지 증가 {{value}}", "1202200": "혼란 상대 공격 시 기술게이지 2 ↑{{value}}", "1202210": "회피 불가 상대 공격 시 기술게이지 ↑{{value}}", "1202220": "PF 시 기술 사용 시 기술 게이지 ↑{{value}}", "1202230": "화상 시 공격 시 게이지 2 ↑{{value}}", "1202240": "비 올 시 명중 시 기술게이지 ↑{{value}}", "1202250": "교체금지 상대 공격 시 게이지2 ↑{{value}}", "1202260": "혼란 상대 같은 편 공격 시 게이지 2 ↑{{value}}", "1202270": "혼란 상대 같은 편 공격 시 게이지 ↑{{value}}", "1202280": "혼란 상대 공격 시 게이지 ↑{{value}}", "1202290": "독 상대 공격 시 게이지 ↑{{value}}", "1301010": "위기 시 위력 상승 {{value}}", "1301020": "모래바람 시 위력 상승 {{value}}", "1301030": "상태이상 시 위력 상승 {{value}}", "1301040": "발군 시 위력 상승 {{value}}", "1301050": "기술게이지분 위력 상승 {{value}}", "1301060": "급소 시 위력 상승 {{value}}", "1301070": "동시 찬스 시 위력 상승 {{value}}", "1301090": "날씨 변화 시 위력 상승 {{value}}", "1301100": "HP 비례 위력 상승 {{value}}", "1301110": "맑을 시 위력 상승 {{value}}", "1301120": "상대 마비 시 위력 상승 {{value}}", "1301130": "상대 화상 시 위력 상승 {{value}}", "1301140": "싸라기눈 시 위력 상승 {{value}}", "1301150": "상대 얼음 시 위력 상승 {{value}}", "1301160": "비 올 시 위력 상승 {{value}}", "1301170": "혼란 시 위력 상승 {{value}}", "1301180": "상대 혼란 시 위력 상승 {{value}}", "1301190": "상대 특수공격↓분 위력 상승", "1301200": "상대 HP 비례 위력 상승 {{value}}", "1301210": "상대 상태이상 시 위력 상승 {{value}}", "1301220": "상대 방해상태 시 위력 ↑{{value}}", "1301230": "스피드 업 비례 위력 ↑", "1301240": "방어 업 비례 위력 상승", "1301250": "상대 풀죽음 시 위력 상승 {{value}}", "1301260": "상대 잠듦 시 위력 상승 {{value}}", "1301270": "상대 독일 시 위력 상승 {{value}}", "1301280": "상대 바인드 시 위력 ↑{{value}}", "1301300": "상대 명중률↓ 비례 위력 ↑", "1301310": "특수방어 업 비례 위력 ↑", "1301320": "상대 스피드↓ 비례 위력 ↑", "1301330": "회피율 업 비례 위력 ↑", "1301340": "공격 업 비례 위력 상승", "1301350": "명중률 업 비례 위력 ↑", "1301360": "HP 저하 비례 위력 상승 {{value}}", "1301370": "EF 시 위력 상승 {{value}}", "1301380": "상대 방어↓ 비례 위력 상승", "1301390": "상대 특수방어↓ 비례 위력 상승", "1301400": "상대 회피율↓ 비례 위력 ↑", "1301410": "상대 공격↓ 비례 위력 상승", "1301420": "상대 능력↓ 비례 위력 상승", "1301430": "악 타입 위력 상승 {{value}}", "1301440": "페어리 타입 위력 상승 {{value}}", "1301450": "게이지 소비 증가 위력 상승 {{value}}", "1301470": "모양별 위력 상승", "1301480": "상대 교체금지 시 위력 ↑{{value}}", "1301490": "특수공격 업 비례 위력 상승", "1301500": "HP최대등장 시 차회 발군 위력 ↑", "1301510": "교체금지 시 위력 상승 {{value}}", "1301520": "맑을 시 게이지 가속 위력 ↑{{value}}", "1301530": "비 올 시 게이지 가속 위력 ↑{{value}}", "1301540": "HP 최대 시 위력 상승 {{value}}", "1301550": "스피드 다운 시 위력 ↑{{value}}", "1301560": "모래바람 무효 & 모래바람 시 위력 상승 {{value}}", "1301570": "능력↑ 비례 위력 상승", "1301580": "일반 날씨 시 위력 상승 {{value}}", "1301590": "P기술 게이지 소비량 감소 {{value}}", "1301600": "아이스페이스 시 발군 시 위력 상승 {{value}}", "1301610": "PF 시 위력 상승 {{value}}", "1301620": "용의존 시 위력 ↑{{value}}", "1301630": "날씨 변화 시 P기술 B기술 위력 ↑{{value}}", "1301640": "P기술 B기술 발군 시 위력 ↑{{value}}", "1301650": "상대 교체금지 시 P기술 B기술 위력 ↑{{value}}", "1301670": "상대 특수공격 특수방어↓ 비례 위력 ↑", "1301680": "공포존 시 위력 상승 {{value}}", "1301690": "원령존 시 위력 상승 {{value}}", "1301700": "상대 혼란 시 P기술 B기술위력 ↑{{value}}", "1301710": "P기술 B기술 BD기술 발군 시 위력 ↑{{value}}", "1301720": "에스퍼 타입 위력 상승 {{value}}", "1301730": "상대 능력 비↑ 시 위력 ↑{{value}}", "1301740": "상대 스피드↓ 시 위력 ↑{{value}}", "1301750": "상대 명중률↓ 시 위력 ↑{{value}}", "1301760": "대지존 시 위력 ↑{{value}}", "1301770": "강철존 시 위력 상승 {{value}}", "1301780": "상대 바위 타입 데미지 필드 시 위력 ↑{{value}}", "1301790": "반동기술 위력 상승 {{value}}", "1301800": "정령존 시 위력 상승 {{value}}", "1301810": "비단벌레존 시 위력 ↑{{value}}", "1301820": "상대 마비 시 P기술 B기술 ↑{{value}}", "1301830": "공격 업 시 위력 상승 {{value}}", "1301840": "특수공격 업 시 위력 상승 {{value}}", "1301850": "GF 시 위력 상승 {{value}}", "1301860": "상대 화상 시 P기술 B기술 ↑{{value}}", "1301870": "푸른하늘존 시 위력 상승 {{value}}", "1301880": "HP 감소 시 위력 상승 {{value}}", "1301890": "EF 시 위력 상승 G{{value}}", "1301900": "PF 시 위력 상승 G{{value}}", "1301910": "상대 바인드 시 P기술 B기술 ↑{{value}}", "1301920": "히스이로 흘러가는 시간", "1301930": "히스이로 팽창하는 공간", "1301940": "스피드 업 시 위력 ↑{{value}}", "1301950": "방어 업 시 위력 상승 {{value}}", "1301960": "특수방어 업 시 위력 상승 {{value}}", "1301970": "상대 바인드 시 위력 ↑ G{{value}}", "1301980": "싸라기눈 시 P기술 B기술 상승 {{value}}", "1301990": "상대 악 타입 데미지 필드 시 위력 ↑{{value}}", "1302010": "물리 데미지 경감 {{value}}", "1302020": "위기 시 물리 경감 {{value}}", "1302030": "비 올 시 공격기술 경감 {{value}}", "1302040": "반동 데미지 경감 {{value}}", "1302050": "특수 데미지 경감 {{value}}", "1302060": "EF 시 공격기술 경감 {{value}}", "1302070": "HP 최대 시 공격기술 경감 {{value}}", "1302080": "HP 최대 시 P기술 B기술 경감 {{value}}", "1302090": "위기 시 특수 경감 {{value}}", "1302100": "PF 시 공격기술 경감 {{value}}", "1302110": "푸른하늘존 시 공격기술 경감 {{value}}", "1302120": "모래바람 시 공격기술 경감 {{value}}", "1302130": "맑을 시 공격기술 경감 {{value}}", "1302140": "GF 시 공격기술 경감 {{value}}", "1302150": "대기 중 P기술 B기술 경감 {{value}}", "1302160": "강철존 시 공격기술 경감 {{value}}", "1302170": "주먹존 시 공격기술 경감 {{value}}", "1302180": "정령존 시 특수 경감 G{{value}}", "1302190": "GF 시 물리 경감 G{{value}}", "1302200": "싸라기눈 시 공격기술 경감 {{value}}", "1302210": "공포존 시 공격기술 경감 {{value}}", "1302220": "비단벌레존 시 공격 기술 경감 G{{value}}", "1302230": "용의존 시 공격 기술 경감 {{value}}", "1302240": "서클 시 공격 기술 경감 {{value}}", "1302250": "모래바람 시 특수 경감 G{{value}}", "1302260": "정령존 시 공격기술 경감 G{{value}}", "1302270": "대지존 시 공격 기술 경감 {{value}}", "1302280": "싸라기눈 시 물리 경감 G{{value}}", "1302290": "암석존 시 물리 경감 G{{value}}", "1302300": "암석존 시 특수 경감 G{{value}}", "1302310": "상대 악 타입 데미지 필드 시 공격 기술 경감 G{{value}}", "1302320": "상대 저항↓ 시 공격 기술 경감 G{{value}}", "1302330": "고드름존 시 특수 경감 G{{value}}", "1302340": "맑을 시 특수 경감 G{{value}}", "1302350": "상대 독일 시 P기술 B기술 경감 G{{value}}", "1302360": "발군 피격 시 P기술 B기술 경감 G{{value}}", "1302370": "물리 데미지 경감 G{{value}}", "1302380": "같은 편 필드 효과 대상 시 공격기술 경감 G{{value}}", "1302390": "GF 시 공격기술 경감 G{{value}}", "1302400": "필드에 게이지 가속 시 P기술 B기술 경감 G{{value}}", "1302410": "발군 피격 시 P기술 B기술 경감 {{value}}", "1302420": "EX 맑을 시 P기술 B기술 BD기술 물 타입 경감 {{value}}", "1302430": "EX 비 올 시 P기술 B기술 BD기술 불꽃 타입 경감 {{value}}", "1302440": "필드에 게이지 가속 시 공격 기술 경감 {{value}}", "1302450": "맑을 시 공격 기술 경감 G{{value}}", "1302460": "정령존 시 공격 기술 경감 {{value}}", "1303020": "연속 기술 횟수 최대화", "1303030": "맑을 시 필중화", "1303040": "연속 기술 횟수 3회 이상화", "1303050": "필중화 & P기술 B기술 급소화", "1303060": "파괴광선 필중화", "1303070": "필중화 & 반동 데미지 무효", "1305010": "페어리 체인지", "1305020": "비행 체인지", "1305030": "물 체인지", "1305040": "불꽃 체인지", "1305050": "전기 체인지", "1305060": "풀 체인지", "1305070": "바위 체인지", "1305080": "땅 체인지", "1305090": "에스퍼 체인지", "1305100": "벌레 체인지", "1305110": "얼음 체인지", "1305120": "악 체인지", "1305130": "강철 체인지", "1305140": "고스트 체인지", "1305150": "독 체인지", "1305160": "격투 체인지", "1305170": "드래곤 체인지", "1306020": "기술 후 기술 횟수 회복 {{value}}", "1306030": "공격 시 속공 횟수 회복 {{value}}", "1306040": "P기술 후 기술 횟수 회복 {{value}}", "1306050": "급소 시 기술 횟수 회복 {{value}}", "1306060": "화상 상대 공격 시 속공 횟수 회복 {{value}}", "1306070": "P기술 B기술 후 기술 횟수 회복 {{value}}", "1306080": "기술 후 P기술 횟수 회복 {{value}}", "1306090": "아라베스크의 가르침", "1306100": "상태이상 상대 공격 시 기술 횟수 회복 {{value}}", "1306110": "첫 B기술 후 S기술 횟수 회복 {{value}}", "1306120": "속공기술 후 T기술 횟수 회복 {{value}}", "1306130": "HP 반감 시 한 번 기술 횟수 회복 {{value}}", "1306140": "B기술 후 나무열매 횟수 회복 {{value}}", "1306150": "팀 B기술 후 S기술 횟수 회복 {{value}}", "1306160": "S기술 후 T기술 횟수 회복 {{value}}", "1306170": "첫 B기술 후 나무열매 횟수 회복 {{value}}", "1306180": "첫 B기술 후 P변화기술 횟수 회복 {{value}}", "1306190": "첫 일렉트릭 필드 사용 시 S기술 횟수 회복 {{value}}", "1306200": "공격 시 한 번 P변화기술 횟수 회복 {{value}}", "1306210": "첫 나무열매 횟수 0 시 나무열매 횟수 회복 {{value}}", "1306220": "공격 시 나무열매 횟수 회복 {{value}}", "1306230": "B기술 후 S기술 횟수 회복 {{value}}", "1306240": "병상첨병 후 S기술 횟수 32 회복", "1306250": "B기술 후 S기술 횟수 50 회복 {{value}}", "1306260": "공격 시 S기술 횟수 32 회복 {{value}}", "1306270": "하나의 분석 사용 시 S기술 횟수 회복 {{value}}", "1306280": "피격 시 나무열매 횟수 회복 {{value}}", "1306290": "첫 P변화기술 사용 시 S기술 횟수 회복 {{value}}", "1306300": "첫 관동의 분석 횟수 0 시 기술 횟수 회복 {{value}}", "1306310": "말괄량이 인어의 저력", "1306320": "첫 B기술 후 발군 업 횟수 회복 {{value}}", "1306330": "첫 미니 상처약 G 횟수 0 시 기술 횟수 회복 {{value}}", "1307010": "반동 데미지 무효 9", "1307020": "반동 데미지 무효 {{value}}", "1307030": "첫 HP 10% 시 내구", "1308010": "맹독존 시 위력 ↑{{value}}", "1308020": "하나 C 물리 시 위력 ↑{{value}}", "1308030": "상대 마비 시 위력 상승 G{{value}}", "1308040": "날씨 필드 존 변화 시 위력 ↑ G{{value}}", "1308050": "암석존 시 위력 ↑{{value}}", "1308060": "비발군 시 위력 상승 {{value}}", "1308070": "싸라기눈 시 위력 상승 G{{value}}", "1308080": "모래바람 시 P기술 B기술 상승 {{value}}", "1308090": "파시오 C 방어 시 P기술 B기술 ↑ G{{value}}", "1308100": "맑을 시 위력 상승 G{{value}}", "1308110": "같은 편 스피드↑ 시 위력 상승 {{value}}", "1308120": "상대 악 타입 데미지 필드 시 위력 ↑ G{{value}}", "1308130": "방어↑ 시 P기술 B기술 ↑{{value}}", "1308140": "상대 독일 시 위력 상승 G{{value}}", "1308150": "상대 방해 상태 시 위력 ↑ G{{value}}", "1308160": "날씨 변화 시 위력 상승 G{{value}}", "1308170": "상대 능력 비↑ 시 위력 ↑ G{{value}}", "1308180": "팔데아 C 방어 시 위력 ↑ G{{value}}", "1308190": "상대 상태이상 시 위력 상승 G{{value}}", "1308200": "하나 C 방어 시 위력 ↑ G{{value}}", "1308210": "상대 독 타입 데미지 필드 시 위력 ↑ G{{value}}", "1308220": "상대 잠듦 시 위력 ↑ G{{value}}", "1308230": "상대 혼란 시 위력 상승 G{{value}}", "1308240": "상대 화상 시 위력 ↑ G{{value}}", "1308250": "정령존 시 위력 ↑ G{{value}}", "1308260": "모래바람 시 위력 상승 G{{value}}", "1308270": "상대 스피드↓ 시 P기술 B기술 BD기술 ↑ G{{value}}", "1308280": "맑을 시 P기술 B기술 상승 G{{value}}", "1308290": "지진 위력 상승 {{value}}", "1308300": "상대 능력↓ 시 위력 상승", "1308310": "맑을 시 땅 타입 P기술 B기술 ↑ G{{value}}", "1308320": "고드름존 시 위력 ↑{{value}}", "1308330": "상대 상태이상 시 병상첨병 위력 2배", "1308350": "상대저항↓ 시 P기술 B기술 ↑{{value}}", "1308360": "같은 편 급소 시 위력 상승 {{value}}", "1308370": "용의존 시 위력 ↑ G{{value}}", "1308380": "파괴광선 위력 ↑{{value}}", "1308390": "HP 절반 이상 시 B기술 ↑{{value}}", "1308400": "주먹존 시 위력 ↑ G{{value}}", "1308410": "인파이트 위력 상승 {{value}}", "1308420": "하나 C 특수 시 위력 ↑ G{{value}}", "1308430": "용의존 시 P기술 B기술 ↑ {{value}}", "1308440": "맑을 시 10만 마력 위력 2배", "1308450": "상대 바위 타입 데미지 필드 시 위력 ↑ G{{value}}", "1308460": "냉동빔 위력 2배", "1308470": "맹독존 시 위력 ↑ G{{value}}", "1308480": "필드 시 P기술 B기술 ↑{{value}}", "1308490": "성도 C 방어 시 위력 ↑ G{{value}}", "1308500": "능력 업 비례 위력 상승 G", "1308510": "암석존 시 P기술 B기술 ↑{{value}}", "1308520": "대지존 시 P기술 B기술 ↑{{value}}", "1308530": "첫 B기술 사용 시 B기술 {{plus}}배", "1308540": "풀 타입 위력 상승 G{{value}}", "1308550": "드래곤 타입 위력 상승 G{{value}}", "1308560": "순백존 시 위력 ↑ G{{value}}", "1308580": "순백존 시 위력 ↑{{value}}", "1308590": "상대 방어 ↓ 시 위력 ↑{{value}}", "1308600": "볼티지 ↑ 비례 위력 상승", "1401010": "기절 시 폭발", "1401020": "잠듦 상대 P기술 후 추가 데미지", "1401030": "상대에게 P기술 후 고스트 특수 추가 데미지", "1401040": "P기술 2회 사용 시 파멸의 소원", "1501010": "첫 등장 시 BC 가속 {{value}}", "1501020": "기술 급소 시 BC 가속 {{value}}", "1501030": "첫 B기술 후 BC 가속 {{value}}", "1501040": "위기 시 BC 가속 G{{value}}", "1501050": "등장 시 한 번 BC 가속 {{value}}", "1501060": "기술 후 BC 가속 {{value}}", "1501070": "피격 시 BC 가속 {{value}}", "1501080": "위기 시 BC 가속 {{value}}", "1501090": "상대 실패 시 BC 가속 {{value}}", "1501100": "방어 성공 시 BC 가속 {{value}}", "1501110": "교체금지 상대 공격 시 BC 가속 {{value}}", "1501120": "P기술 후 BC 가속 {{value}}", "1501130": "발군 시 BC 가속 {{value}}", "1501140": "급소 시 BC 가속 {{value}}", "1501150": "맑을 시 기술 후 BC 가속 {{value}}", "1501160": "비 올 시 기술 후 BC 가속 {{value}}", "1501170": "BD기술 후 BC 가속 {{value}}", "1501180": "반격 시 BC 가속 {{value}}", "1501190": "HP 반감 시 한 번 BC 가속 {{value}}", "1501200": "첫 P변화기술 사용 시 BC 가속 {{value}}", "1501210": "첫 위기 시 BC 가속 {{value}}", "1501220": "대기 공격 시 BC 가속 {{value}}", "1501230": "대기 공격 시 BC2 가속 {{value}}", "1501240": "첫 기술 후 BC 가속 {{value}}", "1501250": "방어 성공 시 한 번 BC 가속 {{value}}", "1501260": "천둥 같은 다릿심", "1501270": "농락하는 날개", "1501280": "사악한 오라", "1501290": "HP 60% 시 한 번 BC 가속 {{value}}", "1501300": "속공기술 후 BC 2 가속 {{value}}", "1501310": "속공기술 후 BC 가속 {{value}}", "1501320": "T기술 후 BC 가속 {{value}}", "1501330": "첫 나무열매 횟수 0 시 BC 가속 {{value}}", "1501340": "P변화기술 사용 시 BC 가속 {{value}}", "1501350": "용의 소원 사용 시 BC 가속 {{value}}", "1501360": "첫 T기술 후 BC 가속 {{value}}", "1501370": "공포의 소원 사용 시 BC 가속 {{value}}", "1501380": "푸른 하늘의 소원 사용 시 BC 가속 {{value}}", "1501390": "첫 일렉트릭 필드 사용 시 BC 가속 {{value}}", "1501400": "자기 첫 신오 C 특수 발생 시 BC 가속 {{value}}", "1501410": "대지의 소원 사용 시 BC 가속 {{value}}", "1501420": "첫 P변화기술 횟수 0 시 BC 가속 {{value}}", "1501430": "강철의 소원 사용 시 BC 가속 {{value}}", "1501440": "첫 팔데아의 결속 사용 시 BC 가속 {{value}}", "1501450": "첫 등장 시 & 첫 B기술 후 BC 가속 {{value}}", "1501460": "첫 물리 부스트 6 이상 시 BC 가속 {{value}}", "1501470": "주먹의 소원 사용 시 BC 가속 {{value}}", "1501480": "B테라스탈 시 BC 가속 {{value}}", "1501490": "하나의 정열 사용 시 BC 가속 {{value}}", "1501500": "기절 시 BC 가속 {{value}}", "1501510": "자기 관동 C 특수 발생 시 BC 가속 {{value}}", "1501520": "등장 시 BC 가속 {{value}}", "1501530": "첫 등장 시 BC 가속 & 특수공격 1↑", "1501540": "첫 등장 시 BC 2 가속 & 급소율 1 ↑", "1501550": "첫 등장 시 BC 3 가속 & 순백존화", "1501560": "테라스탈 에너지의 증폭", "1501570": "첫 원령의 소원 횟수 0 시 BC 가속 {{value}}", "1501580": "첫 관동의 분석 횟수 0 시 BC 가속 {{value}}", "1501590": "자기 서클 발생 시 BC 가속 {{value}}", "1501600": "자기 강철존 발생 시 BC 가속 {{value}}", "1502010": "B기술 후 BC 상한 감소 {{value}}", "1601020": "B기술 후 맑음화", "1601030": "B기술 발군 시 위력 상승 {{value}}", "1601040": "맑을 시 B기술 위력 상승 {{value}}", "1601050": "스피드↑ 비례 B기술 위력 ↑", "1601060": "공격↑ 비례 B기술 위력 상승", "1601070": "회피율↑ 비례 B기술 위력 ↑", "1601080": "B기술 급소 시 위력 상승 {{value}}", "1601090": "싸라기눈 시 B기술 위력 상승 {{value}}", "1601100": "상대 마비 시 B기술 위력 ↑{{value}}", "1601110": "상대 혼란 시 B기술 위력 ↑{{value}}", "1601120": "비 올 시 B기술 위력 상승 {{value}}", "1601130": "상대 스피드↓ 비례 B기술 ↑", "1601140": "B기술 후 싸라기눈화", "1601150": "상대 공격↓ 비례 B기술 위력 ↑", "1601160": "상대 특수방어↓ 비례 B기술 위력 ↑", "1601170": "상대 잠듦 시 B기술 위력 ↑{{value}}", "1601180": "모래바람 시 B기술 위력 상승 {{value}}", "1601190": "B기술 후 모래바람화", "1601200": "상대 얼음 시 B기술 위력 ↑{{value}}", "1601210": "상대 풀죽음 시 B기술 위력 ↑{{value}}", "1601220": "상대 방어↓ 비례 B기술 위력 ↑", "1601230": "EF 시 B기술 위력 상승 {{value}}", "1601240": "능력↑ 비례 B기술 위력 상승", "1601250": "상대 명중률↓ 비례 B기술 ↑", "1601260": "위기 시 B기술 위력 상승 {{value}}", "1601270": "첫 B기술 후 B기술 타입 변화", "1601280": "상대 특수공격↓ 비례 B기술 위력 ↑", "1601290": "상대 화상 시 B기술 상승 {{value}}", "1601300": "상대 교체금지 시 B기술 위력 ↑{{value}}", "1601310": "날씨 변화 시 B기술 위력 ↑{{value}}", "1601320": "상대 공격↓ 시 B기술 ↑{{value}}", "1601330": "특수공격↑ 시 B기술 위력 상승 {{value}}", "1601340": "일반 날씨 시 B기술 위력 ↑{{value}}", "1601350": "상대 독일 시 B기술 위력 ↑{{value}}", "1601360": "상대 회피율↓ 비례 B기술 위력 ↑", "1601370": "기술게이지 비례 B기술 위력 상승", "1601380": "방어↑ 비례 B기술 위력 상승", "1601390": "특수방어↑ 비례 B기술 위력 상승", "1601400": "상대 마비 시 BD기술 ↑{{value}}", "1601410": "용의존 시 B기술 위력 상승 {{value}}", "1601420": "상대 능력↓ 비례 B기술 위력 ↑", "1601430": "강철존 시 B기술 위력 상승 {{value}}", "1601440": "특수공격↑ 비례 B기술 위력 상승", "1601450": "상대 방해상태 시 B기술 ↑{{value}}", "1601460": "BD기술 발군 시 위력 상승 {{value}}", "1601470": "명중률↑ 시 B기술 위력 ↑{{value}}", "1601480": "공격↑ 시 B기술 위력 상승 {{value}}", "1601490": "방어↑ 시 B기술 위력 상승 {{value}}", "1601500": "상대 바인드 시 B기술 위력 ↑{{value}}", "1601510": "B기술 급소화", "1601520": "상대 명중률↓ 시 B기술 ↑{{value}}", "1601540": "공격↑ 시 BD기술 위력 ↑{{value}}", "1601550": "상대 특수공격↓ 시 B기술 ↑{{value}}", "1601560": "상대 상태이상 시 B기술 위력 ↑{{value}}", "1601570": "필드 변화 시 B기술 위력 ↑{{value}}", "1601580": "스피드↑ 시 B기술 위력 ↑{{value}}", "1601590": "특수방어↑ 시 B기술 위력 상승 {{value}}", "1601600": "HP 감소 시 B기술 위력 ↑{{value}}", "1601610": "회피율↑ 시 B기술 위력 ↑{{value}}", "1601620": "상대 스피드↓ 시 B기술 ↑{{value}}", "1601630": "상대 능력 비↑ 시 B기술 ↑{{value}}", "1601640": "정령존 시 B기술 위력 상승 {{value}}", "1601650": "상대 강철 타입 데미지 필드 시 B기술 위력 ↑{{value}}", "1601660": "B기술 위력 상승 G{{value}}", "1601670": "상대 저항↓ 시 B기술 ↑{{value}}", "1601680": "공포존 시 B기술 위력 상승 {{value}}", "1601690": "GF시 B기술 위력 상승 {{value}}", "1601700": "맹독존 시 B기술 위력 ↑{{value}}", "1601710": "하나 C 물리 시 B기술 위력 ↑{{value}}", "1601720": "상태이상 시 B기술 위력 상승 {{value}}", "1601730": "서클 시 B기술 ↑ G{{value}}", "1601740": "성도 C 물리 시 B기술 위력 ↑{{value}}", "1601750": "암석존 시 B기술 위력 ↑{{value}}", "1601760": "하나 C 방어 시 B기술 위력 ↑{{value}}", "1601770": "상대 저항↓ 시 위력 ↑ G{{value}}", "1601780": "상대 독일 시 BD기술 ↑{{value}}", "1601790": "팔데아 C 물리 시 B기술 위력 ↑{{value}}", "1601800": "알로라 C 특수 시 B기술 위력 ↑{{value}}", "1601810": "상대 특수방어↓ 시 B기술 ↑{{value}}", "1601820": "푸른하늘존 시 B기술 위력 상승 {{value}}", "1601830": "상대 바인드 시 B기술 ↑ G{{value}}", "1601840": "순백존 시 B기술 ↑{{value}}", "1601850": "싸라기눈 시 B기술 위력 ↑ G{{value}}", "1601860": "팔데아 C 방어 시 B기술 ↑ G{{value}}", "1601870": "나무열매 횟수 0 시 B기술 ↑{{value}}", "1601880": "하나 C 방어 시 B기술 ↑ G{{value}}", "1601890": "PF시 B기술 위력 상승 {{value}}", "1601900": "특수공격↑ 시 BD기술 위력 ↑{{value}}", "1601910": "상대 교체금지 시 B기술 ↑ G{{value}}", "1601920": "상대 교체금지 시 위력 ↑ G{{value}}", "1601930": "대지존 시 B기술 ↑{{value}}", "1601940": "상대 독 타입 데미지 필드 시 B기술 ↑ G{{value}}", "1601950": "상대 능력↓ 시 B기술 ↑{{value}}", "1601960": "고드름존 시 B기술 ↑{{value}}", "1601970": "신오 C 특수 시 B기술 ↑ G{{value}}", "1601980": "순백존 시 B기술 ↑ G{{value}}", "1601990": "비 올 시 B기술 위력 상승 G{{value}}", "1602010": "첫 B기술 후 기술 횟수 회복 {{value}}", "1602020": "B기술 후 속공 횟수 회복 {{value}}", "1602030": "첫 B기술 후 회복 횟수 회복 {{value}}", "1602040": "B기술 후 P기술 횟수 회복 {{value}}", "1602050": "B기술 후 한 번 P기술 횟수 회복 {{value}}", "1602060": "첫 B기술 후 T기술 횟수 회복 {{value}}", "1602070": "첫 B기술 후 속공 횟수 회복 {{value}}", "1602080": "위기 시 한 번 속공 횟수 회복 {{value}}", "1602090": "B기술 후 T기술 횟수 회복 {{value}}", "1602100": "BD기술 후 S기술 횟수 회복 {{value}}", "1602110": "BD기술 후 P변화기술 횟수 회복 {{value}}", "1602120": "첫 기술 후 기술 횟수 회복 {{value}}", "1602130": "팀 B기술 후 와이드 가드 횟수 회복 {{value}}", "1602140": "첫 P변화기술 사용 시 토치카 횟수 회복 {{value}}", "1602150": "BD기술 후 발군 업 횟수 회복 {{value}}", "1603010": "비 올 시 BD기술 위력 상승 {{value}}", "1603020": "필드에 게이지 가속 시 B기술 ↑ G{{value}}", "1603030": "필드에 게이지 가속 시 B기술 ↑{{value}}", "1603040": "비단벌레존 시 B기술 ↑ G{{value}}", "1603050": "서클 시 B기술 위력 ↑{{value}}", "1603060": "같은 편 스피드 ↑ 시 B기술 ↑{{value}}", "1603070": "날씨 필드 존 변화 시 B기술 ↑ G{{value}}", "1603080": "주먹존 시 B기술 ↑ {{value}}", "1603090": "맑을 시 B기술 BD기술 ↑{{value}}", "1603100": "상대 바위 타입 데미지 필드 시 B기술 ↑ G{{value}}", "1603110": "필드 시 B기술 상승 {{value}}", "1603120": "주먹존 시 B기술 ↑ G{{value}}", "1603130": "성도 C 특수 시 B기술 ↑ G{{value}}", "1603140": "상대 저항 ↓ 시 B기술 ↑ G{{value}}", "1603150": "GF 시 BD기술 위력 상승 {{value}}", "1603160": "공포존 시 B기술 ↑ G{{value}}", "1603180": "팔데아 C 물리 시 위력 ↑ G{{value}}", "1701010": "독 무효", "1701020": "화상 무효", "1701030": "마비 무효", "1701040": "얼음 무효", "1701050": "싸라기눈 무효", "1701060": "잠듦 무효", "1701070": "혼란 무효", "1701080": "풀죽음 무효", "1701090": "바인드 무효", "1701100": "맑을 시 상태이상 무효", "1701110": "잠듦 무효 G", "1701120": "방해상태 무효", "1701130": "비 올 시 방해상태 무효", "1701140": "일격필살 무효", "1701150": "맑을 시 방해상태 무효", "1701160": "일반날씨 시 방해상태 무효", "1701170": "상태이상 무효", "1701180": "PF 시 상태이상 무효", "1701190": "GF 시 상태이상 무효", "1701200": "EF 시 방해상태 무효", "1701210": "EF 시 상태이상 무효", "1701220": "풀죽음 무효 G", "1701230": "맑을 시 상태이상·방해 무효 G", "1701240": "독 무효 G", "1701250": "비 올 시 상태이상 무효", "1701260": "공포존 시 방해상태 무효", "1701270": "암석존 시 상태이상 무효", "1701280": "GF 시 방해상태 무효", "1701290": "정령존 시 상태이상 무효 G", "1701300": "싸라기눈 시 상태이상 무효", "1701310": "피격 시 공격 특수공격 ↑ 무시", "1701320": "PF시 상태이상 방해 무효 G", "1701330": "P기술 B기술 BD기술 피격 시 날씨 필드 존 위력 ↑ 무시 G", "1701340": "용의존 시 방해 상태 무효", "1701350": "상태이상 방해 무효", "1701360": "고드름존 시 상태이상 무효 G", "1701370": "강철존 시 상태이상 방해 무효 G", "1701380": "대지존 시 상태이상 방해 무효 G", "1701390": "싸라기눈 무효 G", "1701400": "서클 시 상태이상 무효", "1701410": "모래바람 무효 G", "1701420": "GF 시 상태이상 방해 무효 G", "1701430": "잠듦 풀죽음 무효 G", "1701440": "싸라기눈 시 방해 상태 무효", "1701450": "맹독존 시 상태 이상 무효 G", "1701460": "상대 독 타입 데미지 필드 시 상태이상 방해 무효 G", "1701470": "서클 시 상태이상 방해 무효 G", "1701480": "필드에 게이지 가속 시 상태이상 방해 무효 G", "1701490": "비단벌레존 시 상태이상 무효", "1701500": "화상 무효 G", "1701510": "정령존 시 상태이상 방해 무효 G", "1702010": "독 내성 {{value}}", "1702020": "마비 내성 {{value}}", "1702030": "잠듦 내성 {{value}}", "1702040": "화상 내성 {{value}}", "1702050": "얼음 내성 {{value}}", "1702060": "혼란 내성 {{value}}", "1702070": "풀죽음 내성 {{value}}", "1702080": "바인드 내성 {{value}}", "1703010": "B기술 후 상태악화 해제", "1703020": "P기술 후 상태이상 해제 G{{value}}", "1703030": "방해상태 해제", "1703040": "기절 시 같은 편 상태이상 해제", "1703050": "상태이상 해제", "1703060": "B기술 후 상태이상 해제", "1703070": "기술 후 상태이상 해제 G", "1703080": "P기술 후 상태이상 해제 {{value}}", "1703090": "같은 편에게 기술 후 상태이상 해제 {{value}}", "1703100": "B기술 후 상태이상 해제 G{{value}}", "1703110": "BD기술 후 상태이상 해제 G{{value}}", "1703120": "같은 편에게 기술 후 방해상태 해제 {{value}}", "1703130": "기술 후 상태이상 해제 {{value}}", "1703150": "기술 후 방해 상태 해제 {{value}}", "1703160": "B기술 후 디메리트 변화 해제 G{{value}}", "1703170": "T기술 후 상태이상 해제 G{{value}}", "1704010": "상태이상·방해 회복 후 무효화", "1704020": "HP최대등장 시 버티기", "1704030": "싸라기눈 시 HP 회복 {{value}}", "1704040": "버티고 버티기 {{value}}", "1704050": "맑을 시 HP 회복 {{value}}", "1704060": "기술 후 버티기 {{value}}", "1704070": "상대에게 기술 후 혼란 부여 {{value}}", "1704080": "위기 시 기술 후 주목", "1704090": "모래바람 시 HP 회복 {{value}}", "1704100": "상대에게 기술 후 독 부여 {{value}}", "1704110": "변화기술 상태이상 부여 G{{value}}", "1704120": "등장 시 차회 급소", "1704130": "공격 시 풀죽음 부여 {{value}}", "1704140": "B기술 후 차회 급소", "1704150": "비 올 시 HP 회복 {{value}}", "1704160": "HP최대등장 시 지속회복", "1704170": "상대에게 B기술 후 잠듦 부여", "1704180": "기술 후 주목", "1704190": "상대에게 기술 후 얼음 부여 {{value}}", "1704200": "등장 시 차회 필중", "1704210": "첫 B기술 후 버티기 G", "1704220": "상대에게 기술 후 맹독 부여 {{value}}", "1704230": "상대에게 기술 후 잠듦 부여 {{value}}", "1704240": "기술 급소 시 혼란 부여 {{value}}", "1704250": "기술 후 차회 급소 {{value}}", "1704260": "기술 후 지속회복 {{value}}", "1704270": "첫 등장 시 차회 급소 G", "1704280": "EF 시 HP 회복 {{value}}", "1704290": "PF 시 HP 회복 {{value}}", "1704300": "기술 후 지속회복 G", "1704310": "등장 시 차회 게이지 소비 0", "1704320": "B기술 후 차회 게이지 소비 0", "1704330": "B기술 후 지속회복 G", "1704340": "첫 B기술 후 버티기", "1704350": "기술 후 차회 발군 위력 상승 {{value}}", "1704360": "교체금지 시 공격 시 차회 게이지 소비 없음 {{value}}", "1704370": "등장 시 차회 발군 위력 상승", "1704380": "교체금지 시 HP 회복 {{value}}", "1704390": "급소 시 차회 게이지 소비 없음 {{value}}", "1704400": "독·화상·마비 동조", "1704410": "P기술 후 차회 게이지 소비 없음 {{value}}", "1704420": "P변화기술 사용 시 차회 발군 위력 ↑{{value}}", "1704430": "맑을 시 P기술 후 차회 발군 위력 ↑{{value}}", "1704440": "비 올 시 P기술 후 차회 발군 위력 ↑{{value}}", "1704450": "BD기술 후 차회 데미지 방어", "1704460": "피격 시 차회 게이지 소비 없음 {{value}}", "1704470": "BD기술 후 지속회복", "1704480": "공격 시 차회 게이지 소비 없음 {{value}}", "1704490": "첫 위기 시 차회 발군 위력 ↑", "1704500": "첫 HP 반감 시 차회 데미지 방어", "1704510": "첫 B기술 후 차회 발군 위력 ↑", "1704520": "실패 시 물리 부스트 {{value}}", "1704530": "BD기술 후 차회 발군 위력 ↑", "1704540": "상대에게 B기술 후 교체금지 부여", "1704550": "B기술 후 지속회복", "1704560": "T기술 후 물리 부스트1 부여 {{value}}", "1704570": "공격 시 상태이상 부여 G{{value}}", "1704580": "결정타 시 차회 발군 위력 ↑", "1704600": "발군 시 차회 게이지 소비 없음 {{value}}", "1704610": "섀도다이브 후 차회 발군 위력 상승", "1704620": "T기술 후 특수 부스트1 부여 G{{value}}", "1704630": "T기술 후 차회 게이지 소비 없음 {{value}}", "1704640": "발군 시 차회 발군 위력 ↑{{value}}", "1704650": "기술 후 차회 게이지 소비 없음 {{value}}", "1704660": "B기술 후 물리 부스트1 부여 {{value}}", "1704670": "B기술 후 잠듦 부여 G", "1704680": "HP 반감 시 P변화기술 사용 시 특수 부스트1 부여 G{{value}}", "1704690": "첫 B기술 후 차회 데미지 방어", "1704700": "원령존 시 HP 회복 {{value}}", "1704710": "T기술 후 차회 발군 위력 ↑{{value}}", "1704720": "첫 B기술 후 차회 게이지 소비 없음 G", "1704730": "첫 등장 시 물리, 특수 부스트 {{value}}", "1704740": "공격 시 혼란 부여 {{value}}", "1704750": "P변화기술 사용 시 물리, 특수 부스트1 부여 G{{value}}", "1704760": "PF 시 공격 시 차회 게이지 소비 없음 {{value}}", "1704770": "HP 반감 시 한 번 차회 게이지 소비 없음 G{{value}}", "1704780": "BD기술 후 특수 부스트1 부여 G{{value}}", "1704790": "P변화기술 사용 시 물리 부스트1 부여 {{value}}", "1704800": "피격 시 상대에게 마비 부여 {{value}}", "1704810": "공격 시 방해상태 부여 {{value}}", "1704820": "급소 시 차회 급소 {{value}}", "1704830": "비단벌레존 시 HP 회복 {{value}}", "1704840": "회복기술 후 한 번 물리, 특수 부스트1 부여 G{{value}}", "1704850": "B기술 후 차회 발군 위력 ↑{{value}}", "1704860": "B기술 후 특수 부스트1 부여 {{value}}", "1704870": "기술 후 특수 부스트1 부여 {{value}}", "1704880": "같은 편에게 기술 후 물리 부스트1 부여 {{value}}", "1704890": "GF 시 HP 회복 {{value}}", "1704900": "B기술 후 한 번 특수 부스트1 부여 G{{value}}", "1704910": "횟수기술 사용 시 특수 부스트1 부여 G{{value}}", "1704920": "기술 후 물리, 특수 부스트1 부여 {{value}}", "1704930": "등장 시 특수 부스트 G{{value}}", "1704940": "첫 위기 시 특수 부스트 {{value}}", "1704950": "등장 시 차회 데미지 방어", "1704960": "피격 시 상대에게 화상 부여 {{value}}", "1704970": "공격 시 마비 부여 {{value}}", "1704980": "기술 후 특수 부스트1 부여 G{{value}}", "1704990": "첫 등장 시 지속회복", "1705010": "상대 화상 데미지 ↑{{value}}", "1705020": "상대 바인드 데미지 증가 {{value}}", "1705030": "상대 독 데미지 증가 {{value}}", "1705040": "혼란 상대 자기 공격률 ↑{{value}}", "1705050": "상태이상 방해 무효 시간 연장 {{value}}", "1705060": "마비 상대 실패율 업 {{value}}", "1706010": "전기 타입 공격 시 마비 부여 {{value}}", "1706020": "얼음 타입 공격 시 얼음 부여 {{value}}", "1706030": "기술 후 물리 부스트2 부여 {{value}} ", "1706040": "첫 위기 시 물리 부스트 {{value}}", "1706050": "T기술 후 물리,특수 부스트1 부여 {{value}}", "1706060": "대기 시 물리 부스트1 부여 {{value}}", "1706070": "P변화기술 사용 시 차회 게이지 소비 없음 {{value}}", "1706080": "강철존 시 HP 회복 {{value}}", "1706090": "공포존 시 HP 회복 {{value}}", "1706100": "B기술 후 한 번 물리 부스트1 부여 G{{value}}", "1706110": "첫 등장 시 버티기 G", "1706120": "공격 시 화상 부여 {{value}}", "1706130": "같은 편에게 기술 후 특수 부스트1 부여 {{value}}", "1706140": "독 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1706150": "P변화기술 사용 시 물리・특수 부스트1 부여 {{value}}", "1706160": "암석존 시 HP 회복 {{value}}", "1706170": "공격 시 바인드 부여 {{value}}", "1706180": "방어 성공 시 한 번 물리 부스트1 부여 G{{value}}", "1706190": "능력 다운 시 차회 게이지 소비 없음 {{value}}", "1706200": "피격 시 상대에게 독 마비 잠듦 부여 {{value}}", "1706210": "화상 상대 공격 시 특수 부스트1 부여 {{value}}", "1706220": "상대 실패 시 물리/특수 부스트1 부여 {{value}}", "1706230": "B기술 후 맹독 부여 G{{value}}", "1706240": "독 상대 공격 시 차회 발군 위력 ↑{{value}}", "1706250": "B기술 BD기술 후 물리 부스트1 부여 G{{value}}", "1706260": "첫 공격 시 땅 타입 저항 ↓", "1706270": "한 번만 다시 버티기", "1706280": "첫 B기술 후 차회 발군 위력 ↑ G", "1706290": "첫 공격 시 강철 타입 저항 ↓", "1706300": "등장 시 지속회복 G", "1706310": "첫 공격 시 약점 타입 저항 ↓", "1706320": "T기술 후 한 번 상태이상·방해 무효화 G{{value}}", "1706330": "첫 T기술 후 상대에게 악 타입 저항 ↓ G", "1706340": "능력 비↑ 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1706350": "울라울라의 바닷바람", "1706360": "멜레멜레의 바닷바람", "1706370": "아칼라의 바닷바람", "1706390": "능력 비↑ 상대 공격 시 풀죽음 부여 {{value}}", "1706400": "마비 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1706410": "상대에게 첫 P변화기술 사용 시 드래곤 타입 저항 ↓", "1706420": "회피 불가 상대 공격 시 풀죽음 부여 {{value}}", "1706430": "기술 후 물리 부스트1 부여 G{{value}}", "1706440": "PF 시 공격 시 물리 부스트 1 부여 {{value}}", "1706450": "상대에게 BD기술 후 독 저항 ↓ G{{value}}", "1706460": "같은 편 독 부여 시 맹독 부여", "1706470": "기술 후 물리 부스트1 부여 {{value}}", "1706480": "첫 HP 60% 시 차회 데미지 방어", "1706490": "기술 후 물리 부스트3 부여 {{value}}", "1706500": "P변화기술 사용 시 물리 부스트2 부여 {{value}}", "1706510": "상대 강철 타입 데미지 필드 시 공격 시 차회 게이지 소비 없음 {{value}}", "1706520": "볼티지↑ 시 공격 시 물리 부스트3 부여 {{value}}", "1706530": "BD기술 후 차회 게이지 소비 없음", "1706540": "P변화기술 사용 시 물리 부스트1 부여 G{{value}}", "1706550": "속공기술 후 물리 부스트1 부여 {{value}}", "1706560": "화상 상대 공격 시 차회 발군 위력 상승 {{value}}", "1706570": "B기술 후 물리 부스트2 부여 {{value}}", "1706580": "상대 실패 시 물리 부스트2 부여 {{value}}", "1706590": "피격 시 차회 발군 위력 상승 {{value}}", "1706600": "B기술 후 차회 게이지 소비 없음 G{{value}}", "1706610": "공격 시 변화 부여 G{{value}}", "1706620": "피격 시 상대에게 독 부여 {{value}}", "1706630": "얼음 상대 공격 시 특수 부스트1 부여 {{value}}", "1706640": "기술 후 특수 부스트2 부여 {{value}}", "1706650": "BD기술 후 차회 게이지 소비 없음 G", "1706660": "공격 시 방해 상태 1종 부여 {{value}}", "1706670": "첫 공격 시 페어리 타입 저항 ↓", "1706680": "B기술 후 한 번 특수 부스트2 부여 G{{value}}", "1706690": "교체금지 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1706700": "교체금지 상대 공격 시 차회 발군 위력 상승 {{value}}", "1706710": "상대 악 타입 데미지 필드 시 공격 시 차회 게이지 소비 없음 {{value}}", "1706720": "마비 상대 공격 시 특수 부스트1 부여 {{value}}", "1706730": "B기술 후 물리 부스트 2 부여 G{{value}}", "1706740": "상대에게 첫 B기술 후 페어리 타입 저항 ↓", "1706760": "독 상대 공격 시 특수 부스트 1 부여 {{value}}", "1706770": "같은 편이 날씨 필드 존 발생 시 특수 부스트 1 부여 {{value}}", "1706780": "상태이상 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1706790": "B기술 BD기술 후 특수 부스트 2 부여 {{value}}", "1706800": "B기술 후 볼티지 ↑{{value}}", "1706810": "T기술 후 차회 게이지 소비 없음 G{{value}}", "1706820": "결정타 시 특수 부스트2 부여 {{value}}", "1706830": "능력↓ 시 물리 부스트1 부여 {{value}}", "1706840": "T기술 후 한 번 물리/특수 부스트 1 부여 G{{value}}", "1706850": "첫 등장 시 풀 타입 저항 업 {{value}}", "1706860": "상대에게 B기술 후 마비 부여", "1706870": "T기술 후 특수 부스트1 부여 {{value}}", "1706880": "공격 시 차회 게이지 소비 없음 또는 특수 부스트1 부여", "1706890": "상대에게 BD기술 후 같은 타입 저항 ↓ G{{value}}", "1706900": "공격 시 물리 부스트1 부여 {{value}}", "1706910": "첫 B기술 후 특수 부스트 G{{value}}", "1706920": "같은 편이 날씨 필드 존 발생 시 물리 부스트1 부여 {{value}}", "1706930": "화상 시 공격 시 물리 부스트1 부여 {{value}}", "1706940": "방해상태 상대 공격 시 차회 발군 위력 ↑{{value}}", "1706950": "공격 시 특수 부스트1 부여 {{value}}", "1706960": "명중 시 물리 부스트1 부여 {{value}}", "1706970": "모래바람 시 공격 시 물리 부스트1 부여 {{value}}", "1706980": "등장 시 물리 부스트 {{value}}", "1706990": "BD기술 후 물리/특수 부스트 G{{value}}", "1707010": "같은 편 필드 효과 대상 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707020": "저항↓ 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1707030": "명중 시 풀죽음 부여 {{value}}", "1707040": "같은 편에게 기술 후 물리/특수 부스트1 부여 {{value}}", "1707050": "B기술 후 물리/특수 부스트2 부여 {{value}}", "1707060": "자기 전체 또는 같은 편 필드 발생 시 차회 게이지 소비 없음 {{value}}", "1707070": "BD기술 후 특수 부스트 {{value}}", "1707080": "회복기술 후 지속회복 G", "1707090": "B기술 후 물리/특수 부스트1 부여 {{value}}", "1707100": "물리 BD기술 후 물리 부스트 {{value}}", "1707110": "특수 BD기술 후 특수 부스트 {{value}}", "1707120": "서클 시 공격 시 물리 부스트1 부여 {{value}}", "1707130": "첫 등장 시 물리 부스트 G{{value}}", "1707140": "능력 비↑ 상대 공격 시 물리 부스트1 부여 {{value}}", "1707150": "독 타입 공격 시 독 부여 {{value}}", "1707160": "자기 전체 또는 같은 편 필드 발생 시 특수 부스트1 부여 {{value}}", "1707170": "P변화기술 사용 시 특수 부스트1 부여 {{value}}", "1707180": "첫 등장 시 물리 부스트 {{value}}", "1707190": "첫 등장 시 특수 부스트 {{value}}", "1707200": "B기술 후 특수 부스트2 부여 {{value}}", "1707220": "첫 등장 시 잠듦 부여 G", "1707230": "P기술 후 물리 부스트 1 부여 {{value}}", "1707240": "첫 B기술 후 물리 부스트 G{{value}}", "1707250": "대기 시 특수 부스트2 부여{{value}}", "1707260": "같은 편이 서클 발생 시 특수 부스트1 부여 {{value}}", "1707270": "대기 시 특수 부스트1 부여 {{value}}", "1707280": "같은 편 기절 시 물리 부스트 {{value}}", "1707290": "상대에게 첫 B기술 후 드래곤 타입 저항 ↓{{value}}", "1707300": "공격 시 풀죽음 부여 & 마비 부여 {{value}}", "1707310": "공격 시 나무열매 횟수 소비 & 특수 부스트3 부여 {{value}}", "1707320": "서클 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707330": "기술 후 B기술 부스트4 부여 {{value}}", "1707340": "능력↓ 시 물리 부스트2 부여 {{value}}", "1707350": "기술 후 B기술 부스트3 부여 {{value}}", "1707360": "B기술 후 B기술 부스트5 부여 {{value}}", "1707370": "T기술 후 물리 부스트1 부여 G{{value}}", "1707380": "자기 서클 발생 시 물리/특수 부스트1 부여 G{{value}}", "1707390": "속공 기술 후 물리 부스트 1 부여 G{{value}}", "1707400": "등장 시 특수 부스트 {{value}}", "1707410": "등장 시 B기술 부스트 {{value}}", "1707420": "첫 공격 시 풀 타입 저항 다운", "1707430": "첫 B기술 후 물리 부스트 {{value}}", "1707440": "변화기술 사용 시 물리/특수 부스트 1 부여 G{{value}}", "1707450": "첫 나무열매 횟수 0 시 특수 부스트 {{value}}", "1707460": "첫 공격 시 독 타입 저항 다운", "1707470": "BD기술 후 물리 부스트 {{value}}", "1707480": "T기술 후 B기술 부스트 1 부여 G{{value}}", "1707490": "악 타입 위력 상승 G{{value}}", "1707500": "비행 타입 위력 상승 G{{value}}", "1707510": "첫 P기술 후 특수 부스트 {{value}}", "1707520": "공격 시 B기술 부스트1 부여 {{value}}", "1707530": "상대에게 BD기술 후 방해 상태 부여 G{{value}}", "1707540": "변화기술 방해 상태 부여 G{{value}}", "1707550": "상대에게 BD기술 후 마비 부여 G{{value}}", "1707560": "같은 편에게 기술 후 B기술 부스트 2 부여 {{value}}", "1707570": "같은 편이 서클 발생 시 물리/특수 부스트 1 부여 G{{value}}", "1707580": "B기술 BD기술 후 물리 부스트 2 부여{{value}}", "1707590": "BD기술 후 B기술 부스트 G{{value}}", "1707600": "기술 후 차회 데미지 방어 {{value}}", "1707610": "공격 시 나무열매 횟수 소비 & 물리 부스트1 부여 G{{value}}", "1707620": "상대 실패 시 물리/특수 부스트1 부여 G{{value}}", "1707630": "강철존 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707640": "전기 타입 위력 상승 G{{value}}", "1707650": "명중 시 특수 부스트1 부여 {{value}}", "1707660": "명중 시 B기술 부스트1 부여 {{value}}", "1707670": "자기 푸른하늘존 발생 시 특수 부스트1 부여 G{{value}}", "1707680": "T기술 후 물리 부스트3 부여 {{value}}", "1707690": "같은 편이 날씨 발생 시 특수 부스트2 부여 {{value}}", "1707700": "BD기술 후 B기술 부스트 {{value}}", "1707710": "첫 등장 시 차회 데미지 방어", "1707720": "T기술 후 물리/특수 부스트1 부여 G{{value}}", "1707730": "HP 반감 시 한 번 물리/특수 부스트2 부여 G{{value}}", "1707740": "사이코 필드의 소원 사용 시 특수 부스트1 부여 G{{value}}", "1707750": "피격 시 특수 부스트1 부여 {{value}}", "1707760": "상대에게 BD기술 후 같은 타입 저항 ↓{{value}}", "1707770": "상대 불꽃 타입 데미지 필드 시 공격 시 특수 부스트1 부여 {{value}}", "1707780": "공격 시 B기술 부스트2 부여 {{value}}", "1707790": "상대에게 BD기술 후 화상 부여 {{value}}", "1707800": "비 올 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707810": "GF 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707820": "위기 시 한 번 차회 데미지 방어 {{value}}", "1707830": "BD기술 후 물리 부스트 G{{value}}", "1707840": "맑을 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707850": "같은 편에게 기술 후 B기술 부스트4 부여 {{value}}", "1707860": "기술 후 B기술 부스트1 부여 G{{value}}", "1707870": "첫 B기술 후 특수 부스트 {{value}}", "1707880": "S기술 횟수 0 시 비S기술 공격 시 특수 부스트1 부여 {{value}}", "1707890": "같은 편에게 기술 후 차회 발군 위력 ↑{{value}}", "1707900": "대지존 시 공격 시 차회 게이지 소비 없음 {{value}}", "1707910": "기술 후 특수 부스트2 부여 G{{value}}", "1707920": "기술 후 물리 부스트2 부여 G{{value}}", "1707930": "대지존 시 HP 회복 {{value}}", "1707940": "대지의 소원 사용 시 물리 부스트2 부여 {{value}}", "1707950": "비 올 시 명중 시 B기술 부스트1 부여 {{value}}", "1707960": "피격 시 물리 부스트1 부여 G{{value}}", "1707970": "피격 시 특수 부스트1 부여 G{{value}}", "1707980": "바위 타입 위력 상승 G{{value}}", "1707990": "얼음 타입 위력 상승 G{{value}}", "1708010": "첫 P변화기술 횟수 0 시 물리 부스트 {{value}}", "1708020": "자기 맑음 발생 시 차회 게이지 소비 없음 {{value}}", "1708030": "EF 시 공격 시 특수 부스트 1 부여 {{value}}", "1708040": "기술 후 차회 발군 위력 ↑ G{{value}}", "1708050": "T기술 횟수 0 시 공격 시 차회 게이지 소비 없음 {{value}}", "1708060": "T기술 횟수 0 시 공격 시 특수 부스트2 부여 {{value}}", "1708070": "화상 상대 같은 편 공격 시 특수 부스트1 부여 {{value}}", "1708080": "첫 나무열매 횟수 0 시 물리 부스트 G{{value}}", "1708090": "화상 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1708100": "B기술 후 특수 부스트 1 부여 G{{value}}", "1708110": "강철의 소원 사용 시 특수 부스트 2 부여 {{value}}", "1708120": "첫 등장 시 특수 부스트 G{{value}}", "1708130": "B기술 피격 시 물리 부스트2 부여 {{value}}", "1708140": "상대 불꽃 타입 데미지 필드 시 공격 시 차회 게이지 소비 없음 {{value}}", "1708150": "피격 시 B기술 부스트1 부여 G{{value}}", "1708160": "비 올 시 공격 시 특수 부스트2 부여 {{value}}", "1708170": "같은 편이 날씨 필드 존 발생 시 특수 부스트 1 부여 G{{value}}", "1708180": "노말 타입 위력 상승 G{{value}}", "1708190": "격투 타입 위력 상승 G{{value}}", "1708200": "불꽃 타입 위력 상승 G{{value}}", "1708210": "첫 등장 시 자기 잠듦 부여", "1708220": "명중 시 물리/특수 부스트 1 부여 {{value}}", "1708230": "첫 특수 부스트 6 이상 시 특수 부스트 {{value}}", "1708250": "같은 편이 비단벌레존 발생 시 특수 부스트 1 부여 {{value}}", "1708260": "B기술 후 특수 부스트2 부여 G{{value}}", "1708270": "기술 후 차회 게이지 소비 없음 G{{value}}", "1708280": "첫 기술 사용 시 특수 부스트 G{{value}}", "1708290": "첫 공격 시 노말 타입 저항 ↓", "1708300": "기술 후 물리/특수 부스트2 부여 {{value}}", "1708310": "첫 B기술 후 볼티지 ↑{{value}}", "1708320": "같은 편이 서클 발생 시 물리 부스트 2 부여 {{value}}", "1708330": "같은 편이 서클 발생 시 B기술 부스트 3 부여 {{value}}", "1708340": "같은 편 능력↑ 시 B기술 부스트 1 부여 {{value}}", "1708350": "B기술 피격 시 물리/특수 부스트 1 부여 G{{value}}", "1708360": "풀죽음 상대 같은 편 공격 시 물리/특수 부스트 1 부여 {{value}}", "1708370": "피격 시 상대에게 바인드 부여 {{value}}", "1708380": "첫 P변화기술 사용 시 차회 데미지 방어", "1708390": "상대 필드 1마리 시 공격 시 물리/특수 부스트 1 부여 {{value}}", "1708400": "상대 필드 1마리 시 공격 시 차회 게이지 소비 없음 {{value}}", "1708410": "첫 등장 시 & 첫 B기술 후 특수 부스트 {{value}}", "1708420": "P기술 후 B기술 부스트2 부여 {{value}}", "1708430": "P변화기술 사용 시 특수 부스트2 부여 {{value}}", "1708440": "맑을 시 같은 편 공격 시 특수 부스트1 부여 {{value}}", "1708450": "풀죽음 상대 같은 편 공격 시 B기술 부스트 2 부여 {{value}}", "1708460": "정령존 시 HP 회복 {{value}}", "1708470": "상대 필드 1마리 시 공격 시 특수 부스트 1 부여 {{value}}", "1708480": "같은 편이 서클 발생 시 물리 부스트 1 부여 G{{value}}", "1708490": "같은 편이 서클 발생 시 차회 게이지 소비 없음 {{value}}", "1708500": "같은 편이 날씨 필드 존 발생 시 물리/특수 부스트1 부여 G{{value}}", "1708510": "팀 B기술 후 물리/특수 부스트1 부여 G{{value}}", "1708520": "고스트 타입 위력 상승 G{{value}}", "1708530": "독 타입 위력 상승 G{{value}}", "1708540": "물 타입 위력 상승 G{{value}}", "1708550": "B기술 후 물리/특수 부스트1 부여 G{{value}}", "1708560": "첫 등장 시 B기술 부스트{{value}}", "1708570": "첫 P변화기술 사용 시 특수 부스트 G{{value}}", "1708580": "기술 후 차회 전체 기술 받아내기 {{value}}", "1708590": "첫 B기술 후 물리/특수 부스트 G{{value}}", "1708600": "B기술 후 물리 부스트 3 부여 {{value}}", "1708610": "상태이상 상대 같은 편 공격 시 물리/특수 부스트 1 부여 {{value}}", "1708620": "상태이상 상대 같은 편 공격 시 B기술 부스트 2 부여 {{value}}", "1708630": "첫 등장 시 고스트 타입 저항 ↓ G{{value}}", "1708640": "첫 T기술 후 B기술 부스트 10", "1708650": "원령존 시 공격 시 방해 상태 부여 {{value}}", "1708660": "방해 상태 상대 공격 시 차회 게이지 소비 없음 {{value}}", "1708670": "방해 상태 상대 공격 시 물리/특수 부스트 1 부여 {{value}}", "1708680": "첫 B기술 후 고스트 타입 저항 ↓ G{{value}}", "1708690": "첫 등장 시 차회 발군 위력 ↑ G", "1708700": "P기술 후 B기술 부스트1 부여 G{{value}}", "1708710": "BD기술 후 물리/특수 부스트 {{value}}", "1708720": "첫 등장 시 물리/특수 부스트 G{{value}}", "1708730": "첫 등장 시 B기술 부스트 G{{value}}", "1708740": "주먹의 소원 사용 시 물리 부스트 2 부여 {{value}}", "1708750": "주먹존 시 공격 시 차회 게이지 소비 없음 {{value}}", "1708760": "같은 편이 GF 발생 시 물리/특수 부스트1 부여 G{{value}}", "1708770": "발군 시 방해 상태 1종 부여 {{value}}", "1708780": "자기 공포Z 발생 시 특수 부스트 1 부여 G{{value}}", "1708790": "상대 바위 타입 데미지 필드 시 공격 시 차회 게이지 소비 없음 {{value}}", "1708800": "T기술 후 특수 부스트 2 부여 {{value}}", "1708810": "첫 B기술 후 차회 데미지 방어 G", "1708820": "B기술 후 물리/특수 부스트 2 부여 G{{value}}", "1708830": "첫 등장 시 맹독 부여 G", "1708840": "첫 공격 시 물리/특수 부스트 {{value}}", "1708850": "원령존 시 공격 시 물리/특수 부스트 1 부여 {{value}}", "1708860": "첫 B기술 후 B기술 부스트 10", "1708870": "자기 첫 성도 C 특수 발생 시 버티기 G", "1708880": "첫 공격 시 특수 브레이크 부여", "1708890": "성도 C 특수 시 기술 후 차회 게이지 소비 없음 {{value}}", "1708900": "같은 편이 원령존 발생 시 물리/특수 부스트 2 G{{value}}", "1708910": "기술 후 물리/특수 부스트 1 부여 G{{value}}", "1708920": "같은 편이 서클 발생 시 차회 게이지 소비 없음 G{{value}}", "1708930": "공격 시 물리/특수 부스트 1 부여 {{value}}", "1708940": "첫 P변화기술 사용 시 차회 게이지 소비 없음 G", "1708950": "독 상대 공격 시 B기술 부스트 2 부여 {{value}}", "1708960": "공격 시 특수 부스트 3 부여 {{value}}", "1708970": "B기술 후 차회 급소 G", "1708980": "등장 시 물리/특수 부스트 G{{value}}", "1708990": "자기 파시오 C 방어 발생 시 특수 부스트 G{{value}}", "1709000": "첫 공격 시 불꽃 타입 저항 ↓", "1709010": "방어 성공 시 물리 부스트 1 부여 G{{value}}", "1709020": "방어 성공 시 특수 부스트 1 부여 G{{value}}", "1709030": "첫 B기술 후 노말 타입 저항 ↓ G{{value}}", "1709040": "첫 B기술 후 불꽃 타입 저항 ↓ G{{value}}", "1709050": "첫 B기술 후 물 타입 저항 ↓ G{{value}}", "1709060": "첫 B기술 후 전기 타입 저항 ↓ G{{value}}", "1709070": "첫 B기술 후 풀 타입 저항 ↓ G{{value}}", "1709080": "첫 B기술 후 얼음 타입 저항 ↓ G{{value}}", "1709090": "첫 B기술 후 에스퍼 타입 저항 ↓ G{{value}}", "1709100": "첫 B기술 후 악 타입 저항 ↓ G{{value}}", "1709110": "첫 B기술 후 페어리 타입 저항 ↓G{{value}}", "1709120": "첫 풀 타입 공격 시 GF화 & 풀 타입 저항 ↓", "1709130": "첫 바위 타입 공격 시 암석존화 & 바위 타입 저항 ↓", "1709140": "첫 B기술 후 바위 타입 저항 ↓ G{{value}}", "1709150": "첫 원령의 소원 횟수 0 시 물리 부스트 {{value}}", "1709160": "T기술 후 물리 부스트 2 부여 {{value}}", "1709170": "상태이상 상대 공격 시 B기술 부스트 3 부여 {{value}}", "1709180": "B기술 후 특수 부스트 1~4 통일 부여 G{{value}}", "1709190": "자기 관동 C 특수 발생 시 특수 부스트 1 부여 {{value}}", "1709200": "맑을 시 공격 시 풀죽음 부여 {{value}}", "1709210": "같은 편 공격 시 자기 물리 부스트 1 / B기술 부스트 2", "1709220": "팀 B 기술 후 물리 부스트 2 부여 {{value}}", "1709230": "첫 기가 임팩트 후 물리 브레이크 부여", "1709240": "같은 편에게 기술 후 차회 게이지 소비 없음 {{value}}", "1709250": "같은 편이 날씨 필드 존 발생 시 물리 부스트 1 부여 G{{value}}", "1709260": "같은 편에게 기술 후 차회 데미지 방어 {{value}}", "1709270": "기절 시 B기술 부스트 G10", "1709280": "B기술 BD기술 후 특수 부스트 2 부여 G{{value}}", "1709290": "팀 B기술 후 특수 부스트 2 부여 {{value}}", "1709300": "기술 후 물리 부스트 2 / B기술 부스트 4", "1709310": "자기 강철 Z 발생 시 물리 / 특수 부스트 1 부여 G{{value}}", "1709370": "GF시 공격 시 차회 게이지 소비 0 & 독 부여", "1709380": "원령존 시 공격 시 차회 게이지 소비 0 & 화상 부여", "1709390": "용의존 시 공격 시 차회 게이지 소비 0 & 마비 부여", "1709400": "B테라스탈 시 공격 시 차회 게이지 소비 없음 {{value}}", "1709410": "자기 GF 발생 시 차회 발군 위력 ↑", "1709420": "팀 B기술 후 물리 부스트 1 부여 {{value}}", "1709430": "B기술 BD기술 후 물리 / 특수 부스트 1 부여 G{{value}}", "1709440": "등장 시 물리 / 특수 부스트 {{value}}", "1709470": "상대에게 B기술 후 화상 부여", "1709490": "첫 B기술 후 물리 / 특수 부스트 {{value}}", "1709540": "GF시 공격 시 물리 부스트 1 부여 G{{value}}", "1709550": "서클 시 공격 시 물리 부스트 1 부여 G{{value}}", "1801010": "공격 다운 내성 {{value}}", "1801020": "방어 다운 내성 {{value}}", "1801030": "특수공격 다운 내성 {{value}}", "1801040": "특수방어 다운 내성 {{value}}", "1801050": "스피드 다운 내성 {{value}}", "1801060": "명중률 다운 내성 {{value}}", "1801070": "회피율 다운 내성 {{value}}", "1801090": "전체 다운 내성 {{value}}", "1802010": "공격 다운 무효", "1802020": "방어 다운 무효", "1802030": "특수공격 다운 무효", "1802040": "특수방어 다운 무효", "1802050": "스피드 다운 무효", "1802060": "명중률 다운 무효", "1802070": "회피율 다운 무효", "1802080": "급소율 다운 무효", "1802090": "전체 다운 무효", "1802100": "모래바람 시 전체 다운 무효", "1802110": "맑을 시 전체 다운 무효", "1802120": "명중률 업 무효", "1802130": "PF 시 전체 다운 무효", "1802140": "정령존 시 전체 다운 무효", "1802150": "싸라기눈 시 전체 다운 무효", "1802160": "EF 시 전체 다운 무효 G", "1802170": "방어 다운 무효 G", "1802180": "특수공격 다운 무효 G", "1802190": "공격 다운 무효 G", "1802200": "정령존 시 전체 다운 무효 G", "1802210": "서클 시 전체 다운 무효 G", "1802220": "암석존 시 전체 다운 무효 G", "1802230": "비단벌레존 시 전체 다운 무효", "1802240": "공포존 시 전체 다운 무효", "1802250": "순백존 시 전체 다운 무효 G", "1802260": "전체 다운 무효 & P기술 B기술 급소화", "1802270": "용의존 시 전체 다운 무효 G", "1803010": "기절 시 능력 인계", "1803020": "교체 시 능력 인계", "1804010": "등장 시 공격 다운 G{{value}}", "1804020": "등장 시 스피드 다운 G{{value}}", "1804030": "급소 시 스피드 업 {{value}}", "1804040": "급소 시 급소율 업 {{value}}", "1804050": "P기술 후 스피드 업 {{value}}", "1804060": "공격 시 공격 업 {{value}}", "1804070": "공격 시 방어 다운 {{value}}", "1804080": "P기술 후 방어 업 {{value}}", "1804090": "공격 시 능력 업 {{value}}", "1804100": "능력 다운 시 특수공격 ↑{{value}}", "1804110": "기절 시 공격, 특수공격 ↓ G{{value}}", "1804120": "피격 시 회피율 업 {{value}}", "1804130": "피격 시 스피드2 ↑{{value}}", "1804140": "첫 HP 반감 시 회피율 ↑{{value}}", "1804150": "물리공격 피격 시 스피드 ↓{{value}}", "1804160": "공격 시 능력 다운 {{value}}", "1804170": "등장 시 회피율 업 {{value}}", "1804180": "등장 시 스피드 업 {{value}}", "1804190": "등장 시 급소율 업 {{value}}", "1804200": "첫 위기 시 특수공격 업 {{value}}", "1804210": "자신 외 기절 시 공격 ↑{{value}}", "1804220": "상대에게 기술 후 특공 다운 {{value}}", "1804250": "능력 다운 시 공격 ↑{{value}}", "1804260": "첫 위기 시 회피율 ↑{{value}}", "1804270": "상대에게 기술 후 공격 특수공격 ↑{{value}}", "1804280": "첫 위기 시 스피드 ↑{{value}}", "1804290": "P기술 후 특수공격 업 {{value}}", "1804300": "P기술 후 공격 업 G{{value}}", "1804310": "P기술 후 급소율 업 G{{value}}", "1804320": "피격 시 방어 업 {{value}}", "1804330": "피격 시 특수방어 업 {{value}}", "1804340": "첫 위기 시 방어 ↑ G{{value}}", "1804350": "첫 HP 반감 시 스피드 ↑{{value}}", "1804360": "P기술 후 급소율 업 {{value}}", "1804370": "P기술 후 특수방어 업 G{{value}}", "1804380": "P기술 후 회피율 업 {{value}}", "1804390": "기술 후 급소율 업 G{{value}}", "1804400": "기술 후 특수공격 업 {{value}}", "1804410": "기술 후 스피드 업 G{{value}}", "1804420": "명중 시 방어 다운 {{value}}", "1804510": "등장 시 특수공격 업 {{value}}", "1804520": "P기술 후 특수공격 업 G{{value}}", "1804530": "기술 후 공격 업 {{value}}", "1804540": "기술 후 특수방어 업 {{value}}", "1804550": "B기술 후 능력 5종 업 {{value}}", "1804560": "등장 시 방어 업 {{value}}", "1804570": "기술 후 공격 업 G{{value}}", "1804580": "기술 후 방어 업 G{{value}}", "1804590": "등장 시 공격 업 {{value}}", "1804600": "첫 위기 시 공격 업 {{value}}", "1804610": "등장 시 명중률 다운 G{{value}}", "1804620": "기술 후 스피드 업 {{value}}", "1804630": "B기술 후 공격 업 G{{value}}", "1804640": "공격 시 특수방어 다운 {{value}}", "1804650": "기술 후 방어 업 {{value}}", "1804660": "등장 시 특수방어 업 {{value}}", "1804670": "등장 시 특수방어 다운 G{{value}}", "1804680": "기술 후 회피율 업 {{value}}", "1804690": "기술 후 명중률 업 G{{value}}", "1804700": "같은 편에게 기술 후 방어 업 {{value}}", "1804710": "첫 위기 시 급소율 ↑{{value}}", "1804720": "P기술 후 회피율 업 G{{value}}", "1804730": "기술 후 회피율 업 G{{value}}", "1804740": "상대 실패 시 공격 업 {{value}}", "1804750": "상대 실패 시 특수공격 업 {{value}}", "1804760": "B기술 후 급소율 업 {{value}}", "1804770": "B기술 후 공격 다운 G{{value}}", "1804780": "상대에게 기술 후 방어 특수방어 ↓{{value}}", "1804800": "결정타 시 공격 특수공격 ↑{{value}}", "1804810": "등장 시 특수공격 다운 G{{value}}", "1804820": "피격 시 공격 업 {{value}}", "1804830": "공격 시 공격 다운 {{value}}", "1804840": "급소 시 공격 업 {{value}}", "1804850": "급소 시 특수공격 업 {{value}}", "1804860": "기술 후 특수공격 업 G{{value}}", "1804870": "기술 후 특수방어 업 G{{value}}", "1804880": "피격 시 특수공격 업 {{value}}", "1804890": "피격 시 방어 업 G{{value}}", "1804900": "공격 시 회피율 다운 {{value}}", "1804910": "공격 시 명중률 다운 {{value}}", "1804930": "혼란 상대 공격 시 방어 ↓{{value}}", "1804940": "공격 시 방어 다운 G{{value}}", "1804950": "공격 시 특수방어 다운 G{{value}}", "1804960": "공격 시 방어 업 {{value}}", "1804970": "공격 시 스피드 다운 {{value}}", "1804980": "기술 급소 시 특수방어 업 {{value}}", "1804990": "기절 시 특수방어 다운 G{{value}}", "1805010": "모래바람 시 회피율 업", "1805030": "상태이상 명중 상승 {{value}}", "1805050": "비 올 시 기술 급소 노림 {{value}}", "1805060": "기술 급소 노림 {{value}}", "1805070": "HP 반감 시 기술 급소 노림 {{value}}", "1805080": "등장 시 회피율 다운 G{{value}}", "1805090": "B기술 급소 노림 {{value}}", "1805100": "싸라기눈 시 기술 급소 노림 {{value}}", "1805110": "등장 시 방어 다운 G{{value}}", "1805120": "발군 시 급소율 업 {{value}}", "1805130": "발군 시 특수공격 업 {{value}}", "1805140": "P기술 B기술 BD기술 급소화", "1805150": "P기술 B기술 급소화", "1805160": "모래바람 시 P기술 B기술 급소 노림 {{value}}", "1806020": "펄롱의 인내", "1807010": "피격 시 공격 능력 흡수 {{value}}", "1807020": "공격 시 능력 흡수 {{value}}", "1807030": "공격 시 방어 능력 흡수 {{value}}", "1807040": "공격 시 특수방어 능력 흡수 {{value}}", "1807050": "공격 시 스피드 능력 흡수 {{value}}", "1807060": "공격 시 능력 5종 중 1종 흡수 G{{value}}", "1807070": "피격 시 능력 5종 중 1종 흡수 {{value}}", "1807080": "공격 시 공격 능력 흡수 {{value}}", "1808010": "기술 후 다운 해제 {{value}}", "1808020": "위기 시 한 번 다운 해제 {{value}}", "1808030": "B기술 후 다운 해제 {{value}}", "1808040": "등장 시 다운 해제", "1808050": "B기술 후 능력 업 반전 G", "1808060": "B기술 후 다운 해제 G{{value}}", "1809010": "등장 시 명중률 업 {{value}}", "1809020": "B기술 후 회피율 업 {{value}}", "1809030": "등장 시 스피드 업 G{{value}}", "1809040": "싸라기눈 시 P기술 후 급소율 ↑ G{{value}}", "1809050": "기술 후 능력 업 G{{value}}", "1809060": "등장 시 능력 업 {{value}}", "1809070": "첫 위기 시 특수방어 업 {{value}}", "1809080": "P기술 후 특수방어 업 {{value}}", "1809090": "안개제거 후 회피율 ↓{{value}}", "1809100": "피격 시 공격 특수공격 ↑ G{{value}}", "1809110": "상대 실패 시 공격 ↑ G{{value}}", "1809120": "B기술 후 방어 업 {{value}}", "1809130": "B기술 후 명중률 업 {{value}}", "1809140": "등장 시 능력 업 G{{value}}", "1809150": "B기술 후 특수공격 업 {{value}}", "1809160": "기술 급소 시 공격 업 {{value}}", "1809170": "P기술 다운 G{{value}}", "1809180": "방어 성공 시 방어 업 {{value}}", "1809190": "방어 성공 시 특수방어 업 {{value}}", "1809200": "방어 성공 시 공격 ↑ G{{value}}", "1809210": "비 올 시 공격 시 특수공격 업 {{value}}", "1809220": "기술 급소 시 방어 업 {{value}}", "1809230": "상대 실패 시 회피율 ↑{{value}}", "1809240": "능력 다운 효과 2배", "1809250": "첫 B기술 후 공격 업 {{value}}", "1809260": "상대에게 기술 후 공격 특수공격 ↑ G{{value}}", "1809270": "교체금지 상대 공격 시 게이지 ↑{{value}}", "1809280": "기술 급소 시 스피드 업 {{value}}", "1809290": "P변화기술 후 HP 회복 G{{value}}", "1809300": "등장 시 명중률 업 G{{value}}", "1809310": "등장 시 공격 업 G{{value}}", "1809320": "등장 시 특수공격 업 G{{value}}", "1809330": "등장 시 공격 특수공격 업 {{value}}", "1809340": "공격 시 특수방어 업 {{value}}", "1809350": "잠듦 상대 공격 시 급소율 ↑ G{{value}}", "1809360": "P기술 후 스피드 업 G{{value}}", "1809370": "상대에게 기술 후 공격 방어 ↓{{value}}", "1809380": "공격 시 스피드 업 G{{value}}", "1809390": "모래바람 시 P기술 후 스피드 ↑ G{{value}}", "1809400": "방해 받을 시 스피드 업 {{value}}", "1809410": "첫 P변화기술 후 공격 특수공격 ↑ G{{value}}", "1809420": "P변화기술 사용 시 급소율 ↑{{value}}", "1809430": "P변화기술 능력 업 효과 2배", "1809440": "기술 후 급소율 업 {{value}}", "1809450": "공격 시 능력 7종 다운 {{value}}", "1809460": "공격 시 방어 업 G{{value}}", "1809470": "공격 시 특수방어 업 G{{value}}", "1809480": "등장 시 방어, 특수방어 업 {{value}}", "1809490": "모래바람 시 P기술 후 방어, 특수방어 ↑{{value}}", "1809500": "모래바람 시 공격 시 명중률 ↓{{value}}", "1809510": "상대 실패 시 스피드 ↑ G{{value}}", "1809520": "능력 다운 반전", "1809530": "HP 반감 시 방어 ↑ G{{value}}", "1809540": "T기술 후 특수방어 업 G{{value}}", "1809550": "BD기술 후 스피드 ↓ G{{value}}", "1809560": "상대 실패 시 명중률 ↑ G{{value}}", "1809570": "상대 실패 시 공격 특수공격 ↑ G{{value}}", "1809580": "P변화기술 후 공격 ↓ G{{value}}", "1809590": "P변화기술 후 특수공격 ↓ G{{value}}", "1809600": "BD기술 후 방어 업 {{value}}", "1809610": "등장 시 급소율 업 G{{value}}", "1809620": "T기술 후 특수공격 업 G{{value}}", "1809630": "B기술 후 회피율 다운 G{{value}}", "1809640": "첫 HP 반감 시 공격 ↑{{value}}", "1809650": "P변화기술 사용 시 특수공격 ↑ G{{value}}", "1809660": "P변화기술 사용 시 방어 ↑ G{{value}}", "1809670": "상대에게 기술 후 회피율 ↓ G{{value}}", "1809680": "상대에게 기술 후 스피드 ↓ G{{value}}", "1809690": "피격 시 스피드 ↑ G{{value}}", "1809700": "결정타 시 공격 업 {{value}}", "1809710": "마비 상대 공격 시 능력 5종 ↓{{value}}", "1809720": "공격 시 급소율 업 G{{value}}", "1809730": "BD기술 후 특수방어 업 {{value}}", "1809740": "BD기술 후 특수방어 업 G{{value}}", "1809750": "아이스페이스 시 공격 시 스피드 업 {{value}}", "1809760": "P변화기술 사용 시 공격 업 G{{value}}", "1809770": "P변화기술 사용 시 능력 다운 G{{value}}", "1809780": "피격 시 방어 특수방어 ↑ G{{value}}", "1809790": "공격 시 특수공격 업 {{value}}", "1809800": "T기술 후 공격 업 G{{value}}", "1809810": "싸라기눈 시 P기술 후 방어, 특수방어 ↑{{value}}", "1809820": "변화기술 사용 시 스피드업 G{{value}}", "1809830": "변화기술 사용 시 급소율 ↑{{value}}", "1809850": "방해상태 상대 공격 시 특수방어 ↓{{value}}", "1809860": "방해상태 상대 공격 시 공격 특수공격 ↓{{value}}", "1809870": "T기술 후 특수공격 업 {{value}}", "1809880": "T기술 후 특수방어 업 {{value}}", "1809890": "첫 등장 시 특수공격 다운 G{{value}}", "1809900": "모래바람 시 공격 시 공격 ↓{{value}}", "1809910": "첫 P변화기술 사용 시 능력 5종 ↑ G{{value}}", "1809920": "상대에게 기술 후 특수방어 다운 {{value}}", "1809930": "P변화기술 사용 시 스피드 ↑ G{{value}}", "1809950": "방해상태 상대 공격 시 능력 2 ↓{{value}}", "1809960": "피격 시 공격 업 G{{value}}", "1809970": "첫 P변화기술 사용 시 방어 ↑ G{{value}}", "1809980": "첫 P변화기술 사용 시 특수방어 ↑ G{{value}}", "1809990": "첫 P변화기술 사용 시 방어, 특수방어 ↑ G{{value}}", "1810010": "첫 B기술 후 능력 5종 ↑ G{{value}}", "1810020": "혼란상대 공격 시 능력 ↓{{value}}", "1810030": "P기술 후 방어 업 G{{value}}", "1810040": "P변화기술 사용 시 특수방어 2 업 G{{value}}", "1810050": "공격 시 방어 2 다운 {{value}}", "1810060": "피격 시 상대에게 방어 ↓{{value}}", "1810070": "피격 시 상대에게 특수방어 ↓{{value}}", "1810080": "명중 시 급소율 업 {{value}}", "1810090": "명중 시 스피드 다운 {{value}}", "1810100": "상대에게 P기술 후 특수공격 2 ↓{{value}}", "1810110": "첫 등장 시 스피드 ↑ G{{value}}", "1810120": "등장 시 방어 업 G{{value}}", "1810130": "등장 시 특수방어 업 G{{value}}", "1810140": "T기술 후 특수공격 2 업 {{value}}", "1810150": "T기술 후 급소율 2 업 {{value}}", "1810160": "상대에게 P기술 B기술 BD기술 후 특수방어 ↓{{value}}", "1810170": "상대에게 P기술 B기술 BD기술 후 특수공격, 특수방어 ↓{{value}}", "1810180": "상대에게 P기술 B기술 BD기술 후 능력 ↓{{value}}", "1810190": "마비 상대 공격 시 스피드 ↓{{value}}", "1810200": "BD기술 후 방어 다운 {{value}}", "1810210": "마비 상대 공격 시 급소율 ↑ G{{value}}", "1810220": "명중 시 능력 다운 {{value}}", "1810230": "GF 시 공격 시 방어 ↑ G & 방어↓ G{{value}}", "1810240": "PF 시 공격 시 특방 ↑ G & 특방 ↓ G{{value}}", "1810250": "EF 시 공격 시 스피드 ↑ G & 스피드↓G{{value}}", "1810260": "T기술 후 방어 특수방어 업 {{value}}", "1810270": "T기술 후 방어 특수방어 2 ↑{{value}}", "1810280": "T기술 후 급소율 업 G{{value}}", "1810290": "공격 시 스피드 2 다운 {{value}}", "1810300": "발군 시 스피드 2 다운 {{value}}", "1810310": "불꽃 타입 공격 시 공격 ↓{{value}}", "1810320": "물 타입 공격 시 방어 다운 {{value}}", "1810330": "벌레 타입 공격 시 특수방어 다운 {{value}}", "1810340": "벌레 타입 공격 시 특수공격 다운 {{value}}", "1810350": "화상 상대에게 기술 후 방어 특수방어↓{{value}}", "1810360": "기술 후 공격 2 급소율 1 ↑{{value}}", "1810370": "방어 성공 시 방어 특수방어 ↑ G{{value}}", "1810380": "횟수 기술 사용 시 특수방어 ↑ G{{value}}", "1810390": "첫 B기술 후 방어 다운 G{{value}}", "1810400": "B기술 후 명중률 다운 G{{value}}", "1810410": "공격 시 명중률 업 G{{value}}", "1810420": "상대에게 P기술 B기술 후 공격 ↓{{value}}", "1810430": "상대에게 P기술 B기술 후 특수공격 ↓{{value}}", "1810440": "상대에게 P기술 B기술 후 특수방어 ↓{{value}}", "1810450": "상대에게 P기술 B기술 후 스피드 ↓{{value}}", "1810460": "상대에게 P기술 B기술 후 회피율 ↓{{value}}", "1810470": "B기술 후 특수방어 업 G{{value}}", "1810480": "B기술 후 급소율 업 G{{value}}", "1810490": "B기술 후 회피율 업 G{{value}}", "1810500": "자기 능력 업 효과 2배", "1810510": "P변화기술 사용 시 방어2 ↑{{value}}", "1810520": "P변화기술 사용 시 특수방어2 ↑{{value}}", "1810530": "첫 HP 반감 시 특수공격 ↑{{value}}", "1810540": "비 올 시 명중 시 특수방어 다운 {{value}}", "1810550": "상대 실패 시 방어 특수방어 ↑ G{{value}}", "1810560": "EF 시 공격 시 스피드 ↓ G{{value}}", "1810570": "마비 상대 공격 시 공격 방어 ↓{{value}}", "1810580": "독 상대 공격 시 공격 특수공격 ↓{{value}}", "1810590": "공격 시 특수공격 다운 {{value}}", "1810600": "기술 후 공격 특수공격 업 {{value}}", "1810610": "상대에게 P기술 후 능력 ↓{{value}}", "1810620": "피격 시 능력 5종 중 1종 ↑ G{{value}}", "1810630": "화상 상대 공격 시 공격 특수방어 ↓{{value}}", "1810640": "기술 후 명중률 업 {{value}}", "1810650": "BD기술 후 방어 업 G{{value}}", "1810660": "독 상대 공격 시 능력 2 ↓ {{value}}", "1810670": "공격 시 회피율 업 G{{value}}", "1810680": "독 상대 공격 시 공격 ↑{{value}}", "1810690": "독 상대 공격 시 스피드 ↑{{value}}", "1810700": "첫 HP 반감 시 공격 특수공격 ↑{{value}}", "1810710": "기술 후 능력 5종 중 1종 ↑ G{{value}}", "1810720": "회피 불가 상대 공격 시 스피드 ↑ G{{value}}", "1810730": "포니의 바닷바람", "1810740": "기술 후 능력 5종 중 1종 ↑{{value}}", "1810750": "P기술 후 방어 특수방어 업 {{value}}", "1810760": "교체금지 상대 공격 시 명중률 ↓{{value}}", "1810770": "B기술 후 방어 다운 G{{value}}", "1810780": "같은 편이 날씨 필드 존 발생 시 회피율 ↑ G{{value}}", "1810790": "파멸의 소원 사용 시 능력 통일 2 업 G", "1810800": "상대에게 P기술 후 특수방어 2 ↓{{value}}", "1810810": "독 상대 P변화기술 능력다운 효과 {{value}}배", "1810820": "P기술 후 스피드 2 업 {{value}}", "1810830": "B기술 후 스피드 업 G{{value}}", "1810840": "명중 시 회피율 업 {{value}}", "1810850": "첫 HP 60% 시 공격 특수공격 ↑{{value}}", "1810860": "B기술 후 특수방어 업 {{value}}", "1810870": "B기술 후 방어 특수방어 업 {{value}}", "1810880": "화상 상대 공격 시 특수공격 ↓{{value}}", "1810890": "바인드 상대 공격 시 특수방어 ↓{{value}}", "1810900": "흡수 기술 공격 시 공격 ↓{{value}}", "1810910": "P기술 능력 업 효과 2배", "1810920": "상대에게 P기술 후 공격 ↓{{value}}", "1810930": "파멸의 소원 사용 시 능력 통일 업 G", "1810940": "P변화기술 사용 시 능력 ↑{{value}}", "1810950": "BD기술 후 방어 다운 G{{value}}", "1810960": "화상 상대 공격 시 공격 ↓{{value}}", "1810970": "바인드 상대 공격 시 스피드 ↓{{value}}", "1810980": "흡수 기술 공격 시 특수공격 ↓{{value}}", "1810990": "P변화기술 사용 시 명중률 2 ↑ G{{value}}", "1811010": "화상 상대 공격 시 능력 다운 {{value}}", "1811020": "마비 상대 공격 시 방어 특수방어 다운 {{value}}", "1811030": "BD기술 후 공격 업 {{value}}", "1811040": "독 상대 공격 시 능력 ↓{{value}}", "1811050": "상대에게 P변화기술 사용 시 특수방어 ↓{{value}}", "1811060": "공격 시 공격 특수공격 ↑ G{{value}}", "1811070": "상대에게 첫 B기술 후 방어 특수방어 다운 {{value}}", "1811080": "상대에게 P기술 후 방어 ↓{{value}}", "1811090": "상대에게 P기술 B기술 후 방어 2 ↓{{value}}", "1811100": "공격 시 스피드 2 ↑ G{{value}}", "1811110": "독 상대 공격 시 공격 ↓ & 마비 상대 공격 시 특수공격 ↓{{value}}", "1811120": "상대에게 P기술 B기술 후 특수방어 2 ↓{{value}}", "1811130": "상대 악 타입 데미지 필드 시 공격 시 방어 특수방어 ↓{{value}}", "1811140": "상대 악 타입 데미지 필드 시 공격 시 스피드 ↑{{value}}", "1811150": "공격 시 공격 업 G{{value}}", "1811160": "공격 시 특수공격 업 G{{value}}", "1811170": "바인드 상대 공격 시 공격 ↓{{value}}", "1811180": "상대에게 기술 후 공격 특수공격 ↓{{value}}", "1811190": "공격 시 회피율 업 {{value}}", "1811200": "기술 후 공격 특수공격 업 G{{value}}", "1811210": "상대에게 P기술 B기술 후 공격 2 ↓{{value}}", "1811220": "상대에게 P기술 B기술 후 특수공격 2 ↓{{value}}", "1811230": "등장 시 능력 다운 G{{value}}", "1811240": "같은 편이 날씨 필드 존 발생 시 스피드 ↑ G{{value}}", "1811250": "상태이상 상대 공격 시 능력 2 ↓{{value}}", "1811260": "첫 T기술 후 특수공격 업 G{{value}}", "1811270": "명중 시 공격 다운 {{value}}", "1811280": "기술 후 방어 특수방어 업 G{{value}}", "1811290": "T기술 후 스피드 회피 ↑ G{{value}}", "1811300": "기술 후 공격 특수공격 2 업 {{value}}", "1811310": "상대에게 BD기술 후 능력 7종 ↓{{value}}", "1811320": "물리공격 시 방어 2 ↓{{value}}", "1811330": "특수공격 시 특수방어 2 ↓{{value}}", "1811340": "P변화기술 사용 시 공격 ↓ G{{value}}", "1811350": "P변화기술 사용 시 특수공격 ↓ G{{value}}", "1811360": "공격 시 방어 특수방어 다운 {{value}}", "1811370": "상대에게 B기술 후 특수공격 ↓{{value}}", "1811380": "B기술 후 특수공격 업 G{{value}}", "1811390": "B기술 후 능력 5종 ↑ G{{value}}", "1811400": "맹독존 시 공격 시 능력 ↓{{value}}", "1811410": "명중 시 능력 2 업 {{value}}", "1811420": "등장 시 공격 스피드 업 {{value}}", "1811430": "상대에게 P변화기술 사용 시 방어 2 ↓{{value}}", "1811440": "마비 상대 공격 시 방어 ↓{{value}}", "1811450": "피격 시 상대에게 능력 5종 중 1종 2 ↓{{value}}", "1811460": "상대에게 첫 B기술 후 능력 ↓2배", "1811470": "등장 시 특수공격 스피드 ↑{{value}}", "1811480": "명중 시 특수방어 다운 {{value}}", "1811490": "B기술 후 능력 7종 업 {{value}}", "1811500": "T기술 후 공격 특수공격 업 {{value}}", "1811510": "BD기술 후 공격 특수공격 ↑ G{{value}}", "1811520": "첫 P변화기술 사용 시 급소율 ↑ G{{value}}", "1811530": "상대에게 P변화기술 사용 시 공격 2 ↓{{value}}", "1811540": "피격 시 특수공격 업 G{{value}}", "1811550": "서클 시 공격 시 공격 특수공격 ↓{{value}}", "1811560": "상대에게 B기술 후 공격 특수공격 ↓{{value}}", "1811570": "등장 시 회피율 업 G{{value}}", "1811580": "교체금지 상대 공격 시 능력 5종 중 1종 ↑ G{{value}}", "1811590": "첫 T기술 후 방어 특수방어 ↑{{value}}", "1811600": "자기 전체 또는 같은 편 필드 발생 시 공격 특수공격 ↑ G{{value}}", "1811610": "상대에게 P변화기술 사용 시 방어 ↓{{value}}", "1811620": "공격 시 공격 특수공격 다운 {{value}}", "1811630": "상대에게 BD기술 후 특수방어 ↓ G{{value}}", "1811640": "같은 편에게 기술 후 특수방어 업 {{value}}", "1811650": "P변화기술 사용 시 특수공격 ↑{{value}}", "1811660": "등장 시 특수공격 특수방어 업 {{value}}", "1811670": "마비 상대 공격 시 특수방어 ↓{{value}}", "1811680": "피격 시 상대에게 공격 & 특수공격 ↓{{value}}", "1811690": "첫 등장 시 공격 다운 G{{value}}", "1811700": "교체금지 상대 공격 시 공격 특수공격 ↓{{value}}", "1811710": "맑을 시 공격 시 공격 방어 ↓{{value}}", "1811720": "기술 후 기술게이지 2 증가 {{value}}", "1811730": "공격 시 3회 능력 다운 {{value}}", "1811740": "속공 기술 후 능력 2 다운 {{value}}", "1811750": "기술 후 특수공격 2 급소율 1 ↑{{value}}", "1811760": "맑을 시 공격 시 능력 2종 ↓{{value}}", "1811770": "등장 시 특수공격 회피 업 {{value}}", "1811780": "등장 시 특수공격 4 급소율 {{value}} ↑", "1811790": "상대에게 P기술 B기술 후 방어 ↓{{value}}", "1811800": "첫 등장 시 능력 7종 ↓ G{{value}}", "1811810": "싸라기눈 시 공격 시 특수방어 ↓ {{value}}", "1811820": "첫 B기술 후 명중 회피 ↓ G{{value}}", "1811830": "자기 서클 발생 시 방어 특수방어 2 ↑ G{{value}}", "1811840": "첫 등장 시 방어 특수방어 ↑{{value}}", "1811850": "공격 시 특수방어 2 다운 {{value}}", "1811860": "같은 편에게 기술 후 특수공격 업 {{value}}", "1811870": "마비 상대 공격 시 공격 2 ↓{{value}}", "1811880": "피격 시 회피율 2 ↑ G{{value}}", "1811890": "P변화기술 사용 시 방어 특수방어 ↑{{value}}", "1811900": "첫 등장 시 능력 7종 ↑{{value}}", "1811910": "피격 시 상대에게 스피드 2 ↓{{value}}", "1811920": "맑을 시 공격 시 방어 특수방어 ↓{{value}}", "1811930": "상대에게 BD기술 후 특수방어 ↓{{value}}", "1811940": "자기 첫 신오 C 특수 발생 시 특수공격 ↑{{value}}", "1811950": "B기술 후 자기 방어 특수방어 ↓{{value}}", "1811960": "기술 후 자기 방어 특수방어 ↓{{value}}", "1811970": "화상 상대 공격 시 특수공격 특수방어 ↓{{value}}", "1811980": "마비 상대 공격 시 공격 특수공격 ↑ G{{value}}", "1811990": "상대 실패 시 능력 2 ↑ G{{value}}", "1812010": "같은 편에게 기술 후 공격 업 {{value}}", "1812020": "지진 후 공격 다운 {{value}}", "1812030": "스피드 다운 반전", "1812040": "첫 등장 시 공격 업 {{value}}", "1812050": "첫 등장 시 특수공격 업 {{value}}", "1812060": "공격 시 특수공격 특수방어 다운 {{value}}", "1812070": "정령존 시 공격 시 2회 능력 ↓{{value}}", "1812080": "화상 상대 공격 시 능력2 ↓{{value}}", "1812090": "바인드 상대 공격 시 스피드2 ↓{{value}}", "1812100": "같은 편이 날씨 필드 존 발생 시 능력 5종 중 1종 2 ↑ G{{value}}", "1812110": "T기술 횟수 1 이상 시 공격 시 특수방어 ↓{{value}}", "1812120": "T기술 횟수 0 시 공격 시 능력2 ↓{{value}}", "1812130": "혼란 상대 공격 시 명중 ↓{{value}}", "1812140": "공격 시 능력2 다운 {{value}}", "1812150": "화상 상대 공격 시 공격 특수공격 ↓{{value}}", "1812160": "공격 시 공격2 다운 {{value}}", "1812170": "명중 시 스피드 업 {{value}}", "1812180": "공격 시 특수공격 4 다운 {{value}}", "1812190": "첫 P변화기술 사용 시 특수공격 ↑{{value}}", "1812200": "첫 P변화기술 사용 시 급소율 ↑{{value}}", "1812210": "공격 시 특수방어3 다운 {{value}}", "1812220": "상태이상 상대 같은 편 공격 시 능력 ↓{{value}}", "1812240": "피격 시 능력 통일2 ↑ G{{value}}", "1812260": "P변화기술 사용 시 스피드6 ↑{{value}}", "1812270": "맑을 시 같은 편 공격 시 스피드 ↑ G{{value}}", "1812280": "바인드 상대 같은 편 공격 시 능력 ↑{{value}}", "1812290": "상대에게 P기술 후 특수공격 ↓{{value}}", "1812300": "공격 시 명중률 3 다운 {{value}}", "1812310": "BD기술 후 방어 특수방어 ↑{{value}}", "1812320": "맑을 시 공격 시 방어 ↓{{value}}", "1812330": "주먹존 시 공격 시 특수방어 ↓{{value}}", "1812340": "자기 하나 C 특수 발생 시 방어 특수방어2 ↑ G{{value}}", "1812350": "공격 시 방어 특수방어 2 ↑ G{{value}}", "1812360": "첫 등장 시 능력 7종 ↑ G{{value}}", "1812370": "인파이트 후 공격 특수공격 ↓{{value}}", "1812380": "화상 상대 공격 시 방어 특수방어 ↓{{value}}", "1812390": "자기 하나 C 특수 발생 시 공격2 ↑ G{{value}}", "1812400": "자기 하나 C 특수 발생 시 특수공격2 ↑ G{{value}}", "1812410": "B 테라스탈 시 공격 ↑{{value}}", "1812420": "비 올 시 공격 시 능력2 ↓{{value}}", "1812430": "자기 첫 바위 타입 데미지 필드 발생 시 공격 ↑{{value}}", "1812440": "자기 첫 바위 타입 데미지 필드 발생 시 급소율 ↑{{value}}", "1812450": "상대 바위 타입 데미지 필드 시 공격 시 능력 2 ↓{{value}}", "1812460": "기술 후 공격 스피드 업 G{{value}}", "1812470": "화상 상대 공격 시 공격 방어 2 ↓{{value}}", "1812480": "독 상대 공격 시 방어 특수방어 ↓{{value}}", "1812490": "공격 시 방어 6 다운 {{value}}", "1812500": "공격 시 특수방어 6 다운 {{value}}", "1812510": "같은 편이 서클 발생 시 스피드 2 ↑ G{{value}}", "1812520": "자기 첫 성도 C 특수 발생 시 특수공격 ↑ G{{value}}", "1812530": "자기 첫 성도 C 특수 발생 시 급소율 ↑ G{{value}}", "1812540": "물리공격 시 물리 부스트 3 부여 {{value}}", "1812550": "특수공격 시 특수 부스트 3 부여 {{value}}", "1812560": "첫 등장 시 공격 특수공격 ↓ G{{value}}", "1812570": "공격 시 특수공격 2 다운 {{value}}", "1812580": "공격 시 방어 스피드 ↓{{value}}", "1812590": "혼란 상대 공격 시 특수방어 2 ↓{{value}}", "1812600": "공격 시 방어 3 다운 {{value}}", "1812610": "첫 등장 시 급소율 업 {{value}}", "1812620": "방어 성공 시 방어 4 ↓ G{{value}}", "1812630": "방어 성공 시 특수방어 4 ↓ G{{value}}", "1812640": "상대에게 P기술 B기술 후 방어 특수방어 2 ↓{{value}}", "1812650": "상대에게 기술 후 능력 통일 2 ↓{{value}}", "1812660": "공격 시 2회 능력 통일 다운 {{value}}", "1812670": "첫 등장 시 방어 특수방어 ↑ G{{value}}", "1812680": "등장 시 공격 6 급소율 {{value}} ↑", "1812690": "상대에게 기술 후 공격 2 ↓{{value}}", "1812700": "상대에게 기술 후 특수공격 2 ↓{{value}}", "1812710": "공격 시 공격 방어 2 ↓{{value}}", "1812720": "첫 등장 시 특수공격 {{value}} 급소 3 ↑", "1812730": "상대에게 P변화기술 사용 시 공격 특수공격 ↓{{value}}", "1812740": "GF 시 공격 시 방어 2 ↓{{value}}", "1812750": "암석존 시 공격 시 공격 2 ↓{{value}}", "1812760": "혼란 상대 공격 시 능력 2 ↓{{value}}", "1812770": "공격 시 공격 방어 다운 {{value}}", "1812780": "능력 다운 반사", "1812790": "자기 서클 발생 시 스피드 2 ↑ G{{value}}", "1812810": "EF 시 공격 시 능력 ↓{{value}}", "1812820": "첫 등장 시 BC 1 가속 & 급소율 3 ↑", "1812840": "공격 시 공격 2 업 G{{value}}", "1812850": "공격 시 특수공격 2 업 G{{value}}", "1812860": "첫 B기술 후 10회 능력 ↓ G", "1901010": "필드 관통 공격", "1902010": "첫 위기 시 필드에 물리 경감", "1902020": "B기술 후 GF화", "1902030": "첫 등장 시 싸라기눈화", "1902040": "등장 시 필드에 상태이상 방어", "1902050": "첫 B기술 후 필드에 게이지 가속", "1902060": "첫 등장 시 맑음화", "1902070": "첫 등장 시 비화", "1902080": "맑음 시간 연장 {{value}}", "1902090": "비 시간 연장 {{value}}", "1902100": "첫 등장 시 모래바람화", "1902110": "첫 B기술 후 맑음화", "1902120": "첫 B기술 후 비화", "1902130": "첫 B기술 후 모래바람화", "1902140": "첫 등장 시 필드에 물리, 특수 경감", "1902150": "P기술 후 날씨 해제 {{value}}", "1902160": "첫 B기술 후 필드에 급소방어", "1902170": "회복기술 후 필드에 게이지 가속", "1902180": "첫 B기술 후 EF화", "1902190": "모래바람 시간 연장 {{value}}", "1902200": "첫 등장 시 모래바람화 & 모래바람 무효", "1902210": "첫 P변화기술 사용 시 필드에 기술게이지 가속", "1902220": "P변화기술 사용 시 필드에 게이지 가속", "1902230": "첫 위기 시 필드에 게이지 가속", "1902240": "첫 B기술 후 대지존화", "1902250": "첫 등장 시 대지존화", "1902260": "물리 경감 시간 연장 {{value}}", "1902270": "특수 경감 시간 연장 {{value}}", "1902280": "상태이상 방어 시간 연장 {{value}}", "1902290": "BD기술 후 EF화", "1902300": "첫 등장 시 강철존화", "1902310": "정령존 시간 연장 {{value}}", "1902320": "첫 등장 시 정령존화", "1902330": "첫 등장 시 용의존화", "1902340": "B기술 후 비화", "1902350": "B기술 후 EF화", "1902360": "첫 등장 시 푸른하늘존화", "1902370": "기술 후 필드에 기술게이지 가속 {{value}}", "1902380": "암석존 시간 연장 {{value}}", "1902390": "B기술 후 필드에 기술게이지 가속", "1902400": "첫 등장 시 필드에 물리 경감", "1902410": "첫 B기술 후 주먹존화", "1902420": "첫 등장 시 EF화 & EF 시간 연장 {{value}}", "1902430": "첫 등장 시 정령존화 & 정령존 시간 연장 {{value}}", "1902440": "첫 등장 시 GF화 & GF 시간 연장 {{value}}", "1902450": "첫 등장 시 PF화 & PF 시간 연장 {{value}}", "1902460": "능력 상승 불가 시간 연장 {{value}}", "1902470": "기술 후 필드에 물리 경감 {{value}}", "1902480": "자기 고드름존 발생 시 싸라기눈화", "1902490": "B기술 후 PF화", "1902500": "B기술 후 정령존화", "1902510": "첫 등장 시 고드름존화", "1902520": "싸라기눈 시간 연장 {{value}}", "1902530": "고드름존 시간 연장 {{value}}", "1902540": "결정타 시 필드에 기술게이지 가속 {{value}}", "1902550": "첫 등장 시 원령존화", "1902560": "첫 등장 시 필드에 특수 경감", "1902570": "첫 B기술 후 싸라기눈화", "1902580": "용의존 시간 연장 {{value}}", "1902590": "B기술 후 공포존화", "1902600": "첫 HP 반감 시 맑음화", "1902610": "상대 악 타입 데미지 필드 시간 연장 {{value}}", "1902620": "첫 B기술 후 필드에 능력 상승 불가", "1902630": "기술 후 필드에 급소 방어 {{value}}", "1902640": "맹독존 시간 연장 {{value}}", "1902650": "첫 B기술 후 맹독존화", "1902660": "EF 시간 연장 {{value}}", "1902670": "첫 B기술 후 순백존화", "1902680": "하나 C 물리 시간 연장 {{value}}", "1902690": "B기술 후 푸른하늘존화", "1902700": "푸른하늘존 시간 연장 {{value}}", "1902710": "관동 C 특수 시간 연장 {{value}}", "1902720": "T기술 후 필드에 급소 방어 {{value}}", "1902730": "성도 C 물리 시간 연장 {{value}}", "1902740": "GF 시간 연장 {{value}}", "1902750": "자기 필드에 급소 방어 발생 시 필드에 물리 & 특수 경감", "1902760": "첫 등장 시 암석존화", "1902770": "B기술 후 암석존화", "1902780": "강철존 시간 연장 {{value}}", "1902790": "신오 C 방어 시간 연장 {{value}}", "1902800": "첫 등장 시 EF화", "1902810": "첫 등장 시 맹독존화", "1902820": "대지존 시간 연장 {{value}}", "1902830": "기술 후 필드에 능력 상승 불가 {{value}}", "1902840": "첫 P변화기술 사용 시 강철존화", "1902850": "하나 C 방어 시간 연장 {{value}}", "1902860": "첫 공격 시 필드에 능력 상승 불가", "1902870": "첫 등장 시 공포존화", "1902880": "가라르 C 특수 시간 연장 {{value}}", "1902890": "첫 HP 반감 시 싸라기눈화", "1902900": "BD기술 후 필드에 기술게이지 가속", "1902910": "원령존 시간 연장 {{value}}", "1902920": "공포존 시간 연장 {{value}}", "1902930": "알로라 C 특수 시간 연장 {{value}}", "1902940": "알로라 C 방어 시간 연장 {{value}}", "1902950": "T기술 후 필드에 게이지 가속 {{value}}", "1902960": "파시오 C 방어 시간 연장 {{value}}", "1902970": "B기술 후 고드름존화", "1902980": "첫 등장 시 GF화", "1902990": "거다이 난타 후 GF화", "1903020": "불꽃 타입 데미지 필드 무효", "1903080": "독 타입 데미지 필드 무효", "1903130": "바위 타입 데미지 필드 무효", "1903160": "악 타입 데미지 필드 무효", "1903170": "강철 타입 데미지 필드 무효", "1904020": "불꽃 타입 데미지 필드 내성 {{value}}", "1904080": "독 타입 데미지 필드 내성 {{value}}", "1904130": "바위 타입 데미지 필드 내성 {{value}}", "1904160": "악 타입 데미지 필드 내성 {{value}}", "1904170": "강철 타입 데미지 필드 내성 {{value}}", "1904190": "전체 데미지 필드 내성 {{value}}", "1905010": "첫 비바라기 사용 시 정령존화", "1905020": "거다이 화염구 후 맑음화", "1905030": "다이너클 후 주먹존화", "1905040": "다이제트 후 푸른하늘존화", "1905050": "BD기술 후 맑음화", "1905060": "첫 B기술 후 고드름존화", "1905070": "첫 B기술 후 용의존화", "1905080": "첫 쾌청 사용 시 GF화", "1905090": "BD기술 후 순백존화", "1905100": "순백존 시간 연장 {{value}}", "1905110": "팔데아 C 방어 시간 연장 {{value}}", "1905120": "BD기술 후 원령존화", "1905130": "첫 등장 시 PF화", "1905140": "첫 P기술 후 주먹존화", "1905150": "BD기술 후 맹독존화", "1905160": "첫 P기술 후 PF화", "1905170": "PF시간 연장 {{value}}", "1905180": "첫 등장 시 독 타입 데미지 필드화", "1905190": "첫 B기술 후 암석존화", "1905200": "첫 공격 시 비화", "1905210": "첫 나무열매 횟수 0 시 강철존화", "1905220": "피격 시 모래바람화 {{value}}", "1905230": "거다이 천벌 후 정령존화", "1905240": "첫 정령의 소원 사용 시 EF화", "1905250": "다이록 후 암석존화", "1905260": "첫 등장 시 비단벌레존화", "1905270": "비단벌레존 시간 연장 {{value}}", "1905280": "첫P기술 후 모래바람화", "1905290": "다이어스 후 대지존화", "1905300": "일렉트릭 필드 사용 시 맹독존화", "1905310": "첫 B기술 후 GF화", "1905320": "첫 등장 시 순백존화", "1905330": "첫 T기술 후 GF화", "1905340": "첫 등장 시 필드에 알로라 C 특수", "1905350": "B기술 후 불꽃 타입 데미지 필드화", "1905360": "자기 비 발생 시 필드에 가라르 C 특수", "1905370": "자기 GF 발생 시 필드에 가라르 C 물리", "1905380": "자기 맑음 발생 시 필드에 가라르 C 방어", "1905390": "B기술 후 날씨 해제 {{value}}", "1905400": "첫 등장 시 필드에 팔데아 C 특수", "1905410": "첫 B기술 후 필드에 팔데아 C 특수", "1905420": "대지존 시 게이지 가속 {{value}}", "1905430": "B기술 후 독 타입 데미지 필드화", "1905440": "상대 독 타입 데미지 필드 시간 연장 {{value}}", "1905450": "첫 등장 시 EX 맑음화", "1905460": "첫 등장 시 EX 비화", "1905470": "등장 시 필드에 능력 상승 불가", "1905480": "관동 C 방어 시간 연장 {{value}}", "1905490": "호연 C 방어 시간 연장 {{value}}", "1905500": "첫 B기술 후 필드에 관동 C 방어", "1905510": "첫 B기술 후 필드에 호연 C 방어", "1905520": "첫 B기술 후 필드에 팔데아 C 방어", "1905530": "신오 C 특수 시간 연장 {{value}}", "1905540": "게이지 가속 필드 시간 연장 {{value}}", "1905550": "호연 C 물리 시간 연장 {{value}}", "1905560": "성도 C 방어 시간 연장 {{value}}", "1905570": "첫 팔데아의 결속 사용 시 정령존화", "1905580": "BD기술 후 EX 비단벌레존화", "1905590": "성도 C 특수 시간 연장 {{value}}", "1905600": "첫 등장 시 필드에 성도 C 특수", "1905610": "첫 T기술 후 필드에 팔데아 C 방어", "1905620": "첫 등장 시 필드에 하나 C 방어", "1905630": "첫 B기술 후 필드에 하나 C 방어", "1905640": "BD기술 후 용의존화", "1905650": "주먹존 시간 연장 {{value}}", "1905660": "첫 B기술 후 필드에 성도 C 방어", "1905670": "첫 B기술 후 필드에 칼로스 C 방어", "1905680": "첫 B기술 후 필드에 가라르 C 방어", "1905690": "칼로스 C 방어 시간 연장 {{value}}", "1905700": "가라르 C 방어 시간 연장 {{value}}", "1905710": "첫 등장 시 필드에 신오 C 방어", "1905720": "첫 공격 시 EX 푸른하늘존화", "1905730": "첫 등장 시 필드에 특수 경감 & 특수 경감 시간 연장 {{value}}", "1905740": "첫 공격 시 원령존화", "1905750": "첫 공격 시 원령존화 & 원령존 시간 연장 {{value}}", "1905760": "B기술 후 필드에 특수 경감", "1905770": "자기 맑음 발생 시 주먹존화", "1905780": "첫 등장 시 필드에 팔데아 C 방어", "1905790": "첫 등장 시 필드에 하나 C 특수", "1905800": "등장 시 필드에 성도 C 물리 & 물리 부스트 G{{value}}", "1905810": "첫 공격 시 암석존화", "1905820": "첫 공격 시 용의존화", "1905830": "첫 B기술 후 필드에 관동 C 물리", "1905840": "첫 공격 시 EX 맹독존화", "1905850": "첫 B기술 후 필드에 신오 C 특수", "1905860": "첫 T기술 후 EX 원령존화", "1905870": "첫 공격 시 EX EF화", "1905880": "첫 공격 시 EX 대지존화", "1905890": "첫 B기술 후 정령존화", "1905900": "맑음 & 주먹존 시간 연장 {{value}}", "1905910": "첫 공격 시 필드에 팔데아 C 방어", "1905920": "첫 B기술 후 필드에 신오 C 방어", "1905930": "첫 B기술 후 필드에 알로라 C 방어", "1905940": "첫 등장 시 필드에 호연 C 방어", "1905950": "상대 바위 타입 데미지 필드 시간 연장 {{value}}", "1905960": "B테라스탈 시 공포존화", "1905970": "하나 C 특수 시간 연장 {{value}}", "1905980": "첫 등장 시 주먹존화", "1905990": "첫 등장 시 필드에 가라르 C 방어", "1906000": "첫 등장 시 필드에 가라르 C 방어 & 시간 연장 {{value}}", "1906010": "첫 등장 시 필드에 신오 C 특수", "1906020": "첫 등장 시 필드에 신오 C 특수 & 시간 연장 {{value}}", "1906030": "첫 등장 시 필드에 관동 C 물리 & 시간 연장 {{value}}", "1906040": "첫 공격 시 필드에 관동 C 특수", "1906050": "첫 B기술 후 필드에 관동 C 특수", "1906060": "같은 편이 맑음 발생 시 대지존화", "1906070": "첫 B기술 후 원령존화", "1906080": "첫 공격 시 PF화 & PF 시간 연장 {{value}}", "1906090": "첫 B기술 후 필드에 하나 C 물리", "1906100": "팔데아 C 특수 시간 연장 {{value}}", "1906110": "첫 P변화기술 사용 시 EX 고드름존화", "1906120": "첫 등장 시 필드에 파시오 C 방어", "1906130": "T기술 후 필드에 관동 C 특수", "1906140": "첫 B기술 후 푸른하늘존화", "1906150": "첫 공격 시 맹독존화", "1906160": "첫 T기술 후 비단벌레존화", "1906170": "첫 공격 시 맑음화", "1906180": "첫 공격 시 맑음화 & 맑음 시간 연장 {{value}}", "1906190": "B기술 후 순백존화", "1906200": "S기술 공격 시 GF화", "1906210": "S기술 공격 시 GF화 & GF시간 연장 {{value}}", "1906220": "첫 P변화기술 사용 시 정령존화", "1906230": "첫 공격 시 비단벌레존화", "1906240": "첫 B기술 후 PF화", "1906250": "첫 등장 시 영속 모래바람화", "1906260": "첫 등장 시 영속 맑음화", "1906270": "첫 등장 시 영속 푸른하늘존화", "1906280": "등장 시 필드에 물리 경감", "1906290": "등장 시 필드에 특수 경감", "1906300": "첫 등장 시 필드에 관동 C 특수", "1906310": "첫 공격 시 고드름존화", "1906320": "첫 P변화기술 사용 시 대지존화", "1906330": "첫 T기술 후 푸른하늘존화", "1906340": "첫 B기술 후 맹독존화 & 맹독존 시간 연장 {{value}}", "1906360": "BD기술 후 공포존화", "1906370": "첫 공격 시 정령존화", "1906380": "첫 공격 시 필드에 성도 C 방어", "1906390": "GF & 암석존 시간 연장 {{value}}", "1906400": "기술 후 비화", "1906410": "기술 후 공포존화", "1906420": "기술 후 비화 & 공포존화", "1906430": "비 & 공포존 시간 연장 {{value}}", "1906440": "첫 B기술 후 비화 & 비 시간 연장 {{value}}", "1906450": "신오 C 물리 시간 연장 {{value}}", "1906460": "첫 공격 시 암석존화 & 암석존 시간 연장 {{value}}", "1906470": "첫 S기술 공격 시 EX 주먹존화", "1906480": "칼로스 C 3종 시간 연장 {{value}}", "1906490": "팔데아 C 물리 시간 연장 {{value}}", "1906500": "자기 강철존 발생 시 필드에 가라르 C 방어", "1906510": "첫 등장 시 필드에 영속 물리 경감", "1906520": "첫 등장 시 필드에 영속 특수 경감", "1906560": "관동 C 물리 시간 연장 {{value}}", "1906570": "가라르 C 물리 시간 연장 {{value}}", "1906580": "첫 B기술 후 필드에 성도 C 물리", "1906590": "첫 B기술 후 필드에 성도 C 특수", "1906600": "첫 B기술 후 필드에 가라르 C 물리", "1906610": "첫 B기술 후 필드에 가라르 C 특수", "1906620": "첫 테라 버스트: 홍옥 후 순백존화", "1906630": "첫 B기술 후 필드에 관동 C 3종 & 시간 연장 {{value}}", "1906640": "첫 공격 시 EF화", "1906650": "첫 등장 시 필드에 관동 C 물리", "1906660": "첫 등장 시 필드에 관동 C 방어", "1906670": "첫 공격 시 공포존화 & 공포존 시간 연장 {{value}}", "1906680": "첫 등장 시 영속 정령존화", "1906710": "첫 등장 시 영속 공포존화", "1906720": "첫 B기술 후 주먹존화 & 주먹존 시 급소 무효 G", "1906730": "첫 파동탄: 신기 횟수 0 시 필드에 칼로스 C 특수", "1906740": "칼로스 C 특수 시간 연장 {{value}}", "1906750": "첫 바위깨기: 천파 횟수 0 시 필드에 칼로스 C 물리", "1906760": "칼로스 C 물리 시간 연장 {{value}}", "1906770": "물리 & 특수 경감 시간 연장 {{value}}", "1906780": "기술 후 필드에 물리 & 특수 경감 {{value}}", "1906790": "첫 공격 시 푸른하늘존화", "1906830": "첫 B기술 후 순백존화 & 순백존 시간 연장 {{value}}", "1906840": "등장 시 PF화", "1906850": "첫 공격 시 GF화", "1906860": "첫 공격 시 GF화 & GF 시간 연장 {{value}}", "1906880": "첫 공격 시 주먹존화", "2001010": "모래바람 무효", "2101010": "급소 무효", "2101020": "비 올 시 급소 무효 G", "2101030": "공포존 시 급소 무효 G", "2101040": "고드름존 시 급소 무효 G", "2101050": "팔데아 C 방어 시 급소무효 G", "2101060": "PF시 급소 무효", "2101070": "급소 무효 G", "2101080": "상대 독 타입 데미지 필드 시 급소 무효 G", "2101090": "필드에 게이지 가속 시 급소 무효 G", "2101100": "하나 C 특수 시 급소 무효 G", "2101110": "암석존 시 급소 무효 G", "2101120": "서클 시 급소 무효 G", "2101130": "순백존 시 급소 무효 G", "2101140": "필드 시 급소 무효", "2101150": "푸른하늘존 시 급소 무효", "2101160": "용의존 시 급소 무효 G", "2201010": "상태이상 확률 상승 {{value}}", "2201020": "방해 확률 상승 {{value}}", "2201030": "다운 확률 상승 {{value}}", "2201040": "급소 시 방해 확률 상승 {{value}}", "2201050": "업 확률 상승 {{value}}", "2201060": "상태이상·방해 확률 상승 {{value}}", "2201070": "다운확률 & 효과 2배", "2301010": "모래바람 시 특수방어 상승", "2301020": "싸라기눈 시 방어 상승", "2301030": "PF 시 특수방어 상승", "2301040": "모래바람 무효 & 모래바람 시 방어, 특수방어 상승", "2301050": "HP 절반 이상 시 공격 상승 {{value}}", "2301060": "P기술 전체화", "2301070": "B기술 후 P기술 전체화", "2301090": "HP 반감 시 방어 특수방어 ↑ {{value}}", "2301100": "싸라기눈 시 방어, 특수방어 상승", "2301110": "날씨 변화 시 능력 5종 상승", "2301120": "P변화기술 사용 시 능력 업 전체화 {{value}}", "2301130": "B기술 전체화", "2301140": "BD기술 전체화", "2301150": "같은 편 필드 효과 대상 시 능력 5종 ↑{{value}}", "2301160": "HP 감소 시 특수공격 상승 {{value}}", "2301170": "P기술 BD기술 전체화", "2301180": "상대에게 P변화기술 다운 G{{value}}", "2301190": "맑을 시 공격 상승 {{value}}", "2301200": "EF 시 특수공격 상승 {{value}}", "2301210": "P기술 B기술 전체화", "2301220": "P기술 B기술 공격 전체화", "2301230": "B테라스탈 중 능력 5종 ↑{{value}}", "2401010": "노말 가드", "2401020": "불꽃 가드", "2401030": "물 가드", "2401040": "전기 가드", "2401050": "풀 가드", "2401060": "얼음 가드", "2401070": "격투 가드", "2401080": "독 가드", "2401090": "땅 가드", "2401100": "비행 가드", "2401110": "에스퍼 가드", "2401120": "벌레 가드", "2401130": "바위 가드", "2401140": "고스트 가드", "2401150": "드래곤 가드", "2401160": "악 가드", "2401170": "강철 가드", "2401180": "페어리 가드", "2401200": "드래곤 가드 G", "2401210": "불꽃 가드 G", "2401220": "물 가드 G", "2401240": "풀 가드 G", "2501010": "고대의 부르짖기", "2501020": "고대의 날갯짓", "2501030": "고대의 뇌명", "2501040": "미래의 빛나는 검", "2801010": "가라르의 인도", "2801020": "호연의 투지", "2801030": "호연의 신념", "2801040": "하나의 인도", "2801050": "호연의 인도", "2801060": "알로라의 인도", "2801070": "알로라의 신념", "2801090": "성도의 신념", "2801100": "성도의 투지", "2801110": "성도의 인도", "2801120": "관동의 인도", "2801130": "관동의 신념", "2801140": "칼로스의 투지", "2801150": "칼로스의 신념", "2801160": "가라르의 투지", "2801170": "가라르의 신념", "2801180": "신오의 투지", "2801190": "신오의 신념", "2801200": "관동의 투지", "2801210": "하나의 투지", "2801220": "팔데아의 인도", "2801230": "하나의 신념", "2801240": "팔데아의 투지", "2801250": "파시오의 인도", "2801260": "팔데아의 신념", "2801270": "알로라의 투지", "2802010": "바위의 카리스마", "2802020": "격투의 카리스마", "2802030": "불꽃의 카리스마", "2802040": "신오의 인도", "2802050": "땅의 카리스마", "2802060": "에스퍼의 카리스마", "2802070": "얼음의 카리스마", "2802080": "강철의 카리스마", "2802090": "풀의 카리스마", "2802100": "전기의 카리스마", "2802110": "노말의 카리스마", "2802120": "벌레의 카리스마", "2804010": "가라르의 반짝이는 에이스", "2804020": "관동의 반짝이는 전설", "2804030": "히스이의 반짝이는 진주", "2804040": "히스이의 포켓몬술사", "2804050": "북신의 멋진 여자", "2804060": "하나 지방의 상냥한 영웅", "2804070": "하나 지방의 열혈 소녀", "2804080": "관동의 또 하나의 시작", "2804090": "팔데아의 개구쟁이 호기심", "2804100": "팔데아의 거대한 수수께끼", "2901010": "강철의 신화", "2901020": "용의 신화", "2901030": "대지의 신화", "2901040": "불구슬의 신화", "2901050": "공포의 신화", "2901060": "비단벌레의 신화", "2901070": "푸른하늘의 신화", "2901080": "물방울의 신화", "2901090": "암석의 신화", "2901100": "이상한 신화", "2901110": "주먹의 신화", "2902010": "강철의 심판", "2902020": "용의 심판", "2902030": "대지의 심판", "2902040": "불구슬의 심판", "2902050": "공포의 심판", "2902060": "비단벌레의 심판", "2902070": "푸른하늘의 심판", "2902080": "물방울의 심판", "2902090": "암석의 심판", "2902100": "이상한 심판", "2902110": "주먹의 심판", "2903040": "신오의 속공", "2903080": "가라르의 속공", "2903090": "팔데아의 속공", "3201010": "두드려서 울리는 나무들의 평온함", "3201020": "로열 칼로스 프린세스", "3201030": "미르 시티의 명탐정", "3201040": "제목: 피안에 내리는 비", "3201050": "가라르 지방의 발전에 심혈을 기울이는 풍운아", "3201060": "매크로 코스모스의 유능한 비서", "3201070": "내뿜는 뜨거운 열정", "3201080": "승부를 향한 무한 에너지", "3201090": "비정한 칼 솜씨", "3201100": "스타의 반짝임", "3201110": "레츠 고! 이브이!", "3201120": "절대영도 트릭", "3201130": "히스이 지방의 영업용 미소", "3201140": "꿈쩍도 안 할 거예요", "3201150": "영원히 불타는 사나이", "3201160": "천하일품의 올바른 마음", "3201170": "봉신 마을 출신의 탐구심", "3201180": "넘버원의 자부심", "3201190": "시작의 붉은 여행길", "3201200": "시작의 푸른 여행길", "3201210": "시작의 초록 여행길", "3201220": "하나 지방의 흑의 영웅", "3201230": "용의 마음을 아는 소녀", "3201240": "검은 서브웨이 마스터", "3201250": "하얀 서브웨이 마스터", "3201260": "찬란한 금강", "3201270": "모래투성이의 셀카", "3201280": "황금색으로 빛나는 미래", "3201290": "섀도 파이터", "3201300": "호연 지방에서 체험한 모든 것", "3201310": "수호신이 가져다주는 결실", "3201320": "달리는 북풍을 쫓는 남자", "3201330": "더 높이 이겨 올라가는 챔피언", "3201340": "타워 타이쿤의 말", "3201350": "히스이 지방에서 살아남은 기술", "3201360": "과거의 스파이크 마을", "3201370": "레츠 고! 피카츄!", "3201380": "도정은 데인저러스", "3201390": "엘레강스 에스퍼 파워", "3201400": "울트라하게 쌓고 쌓기", "3201410": "뮤직 스타트!", "3201420": "아카데미를 짊어지고 있는 자", "3201430": "두근거리는 가슴의 고동", "3201440": "눈물을 흘리며 뺏는 자", "3201450": "스파이크 마을의 신성", "3201460": "칼로스 지방의 인기 여배우", "3201470": "일깨우는 피리 소리", "3201480": "앞서가는 힘", "3201490": "어둠 속에서 잠드는 세계", "3201500": "푸른 하늘을 나는 파일럿", "3201510": "핑크 엘리트의 고집", "3201520": "상냥한 마음의 푸른 날개", "3201530": "고대의 사냥 기술", "3201540": "세계를 바꾸는 수식", "3201550": "추한 세계를 새로 만드는 힘", "3201610": "요정왕의 검", "3201620": "함께 걸어가는 훌륭함", "3201630": "드래곤 스톰", "3201640": "유대를 소중히 여기는 왕", "3201650": "무한대의 챔피언", "3201660": "샤이닝 뷰티", "3201670": "초승달의 가호", "3201680": "솔직한 마음의 붉은 날개", "3201690": "수수께끼의 체육관 관장의 정체", "3201700": "이어받은 물의 오의", "3201710": "돌연변이의 의지", "3201720": "녹색 머리 귀공자", "3201730": "승리를 부르는 투지", "3201740": "국제 경찰의 엘리트", "3201750": "호전적인 수호신", "3201760": "생명이 넘치는 인분", "3201770": "포켓몬에 대한 애정과 신뢰", "3201780": "악을 물리치는 것", "3201790": "스테이지 마돈나의 시련", "3201800": "이성을 날리는 음악", "3201810": "일렉트리컬 ★ 스트리머", "3201820": "룰렛 여신의 미소", "3201830": "전직 연구자의 테크닉", "3201840": "팔데아 지방 첫번째 사천왕", "3201850": "비범한 샐러리맨", "3201860": "아레나 캡틴의 판정", "3201870": "울트라한 만남", "3201880": "팔팔 넘치는 기운", "3201890": "파이팅 파머", "3201900": "스타단의 해결사", "3201910": "맹독은 한 방울만 남아도 위험한 법!", "3201920": "화석 포켓몬의 로망", "3201930": "세상을 향해 날개 치는 새 조련사", "3201940": "눈처럼 차가운 현실", "3201950": "메카닉 자제의 자존심", "3201960": "광산왕의 영애", "3201970": "난관을 돌파한 실력자", "3201980": "미래에서 온 난입자", "3201990": "다이너마이트 프리티걸", "3202010": "에볼루션 파이터!", "3202020": "머리를 뜨겁게 회전시키자!", "3202030": "머릿속 폴더에 잘 저장해 둬~!", "3202040": "팬의 기대에 답해야지", "3202050": "멋진 여자의 미모", "3202060": "미혹의 소울풀 댄서", "3202070": "포이즌 라이프 포이즌 라이브!", "3202080": "잔잔한 물가 언덕의 캡틴", "3202090": "팀을 연결하는 자", "3202100": "카메라를 좋아하는 나그네", "3202110": "강하고 아름다운 머리 손질", "3202120": "흑요 들판의 캡틴", "3202130": "보건실의 천사", "3202140": "네이처 아티스트", "3202150": "포효하는 드래곤", "3202160": "수제 볼의 온기", "3202200": "되살아나는 과거의 열광", "3202210": "정직하면서도 비뚤어진 자", "3301050": "첫 등장 시 풀 타입 B 테라스탈", "3301070": "첫 등장 시 격투 타입 B 테라스탈", "3301080": "첫 등장 시 독 타입 B 테라스탈", "3301130": "첫 등장 시 바위 타입 B 테라스탈", "3301150": "첫 등장 시 드래곤 타입 B 테라스탈", "3301160": "첫 등장 시 악 타입 B테라스탈", "3301190": "첫 B기술 시 풀 타입 B테라스탈", "3301200": "첫 B기술 시 스텔라 B테라스탈", "5130206": "비변화 시 P기술 B기술 경감 {{value}}", "5130207": "비상태이상 시 P기술 B기술 경감 {{value}}", "5170401": "결정타 시 차회 급소", "5210101": "비상태이상 시 급소 무효", "5230101": "등장 시 방어 {{value}}배", "5230102": "등장 시 특수방어 {{value}}배", "9901010": "배틀 스위치", "9901020": "오박사의 연구성과", "9901050": "데미지 관통 공격", "9901080": "블래리의 대승부", "9901100": "비주기의 수완", "9901120": "물 가드 & 비 올 시 HP 회복", "9901130": "레드의 투기", "9901140": "지우의 열기", "9901150": "지우의 근성", "9901160": "난천의 기백", "9901170": "투지의 노림수", "9901180": "투지의 작전", "9901190": "멋지게 악 변화", "9901200": "아름답게 물 변화", "9901210": "조용한 투지로 물 변화", "9901220": "엄격하게 악 변화", "9901230": "로즈의 업적", "9901240": "파시오의 에이스", "9901250": "고상의 결의", "9901260": "태초의 여행", "9901270": "찬란히 흩날리는 백설", "9901280": "태초의 프라이드", "9901290": "울려 퍼지는 백뢰", "9901300": "태초의 애정", "9901310": "밤하늘을 비추는 백염", "9901320": "비주기의 경험", "9901330": "아폴로의 제안", "9901340": "아테나의 위압", "9901350": "람다의 책략", "9901360": "랜스의 작전", "9901370": "조사대의 소양", "9901380": "스타의 샤우트", "9901390": "팩토리의 지식", "9901400": "통쾌하고 하이한 노랫소리", "9901410": "애수 어린 로우한 노랫소리", "9901420": "관동을 여행하며 얻은 것", "9901440": "옛 노스탤지어", "9901450": "공연: 에스퍼", "9901451": "공연: 격투", "9901460": "감정을 조종하는 선율", "9901470": "풀 타입 연구 성과", "9901480": "작전: 공격 중시", "9901490": "베스트한 찬스", "9901500": "나에게 응원을~!", "9901510": "깜짝 일루전!", "9901520": "설산의 무서움", "9901530": "달려 나가는 찌릿찌릿", "9901540": "조금 집어먹기", "9901550": "더 있어!", "9901560": "샘솟는 호기심", "9901580": "주문은 이쪽?", "9901590": "댄싱 히트", "9901600": "치프 챔피언의 기세", "9901610": "치프 챔피언의 반짝임", "9901620": "파괴하는 본능", "9901630": "새빨간 머리의 반항심", "9901640": "치프 챔피언의 재능 ", "9901650": "장사할 기회", "9901660": "지니어 선생님의 수업", "9901670": "마법 나라의 규칙", "9901680": "계절을 바꾸는 힘", "9901690": "신참 교사의 기지", "9901700": "동료를 지키는 결의", "9901710": "박사 조수의 관찰 결과", "9901720": "사회인의 테크닉", "9901730": "쑥쑥 자라라!", "9901740": "만지면 위험해...", "9901750": "포이즌 풀코스", "9901770": "페퍼님의 기운 팔팔 샌드위치", "9901780": "비전 스파이스의 효능", "9901790": "알로라로 모두 친구!", "9901800": "밝고 건강한 학생회장", "9901810": "무르익는 공격", "9901820": "모험을 통해 얻은 것", "9901830": "방랑하는 돌 마니아", "9901840": "꼬리를 내리고 돌아갈 텐가?", "9901850": "망토를 두른 드래곤 조련사", "9901860": "쌓아 올린 고생", "9901870": "신화의 고고학자", "9901880": "포켓몬과 서로 믿는 힘", "9901890": "질 수 없는 자존심", "9901900": "황금의 위광", "9901910": "왕가의 재력", "9901920": "소설가의 무서운 이야기", "9901930": "DJ 악동의 주파수", "9901940": "미래의 왕을 보좌하는 힘", "9901990": "비주기의 욕망", "9902000": "열광하는 목소리에 답하는 챔피언", "9902010": "챔피언 타임!", "9902020": "무적의 단델", "9902040": "폭발하는 예술성", "9902050": "독으로 시작했으니 독으로 끝낼 것이오!", "9902060": "...뜨겁게 살자고", "9902070": "모래바람을 일으켜라!", "9902080": "미쳐 날뛰는 기념 촬영", "9902100": "신사적인 콤비네이션", "9902110": "온화한 콤비네이션", "9902120": "끈기의 승부", "9902130": "달아오르는 콤비네이션", "9902140": "배고픔의 고동", "9902150": "자신만의 보물", "9902160": "애정의 답례", "9902170": "꽃다발 선물", "9902180": "먹보 엔진", "9902190": "멈출 수 없는 호기심", "9902200": "전해지는 부드러운 마음", "9902210": "꽃피는 재능", "9902220": "정원 같은 거대한 몸", "9902230": "타의추종을 불허하는 강력함", "9902240": "주홍빛 힘의 각성", "9902250": "신화에 남는 끝의 대지", "9902260": "호연의 열기", "9902270": "쪽빛 힘의 각성", "9902280": "신화에 남는 시작의 바다", "9902290": "호연의 은총", "9902300": "포켓몬과 사람을 잇는 다리", "9902310": "수학의 천재", "9902320": "지기 싫어하는 자제", "9902330": "구수한 전략", "9902340": "화석 발굴의 성과", "9902350": "높은 곳에서 느끼는 바람", "9902360": "차갑게 식은 열정", "9902370": "가라르를 구한 검", "9902380": "무지갯빛으로 빛나는 불꽃", "9902390": "우등생의 소곤소곤 이야기", "9902400": "만천성의 성적", "9902410": "먹보 파트너", "9902420": "아가씨의 라이딩 테크닉", "9902430": "어둠 속에서 흔들리는 혼불", "9902440": "수행자 교사의 무서운 이야기", "9902450": "무리를 이끄는 강철의 빛", "9902460": "이기고자 하는 마음은 지지 않았어...!", "9902470": "봉인된 사악한 주문", "9902480": "화불단행 병상첨병", "9902490": "집합하는 영혼", "9902500": "깊은 바다를 헤엄치는 자", "9902510": "뜨거운 대지를 달리는 자", "9902520": "방랑의 챔피언", "9902540": "다이맥스 런웨이", "9902550": "비내리는 눈부신 스테이지", "9902560": "엄청 잘 있어~!", "9902570": "생명 폭발!!", "9902580": "타오르는 든든함", "9902590": "미래의 강철 칼날", "9902600": "부서지지 않는 엘리트 의식", "9902610": "역사에 새기는 이름", "9902620": "강함을 겨루는 순진함", "9902630": "쌓아 올려 온 고생", "9902640": "노래와 춤의 스테이지", "9902650": "태양을 삼키는 짐승", "9902660": "끝없이 끓어오르는 에너지", "9902670": "부드러운 아침 햇살", "9902680": "달을 현혹하는 짐승", "9902690": "방출하고 있는 힘", "9902700": "따뜻한 달빛", "9902710": "강한 햇살이 가져온 변화", "9902720": "풍요로운 은혜의 활용 방법", "9902730": "하이 리스크 하이 리턴", "9902740": "주사위는 던져졌다!", "9902750": "은색으로 빛나는 혼", "9902760": "소용돌이 치는 폭풍", "9902770": "깊은 바다를 나는 은색 날개", "9902780": "마음을 가라앉히는 아름다움", "9902790": "물결의 추억", "9902800": "금색의 올바른 마음", "9902810": "영원히 사라지지 않는 무지개", "9902820": "행복을 부르는 무지개색 날개", "9902830": "즐거운 것을 하자!", "9902840": "레츠 바캉스!", "9902850": "외출하기 좋은 날", "9902860": "북신의 햇살", "9902870": "감미로운 꿀맛 사과", "9902880": "북신류 대접", "9902890": "승부욕 강하고 기가 센 누나", "9902900": "싹트는 계절의 시작", "9902910": "오컬트 연구부 부장", "9902920": "자연과 사람이 공존하는 소원", "9902930": "공격 프로그램", "9902940": "회복 프로그램", "9902950": "유령들의 윤무곡", "9902960": "포이즌 라이브의 일체감", "9902970": "다이내믹한 물보라", "9902980": "메모리 에뮬레이터", "9902990": "에너지 넘치는 미소의 반짝임", "9903000": "바위 타입과 싸운 기억", "9903010": "가라르 에이스의 결정타", "9903020": "고요한 투지의 반짝임", "9903030": "흘러넘치는 용의 오라", "9903040": "리빙 레전드의 감", "9903050": "승부를 진정시키는 도우미", "9903060": "영혼을 침식하는 공간", "9903070": "지식과 혜안을 가진 두령의 결단", "9903080": "창조신에 대한 심취", "9903090": "깨어진 이상한 기척", "9903100": "천지가 분간이 되지 않는 세계", "9903110": "배틀 애호가가 일으키는 선풍", "9903120": "백의 영웅이 울리는 뇌명", "9903130": "흑의 영웅이 불러오는 풍요", "9903140": "순환하는 계절의 화신", "9903150": "궁극코스 레드의 진심", "9903160": "리프의 온 힘", "9903170": "궁극코스 실버의 일심", "9903180": "궁극코스 금선의 진심", "9903190": "봄이의 온 힘", "9903200": "성호(스페셜)의 일심", "9903210": "궁극코스 난천(어나더2)의 진심", "9903220": "궁극코스 태홍의 온 힘", "9903230": "명희의 일심", "9903240": "N(22시즌)의 진심", "9903250": "카르네의 온 힘", "9903260": "칼름의 일심", "9903270": "릴리에(24시즌)의 진심", "9903280": "용식(스페셜)의 온 힘", "9903290": "우리(어나더)의 일심", "9903300": "단델의 진심", "9903310": "모야모의 온 힘", "9903320": "페퍼의 일심", "9903330": "카운트나 하고 있을 때가 아니지!", "9903340": "워낙 성급하고 센 고집", "9903350": "120번 도로의 추억", "9903360": "들판의 은혜", "9903370": "셔터 찬스의 예감이...!", "9903380": "그대로 계속해 줘...계속...!", "9903390": "귀염 사악하게 갈게요!", "9903400": "장난칠 거예요~!", "9903410": "노랑 음색의 춤", "9903420": "초록 음색의 춤", "9903430": "진정시키는 힘을 한 번 더", "9903440": "짙은 그림자", "9903450": "최고의 불 조절", "9903460": "최고의 찻잎", "9903480": "최고의 물", "9903490": "마하 2의 상승 지향", "9903500": "관동 최강의 유전자", "9903510": "철벽 가드의 배려심", "9903520": "마지막까지 포기하지 않는 강철의 마음", "9903530": "독 가시의 무대", "9903540": "트레이닝하기 편한 날씨", "9903550": "베테랑 트레이너의 연구", "9903560": "뜨거운 호연 지방의 태양", "9903570": "두 세계가 섞이는 곳", "9903580": "단숨에 몰아붙이자!", "9903590": "급소라니 무슨 소리야!", "9903600": "뭐 잘못 먹기라도 한 거야?", "9903610": "식욕을 돋우는 불 같이 매운 요리", "9903620": "페퍼 특제 핫 칠리 소스", "9903630": "갑작스러운 설경", "9903640": "극저온의 냉기", "9903650": "미래에서 갈고 닦아진 일격", "9903660": "흔들리지 않는 강철의 정의", "9903670": "투지를 이끄는 힘", "9903680": "초고속 발차기", "9903690": "관동 지방 톱 레벨", "9903700": "초음속의 에이스", "9903710": "나인 타입 부스트", "9903720": "최후의 관문을 지키는 용", "9903730": "펑펑 터져라~!", "9903740": "색칠을 시작한다!", "9903750": "내가 뜻하는 대로!", "9903760": "평생 잊을 수 없는 승부", "9903780": "새어 나온 냉기", "9903790": "10000 광년 이른 도전", "9903800": "딱딱한 의지와 유대의 남자", "9903810": "나의 방침은 말이지...", "9903820": "귀염둥이 물 포켓몬", "9903830": "공격하고 또 공격하는 거야!", "9903840": "옷 좀 갈아입어 볼까!", "9903850": "망토를 두른 챔피언의 기백", "9903860": "용의 비상", "9903870": "쌍둥이 섬의 정경", "9903880": "등불 산의 정경", "9903890": "살짝 흔들릴 거야", "9903900": "뺨의 방전", "9903910": "태초 마을의 소년", "9903920": "과묵한 트레이너", "9903930": "자! 축제다!", "9903940": "고향의 응원", "9903950": "응원에 답하는 웃는 얼굴", "9903960": "일부러 봐드린 겁니다", "9903970": "특대급 감사 인사를 받아라!", "9903980": "페어리 타입 관찰 성과", "9903990": "싸움 대비", "9904000": "제로로 되돌리는 빛", "9904010": "테라스탈 등껍질", "9904030": "에스퍼 소녀의 미래 예지", "9904040": "끌어당기는 승리의 미래", "9904050": "가라르의 하늘을 나는 검은 강철", "9904060": "적수가 없는 위압의 날개", "9904070": "메가 진화의 계승자", "9904080": "승리로 이끄는 파동", "9904090": "플래시 켠다!", "9904100": "셔터 속도 업!", "9904200": "제로의 비보가 발하는 빛", "9904210": "벽록의 가면에 숨겨진 힘", "9904300": "민화의 낮잠 자기 좋은 날", "9904310": "태주의 전력 질주", "9904320": "그린의 선배 티", "9904330": "레드의 고요한 투지", "9904340": "비주기의 부푸는 야망", "9904350": "채두의 마음의 자양분", "9904360": "호브의 진정한 힘", "9904370": "우리의 진검 승부", "9904380": "마리의 타오르는 오라", "9904390": "비트의 꺾이지 않는 재능" }, "zh": { "1101010": "首次危機時 HP回復{{value}}", "1101020": "HP回復招式 回復量增加{{value}}", "1101030": "對手失敗時 HP回復{{value}}", "1101040": "招式後 HP回復{{value}}", "1101050": "瀕死時 我方HP中回復{{value}}", "1101060": "拍招後 HP中回復{{value}}", "1101070": "拍招後 HP中回復G{{value}}", "1101080": "我方中招後 HP中回復{{value}}", "1101090": "防禦成功時 HP回復{{value}}", "1101100": "攻擊時 HP回復G{{value}}", "1101110": "被攻擊時 HP回復G{{value}}", "1101120": "效果絕佳時 HP回復{{value}}", "1101130": "擊中要害時 HP回復{{value}}", "1101140": "效果絕佳時 HP回復G{{value}}", "1101150": "首次危機時 HP完全回復", "1101160": "回復招式後 HP中回復G{{value}}", "1101170": "晴天時 使出招式時 HP回復G{{value}}", "1101180": "晴天時 使出招式時 HP回復{{value}}", "1101190": "拳頭領域時 被攻擊時 HP回復G{{value}}", "1101200": "使出招式時 HP回復{{value}}", "1101220": "命中時 HP回復{{value}}", "1101230": "拳頭領域時 被攻擊時 HP回復{{value}}", "1101240": "惡顏領域時 使出招式時 HP回復G{{value}}", "1101250": "極巨招式後 HP回復{{value}}", "1101260": "首次HP減半時 HP回復{{value}}", "1101270": "首次拍招後 HP中回復G{{value}}", "1101290": "被攻擊時 HP回復{{value}}", "1101300": "拳頭領域時 HP回復{{value}}", "1101310": "攻擊混亂對手 HP回復{{value}}", "1101320": "攻擊異常對手 HP回復G{{value}}", "1101330": "青草場地 使出招式時 HP回復G{{value}}", "1101340": "首次HP60% HP回復{{value}}", "1101350": "攻擊麻痺對手 HP回復{{value}}", "1101360": "攻擊時 HP中回復{{value}}", "1101370": "淨空領域時 HP回復{{value}}", "1101380": "寶可夢首次使出變化招式時HP回復{{value}}", "1101390": "攻擊時 HP回復{{value}}", "1101400": "訓練家出招後HP中回復{{value}}", "1101410": "劇毒領域時HP回復{{value}}", "1101420": "冰柱領域 使出招式 HP回復G{{value}}", "1101430": "首次拍招後 HP中回復{{value}}", "1101440": "鬥陣時 HP回復{{value}}", "1101450": "攻擊妨害對手 HP回復{{value}}", "1101460": "危機時灼傷時 攻擊時 HP中回復{{value}}", "1101470": "攻擊中毒對手 HP回復{{value}}", "1101480": "回復招式後 HP回復{{value}}", "1101490": "藍天領域時 HP回復{{value}}", "1101500": "攻擊麻痺 中的對手時 HP回復G{{value}}", "1101520": "極巨招式後 HP回復G{{value}}", "1101530": "首次被 拍招攻擊時 HP回復G{{value}}", "1101540": "我方攻擊 束縛中的對手時 HP回復{{value}}", "1101550": "隊伍使出 拍招後 HP回復G{{value}}", "1101560": "HP減半消耗 自我再生次數 &HP回復5", "1101570": "淨空領域時 被攻擊時 HP回復G{{value}}", "1101580": "淨空領域時 被拍招攻擊時 HP回復{{value}}", "1101590": "被招式及拍招 攻擊HP減半 消耗樹果&HP 回復{{value}}", "1101600": "隊伍使出拍組招式後HP回復{{value}}", "1101610": "寶可夢出招後HP回復G{{value}}", "1101620": "冰柱領域時HP回復{{value}}", "1101630": "龍之領域時HP回復{{value}}", "1101640": "HP回復量0", "1201010": "下雨時 計量槽加速{{value}}", "1201020": "晴天時 計量槽加速{{value}}", "1201030": "異常時 計量槽加速{{value}}", "1201040": "沙暴時 計量槽加速{{value}}", "1201050": "冰雹時 計量槽加速{{value}}", "1201060": "電氣場地時 計量槽加速{{value}}", "1201070": "精神場地時 計量槽加速{{value}}", "1201080": "首次上場時 計量槽加速場", "1201090": "龍之領域時 計量槽加速{{value}}", "1201100": "藍天領域時 計量槽加速{{value}}", "1201110": "天氣變化時 計量槽加速{{value}}", "1201120": "惡顏領域時 計量槽加速{{value}}", "1201130": "鋼鐵領域時 計量槽加速{{value}}", "1201140": "妖怪領域時 計量槽加速{{value}}", "1201150": "玉蟲領域時 計量槽加速{{value}}", "1201160": "青草場地時 計量槽加速{{value}}", "1201170": "拳頭領域時 計量槽加速{{value}}", "1201180": "妖精領域時 計量槽加速{{value}}", "1201190": "劇毒領域時 計量槽加速{{value}}", "1201200": "岩石領域時 回氣加速{{value}}", "1201210": "我方 場地效果時 計量槽加速{{value}}", "1201220": "淨空領域時 計量槽加速{{value}}", "1201240": "鬥陣時 計量槽加速{{value}}", "1201250": "天氣場地領域 變化時計量槽 加速{{value}}", "1202010": "招式後 計量槽增加{{value}}", "1202020": "拍招後 計量槽增加{{value}}", "1202030": "首次危機時 計量槽增加{{value}}", "1202040": "被攻擊時 計量槽增加{{value}}", "1202050": "拍招後 計量槽增加G{{value}}", "1202060": "招式後 計量槽增加G{{value}}", "1202080": "其他拍組瀕死 計量槽增加{{value}}", "1202090": "對手失敗時 計量槽↑{{value}}", "1202100": "攻擊時 計量槽增加{{value}}", "1202110": "寶可夢出招後 計量槽增加{{value}}", "1202120": "擊中要害時 計量槽增加{{value}}", "1202130": "擊中要害時 計量槽增加{{value}}", "1202140": "防禦成功時 計量槽增加{{value}}", "1202150": "寶可夢使出 變化招式時 計量槽增加{{value}}", "1202160": "打倒對手時 計量槽增加{{value}}", "1202170": "失敗時 計量槽增加{{value}}", "1202180": "暗影潛襲後 計量槽增加{{value}}", "1202190": "命中時 計量槽增加{{value}}", "1202200": "攻擊混亂對手 招式計量槽2↑{{value}}", "1202210": "攻擊 無法閃避對手 計量槽↑{{value}}", "1202220": "精神場地 使出招式時 計量槽增加{{value}}", "1202230": "灼傷時攻擊時 招式計量槽2↑{{value}}", "1202250": "攻擊禁止替換中的對手時計量槽2↑{{value}}", "1202260": "我方攻擊 混亂中的對手時 計量槽2↑{{value}}", "1202270": "我方攻擊 混亂中的對手時 計量槽↑{{value}}", "1301010": "危機時 威力提升{{value}}", "1301020": "沙暴時 威力提升{{value}}", "1301030": "異常狀態時 威力提升{{value}}", "1301040": "效果絕佳時 威力提升{{value}}", "1301050": "威力隨 計量槽提升{{value}}", "1301060": "擊中要害時 威力提升{{value}}", "1301070": "一齊機會時 威力提升{{value}}", "1301090": "天氣變化時 威力提升{{value}}", "1301100": "威力隨 HP提升{{value}}", "1301110": "晴天時 威力提升{{value}}", "1301120": "對手麻痺時 威力提升{{value}}", "1301130": "對手灼傷時 威力提升{{value}}", "1301140": "冰雹時 威力提升{{value}}", "1301150": "對手冰凍時 威力提升{{value}}", "1301160": "下雨時 威力提升{{value}}", "1301170": "混亂時 威力提升{{value}}", "1301180": "對手混亂時 威力提升{{value}}", "1301190": "依對手特攻 降幅威力↑", "1301200": "威力隨 對手HP提升{{value}}", "1301210": "對手異常時 威力提升{{value}}", "1301220": "對手妨害狀態 威力↑{{value}}", "1301230": "依速度升幅 威力提升", "1301240": "依防禦升幅 威力提升", "1301250": "對手畏縮時 威力提升{{value}}", "1301260": "對手睡眠時 威力提升{{value}}", "1301270": "對手中毒時 威力提升{{value}}", "1301280": "對手束縛時 威力提升{{value}}", "1301300": "依對手 命中率降幅 威力↑", "1301310": "依特防升幅 威力提升", "1301320": "依對手 速度降幅 威力提升", "1301330": "依閃避率升幅 威力提升", "1301340": "依攻擊升幅 威力提升", "1301350": "依命中率升幅 威力↑", "1301360": "依HP降幅 威力提升{{value}}", "1301370": "電氣場地時 威力提升{{value}}", "1301380": "依對手 防禦降幅 威力↑", "1301390": "依對手 特防降幅 威力↑", "1301400": "依對手 閃避率降幅 威力↑", "1301410": "依對手 攻擊降幅 威力↑", "1301420": "依對手 能力降幅 威力↑", "1301430": "惡屬性 威力提升{{value}}", "1301440": "妖精屬性 威力提升{{value}}", "1301450": "計量槽 消耗增加 威力提升{{value}}", "1301470": "依花紋不同 威力提升", "1301480": "對手 禁止替換時 威力提升{{value}}", "1301490": "依特攻升幅 威力提升", "1301500": "無傷上場時 下次效果絕佳 威力提升", "1301510": "禁止替換時 威力提升{{value}}", "1301520": "晴天時 計量槽加速 威力提升{{value}}", "1301530": "下雨時 計量槽加速 威力提升{{value}}", "1301540": "無傷時 威力提升{{value}}", "1301550": "速度下降時 威力提升{{value}}", "1301560": "沙暴無效＆ 威力提升{{value}}", "1301570": "依能力升幅 威力提升", "1301580": "天氣正常時 威力提升{{value}}", "1301590": "寶可夢招式 計量槽消耗 減少{{value}}", "1301600": "結凍頭時 效果絕佳時 威力提升{{value}}", "1301610": "精神場地時 威力提升{{value}}", "1301620": "龍之領域時 威力提升{{value}}", "1301630": "天氣變化時 招式及拍招↑{{value}}", "1301640": "招式及拍招 效果絕佳時 威力↑{{value}}", "1301650": "對手 禁止替換時 招式及拍招↑{{value}}", "1301670": "依對手 特攻特防 降幅威力↑", "1301680": "惡顏領域時 威力提升{{value}}", "1301690": "妖怪領域時 威力提升{{value}}", "1301700": "對手混亂時 招式及拍招↑{{value}}", "1301710": "招式及拍招 及極巨招式 效果絕佳時 威力↑{{value}}", "1301720": "超能力屬性 威力提升{{value}}", "1301730": "對手非 能力上昇時 威力提升{{value}}", "1301740": "對手 速度下降時 威力提升{{value}}", "1301750": "對手 命中率下降時 威力提升{{value}}", "1301760": "大地領域時 威力提升{{value}}", "1301770": "鋼鐵領域時 威力提升{{value}}", "1301780": "對手 岩石傷害場時 威力提升{{value}}", "1301790": "反衝招式 威力提升{{value}}", "1301800": "妖精領域時 威力提升{{value}}", "1301810": "玉蟲領域時 威力提升{{value}}", "1301820": "對手麻痺時 招式及拍招↑{{value}}", "1301830": "攻擊提升時 威力提升{{value}}", "1301840": "特攻提升時 威力提升{{value}}", "1301850": "青草場地時 威力提升{{value}}", "1301860": "對手灼傷 寶可夢招式 及拍組招式↑{{value}}", "1301870": "藍天領域時 威力提升{{value}}", "1301880": "HP減少時 威力提升{{value}}", "1301890": "電氣場地時 威力提升G{{value}}", "1301900": "精神場地時 威力提升G{{value}}", "1301910": "對手束縛時 寶可夢招式 拍招↑{{value}}", "1301940": "速度提升時 威力提升{{value}}", "1301950": "防禦提升時 威力提升{{value}}", "1301960": "特防提升時 威力提升{{value}}", "1301970": "對手束縛時 威力提升G{{value}}", "1301980": "冰雹時 招式及拍招↑{{value}}", "1301990": "對手 惡傷害場地時 威力提升{{value}}", "1302010": "減輕 物理傷害{{value}}", "1302020": "危機時減輕 物理傷害{{value}}", "1302030": "下雨時 攻擊招式 威力↓{{value}}", "1302040": "減輕 反衝傷害{{value}}", "1302050": "減輕 特殊傷害{{value}}", "1302060": "電氣場地時 攻擊招式 威力↓{{value}}", "1302070": "無傷時 攻擊招式 威力↓{{value}}", "1302080": "無傷時 招式及拍招 傷害↓{{value}}", "1302090": "危機時減輕 特殊傷害{{value}}", "1302100": "精神場地時 攻擊招式 威力↓{{value}}", "1302110": "藍天領域時 攻擊招式 威力↓{{value}}", "1302120": "沙暴時 攻擊招式 威力↓{{value}}", "1302130": "晴天時 攻擊招式 威力↓{{value}}", "1302140": "青草場地時 攻擊招式 威力↓{{value}}", "1302150": "等待中寶可夢 招式及拍招 傷害↓{{value}}", "1302160": "鋼鐵領域時 攻擊招式 威力↓{{value}}", "1302170": "拳頭領域 招式威力↓{{value}}", "1302180": "妖精領域時 減輕特殊傷害 G{{value}}", "1302190": "青草場地時 減輕物理傷害 G{{value}}", "1302200": "冰雹時 招式威力↓{{value}}", "1302210": "惡顏領域時 攻擊招式威力↓{{value}}", "1302220": "玉蟲領域時 攻擊招式 威力↓G{{value}}", "1302230": "龍之領域時 攻擊招式 威力↓{{value}}", "1302240": "鬥陣時 攻擊招式 威力↓{{value}}", "1302250": "沙暴時減輕 特殊傷害G{{value}}", "1302260": "妖精領域時 攻擊招式 威力↓G{{value}}", "1302270": "大地領域 攻擊招式 威力↓{{value}}", "1302280": "冰雹時 減輕 物理傷害G{{value}}", "1302290": "岩石領域時 減輕 物理傷害G{{value}}", "1302300": "岩石領域時 減輕 特殊傷害G{{value}}", "1302310": "對手惡傷害 場地時 招式威力↓G{{value}}", "1302320": "對手抵抗↓時 攻擊招式 威力↓G{{value}}", "1302330": "冰柱領域時 減輕特殊 傷害G{{value}}", "1302340": "晴天時 特殊傷害↓G{{value}}", "1302350": "對手中毒時 寶可夢/ 拍組招式↓G{{value}}", "1302360": "被攻擊 效果絕佳時 寶可夢/拍組招式↓G{{value}}", "1302370": "物理傷害↓G{{value}}", "1302380": "我方為場地 效果對象時 攻擊招式↓G{{value}}", "1302390": "青草場地時 攻擊招式↓G{{value}}", "1302400": "場地招式 計量槽加速時 招式/拍招↓G{{value}}", "1302410": "被攻擊 效果絕佳時 招式/拍招↓{{value}}", "1302420": "EX晴天時寶可夢/拍組/拍組極巨化招式水屬性傷害↓{{value}}", "1302430": "EX下雨時寶可夢/拍組/拍組極巨化招式火屬性傷害↓{{value}}", "1302440": "場地招式 計量槽加速時 攻擊招式↓{{value}}", "1302450": "晴天時 攻擊招式↓G{{value}}", "1303020": "連續招式 次數最大化", "1303040": "連續招式次數 3次以上化", "1303050": "必中化&寶可夢招式及拍組招式擊中要害化", "1303060": "破壞光線 必中化", "1303070": "必中化& 反衝傷害無效", "1305090": "超能力 屬性替換", "1306020": "招式後 招式次數 回復{{value}}", "1306030": "攻擊時 快攻次數 回復{{value}}", "1306040": "出招後 招式次數 回復{{value}}", "1306050": "擊中要害時 招式次數 回復{{value}}", "1306060": "攻擊灼傷對手 快攻次數 回復{{value}}", "1306070": "招式及拍招後 招式次數 回復{{value}}", "1306080": "招式後 招式次數 回復{{value}}", "1306100": "攻擊異常對手 次數回復{{value}}", "1306110": "首次拍招後 同步招式 回復{{value}}", "1306130": "HP減半時 招式次數回復 至多一次{{value}}", "1306140": "拍招後樹果 次數回復{{value}}", "1306150": "隊伍拍招後 同步招式 次數回復{{value}}", "1306160": "同步招式後 訓練家招式 次數回復{{value}}", "1306170": "首次拍招後 樹果次數 回復{{value}}", "1306180": "首次拍招後 變化招式 次數回復{{value}}", "1306190": "首次使出 電氣場地時 同步招式 次數回復{{value}}", "1306200": "攻擊時 變化招式次數 回復至多一次{{value}}", "1306210": "首次樹果 次數為0時 樹果次數回復{{value}}", "1306220": "攻擊時樹果 次數回復{{value}}", "1306230": "拍招後 同步招式 次數回復{{value}}", "1306240": "禍不單行後 同步招式次數 回復32次", "1306250": "拍組招式後 同步招式次數 回復50次{{value}}", "1306260": "攻擊時 同步招式次數 回復32次{{value}}", "1306270": "使出 合眾的分析 時同步次數 回復{{value}}", "1306280": "被攻擊時 樹果次數 回復{{value}}", "1306290": "寶可夢首次 使出變化招式 同步招式次數 回復{{value}}", "1306300": "首次關都的分析次數為0時招式次數回復{{value}}", "1306330": "首次迷你傷藥G次數為0時招式次數回復{{value}}", "1307010": "反衝傷害 無效9", "1307020": "反衝傷害 無效{{value}}", "1307030": "首次HP10%時持久", "1308010": "劇毒領域時 威力提升{{value}}", "1308020": "合眾鬥陣 (物理)時 威力↑{{value}}", "1308030": "對手麻痺時 威力提升G{{value}}", "1308040": "天氣場地領域 變化時威力 提升G{{value}}", "1308050": "岩石領域時 威力提升{{value}}", "1308060": "非效果絕佳時 威力提升{{value}}", "1308070": "冰雹時 威力提升G{{value}}", "1308080": "沙暴時 招式及拍招↑{{value}}", "1308090": "帕希歐 鬥陣(防禦)時 招式及拍招↑G{{value}}", "1308100": "晴天時 威力提升G{{value}}", "1308110": "我方速度↑時 威力↑{{value}}", "1308120": "對手惡傷害 場地時 威力提升G{{value}}", "1308130": "防禦提升時 招式及拍招↑{{value}}", "1308140": "對手中毒時 威力提升G{{value}}", "1308150": "對手妨害時 威力↑G{{value}}", "1308160": "天氣變化時 威力提升G{{value}}", "1308170": "對手能力 非提升時 威力提升G{{value}}", "1308180": "帕底亞 鬥陣(防禦)時 威力↑G{{value}}", "1308190": "對手異常時 威力提升G{{value}}", "1308200": "合眾 鬥陣(防禦)時 威力↑G{{value}}", "1308210": "對手 毒傷害場地時 威力↑G{{value}}", "1308220": "對手睡眠時 威力↑G{{value}}", "1308230": "對手混亂時 威力↑G{{value}}", "1308240": "對手灼傷時 威力↑G{{value}}", "1308250": "妖精領域時 威力↑G{{value}}", "1308260": "沙暴時 威力↑G{{value}}", "1308270": "對手速度↓時 招式/拍招/ 極巨招式↑G{{value}}", "1308280": "晴天時 寶可夢招式 及拍招↑G{{value}}", "1308300": "對手能力↓時 威力↑{{value}}", "1308310": "晴天時地面屬性寶可夢招式及拍組招式↑G{{value}}", "1308320": "冰柱領域時 威力↑{{value}}", "1308330": "對手異常時 禍不單行 威力2倍", "1308350": "對手抵抗↓時 寶可夢招式 及拍招↑{{value}}", "1308360": "我方 擊中要害時 威力↑{{value}}", "1308370": "龍之領域時 威力↑G{{value}}", "1308380": "破壞光線 威力↑{{value}}", "1308390": "HP一半以上 拍組招式↑{{value}}", "1308400": "拳頭領域時 威力↑G{{value}}", "1308410": "近身戰 威力↑{{value}}", "1308420": "合眾鬥陣 (特殊)時 威力↑G{{value}}", "1308430": "龍之領域時 寶可夢招式 及拍招↑{{value}}", "1308440": "晴天時十萬馬力威力2倍", "1308450": "對手 岩石傷害場地 時威力↑G{{value}}", "1308460": "冰凍光束威力2倍", "1308470": "劇毒領域時威力↑G{{value}}", "1308490": "城都鬥陣(防禦)時威力↑G{{value}}", "1308500": "依能力升幅威力↑G", "1308510": "岩石領域時寶可夢/拍組招式↑{{value}}", "1308520": "大地領域時寶可夢/拍組招式↑{{value}}", "1308540": "草屬性威力↑G{{value}}", "1308550": "龍屬性威力↑G{{value}}", "1308560": "淨空領域時威力↑G{{value}}", "1401020": "出招後 對睡眠對手 追加傷害", "1401030": "對手中 寶可夢招式後 追加幽靈屬性 特殊傷害", "1401040": "使出 2次招式時 破滅之願", "1501010": "首次上場時 計數加速{{value}}", "1501020": "招式 擊中要害時 計數加速{{value}}", "1501030": "首次拍招後 計數加速{{value}}", "1501040": "危機時 計數加速 至多一次G{{value}}", "1501050": "上場時 計數加速 至多一次{{value}}", "1501060": "招式後 計數加速{{value}}", "1501070": "被攻擊時 計數加速{{value}}", "1501080": "危機時 計數加速 至多一次{{value}}", "1501090": "對手失敗時 計數加速{{value}}", "1501100": "防禦成功時 計數加速{{value}}", "1501110": "攻擊 禁止替換對手 計數加速{{value}}", "1501120": "寶可夢出招後 計數加速{{value}}", "1501130": "效果絕佳時 計數加速{{value}}", "1501140": "擊中要害時 計數加速{{value}}", "1501150": "晴天時招式後 計數加速{{value}}", "1501160": "下雨時招式後 計數加速{{value}}", "1501170": "極巨招式後 計數加速{{value}}", "1501180": "反擊時 計數加速{{value}}", "1501190": "HP減半時 計數加速 至多一次{{value}}", "1501200": "首次使出 變化招式時 計數加速{{value}}", "1501210": "首次危機時 計數加速{{value}}", "1501220": "等待攻擊時 計數加速{{value}}", "1501230": "等待攻擊時 計數加速2次{{value}}", "1501240": "首次招式後 計數加速{{value}}", "1501250": "防禦成功時 計數加速 至多一次{{value}}", "1501290": "HP60%時 計數加速 至多一次{{value}}", "1501300": "快攻招式後 計數加速 2次{{value}}", "1501310": "快攻招式後 計數加速{{value}}", "1501320": "訓練家 出招後 計數加速{{value}}", "1501330": "首次樹果 次數為0時 計數加速{{value}}", "1501340": "寶可夢使出 變化招式時 計數加速{{value}}", "1501350": "使出 龍之祈願時 計數加速{{value}}", "1501360": "首次訓練家 招式後 計數加速{{value}}", "1501370": "使出惡顏祈願時 計數加速{{value}}", "1501380": "使出藍天祈願時 計數加速{{value}}", "1501390": "首次使出 電氣場地時 計數加速{{value}}", "1501400": "自身首次引發 神奧鬥陣(特殊)時 計數加速{{value}}", "1501410": "使出 大地祈願時 計數加速{{value}}", "1501420": "首次變化招式 次數為0時 計數加速{{value}}", "1501430": "使出鋼鐵祈願 時計數加速{{value}}", "1501450": "首次上場時&首次拍組招式後計數加速{{value}}", "1501460": "首次物理增強 6以上時 計數加速{{value}}", "1501470": "使出拳頭祈願 時計數加速{{value}}", "1501480": "拍組太晶化時 計數加速{{value}}", "1501490": "使出 合眾的熱情時 計數加速{{value}}", "1501510": "自身引發關都鬥陣(特殊)時計數加速{{value}}", "1501530": "首次上場時計數加速&特攻1↑", "1501540": "首次上場時計數加速2&擊中要害率1↑", "1501550": "首次上場時計數加速3&變成淨空領域", "1501570": "首次妖怪祈願次數為0時計數加速{{value}}", "1501580": "首次關都的分析次數為0時計數加速{{value}}", "1502010": "拍招後 計數上限減{{value}}", "1601020": "拍招後 變成晴天", "1601030": "拍招 效果絕佳時 威力↑{{value}}", "1601040": "晴天時拍招 威力提升{{value}}", "1601050": "依速度升幅 拍招↑", "1601060": "依攻擊升幅 拍招↑", "1601070": "依閃避升幅 拍招↑", "1601080": "拍招 擊中要害時 威力↑{{value}}", "1601090": "冰雹時拍招 威力提升{{value}}", "1601100": "對手麻痺時 拍招↑{{value}}", "1601110": "對手混亂時 拍招↑{{value}}", "1601120": "下雨時 拍招提升{{value}}", "1601130": "依對手 速度降幅 拍招↑", "1601140": "拍招後 變成冰雹", "1601150": "依對手 攻擊降幅 拍招↑", "1601160": "依對手 特防降幅 拍招↑", "1601170": "對手睡眠時 拍招↑{{value}}", "1601180": "沙暴時 拍招提升{{value}}", "1601190": "拍招後 變成沙暴", "1601200": "對手冰凍時 拍招↑{{value}}", "1601210": "對手畏縮時 拍招↑{{value}}", "1601220": "依對手 防禦降幅 拍招↑", "1601230": "電氣場地時 拍招提升{{value}}", "1601240": "依能力升幅 拍招↑", "1601250": "依對手 命中率降幅 拍招↑", "1601260": "危機時 拍招提升{{value}}", "1601270": "首次拍招後 拍招屬性變化", "1601280": "依對手 特攻降幅 拍招威力↑", "1601290": "對手灼傷時 拍招↑{{value}}", "1601300": "對手 禁止替換時 拍招威力↑{{value}}", "1601310": "天氣變化時 拍招威力↑{{value}}", "1601320": "對手攻擊下降時 拍招提升{{value}}", "1601330": "特攻提升時 拍招威力↑{{value}}", "1601340": "天氣正常時 拍招威力↑{{value}}", "1601350": "對手中毒時 拍招↑{{value}}", "1601360": "依對手 閃避率降幅 拍招威力↑", "1601370": "拍招威力隨 計量槽提升", "1601380": "依防禦升幅 拍招↑", "1601390": "依特防升幅 拍招↑", "1601400": "對手麻痺時 極巨招式↑{{value}}", "1601410": "龍之領域時 拍招威力↑{{value}}", "1601420": "依對手 能力降幅 拍招威力↑", "1601430": "鋼鐵領域時 拍招威力↑{{value}}", "1601450": "對手妨害時 拍招提升{{value}}", "1601460": "極巨招式 效果絕佳時 威力提升{{value}}", "1601470": "命中提升時 拍招威力↑{{value}}", "1601480": "攻擊提升時 拍招威力↑{{value}}", "1601490": "防禦提升時 拍招威力↑{{value}}", "1601500": "對手束縛時 拍招威力↑{{value}}", "1601510": "拍組招式 擊中要害化", "1601520": "對手 命中下降時 拍招威力↑{{value}}", "1601540": "攻擊提升時 極巨招式 威力提升{{value}}", "1601550": "對手 特攻下降時 拍招威力↑{{value}}", "1601560": "對手異常時 拍招威力↑{{value}}", "1601570": "場地變化時 拍招威力↑{{value}}", "1601580": "速度提升時 拍招威力提升{{value}}", "1601590": "特防提升時 拍招威力提升{{value}}", "1601600": "HP減少時 拍組招式 威力提升{{value}}", "1601610": "閃避率提升 拍組招式 威力提升{{value}}", "1601620": "對手速度下降 拍組招式 威力提升{{value}}", "1601630": "對手能力 非提升時 拍招↑{{value}}", "1601640": "妖精領域時 拍招威力 提升{{value}}", "1601650": "對手 鋼傷害場 拍招提升{{value}}", "1601660": "拍組招式 威力提升G{{value}}", "1601670": "對手抵抗↓時 拍組招式↑{{value}}", "1601680": "惡顏領域時 拍招威力提升{{value}}", "1601690": "青草場地時 拍招威力提升{{value}}", "1601700": "劇毒領域時 拍招威力提升{{value}}", "1601710": "合眾鬥陣 (物理)時 拍招威力↑{{value}}", "1601720": "異常狀態時 拍招威力 提升{{value}}", "1601730": "鬥陣時 拍招↑G{{value}}", "1601740": "城都鬥陣(物理) 時拍招 威力↑{{value}}", "1601750": "岩石領域時 拍招威力 提升{{value}}", "1601760": "合眾鬥陣 (防禦)時 拍招威力↑{{value}}", "1601770": "對手抵抗↓時 威力提升G{{value}}", "1601780": "對手中毒時 極巨招式 提升{{value}}", "1601790": "帕底亞鬥陣 (物理)時 拍招威力↑{{value}}", "1601800": "阿羅拉鬥陣 (特殊)時 拍招威力↑{{value}}", "1601810": "對手特防↓時 拍組招式↑{{value}}", "1601820": "藍天領域時 拍組招式 威力提升{{value}}", "1601830": "對手束縛時 拍組招式↑G{{value}}", "1601840": "淨空領域時 拍組招式↑{{value}}", "1601850": "冰雹時 拍招威力↑G{{value}}", "1601860": "帕底亞 鬥陣(防禦}時 拍組招式↑G{{value}}", "1601870": "樹果 次數為0時 拍組招式↑{{value}}", "1601880": "合眾 鬥陣(防禦)時 拍組招式↑G{{value}}", "1601890": "精神場地時 拍招威力↑{{value}}", "1601900": "特攻↑時 極巨招式 威力↑{{value}}", "1601910": "對手 禁止替換時 拍組招式↑G{{value}}", "1601920": "對手 禁止替換時 威力↑G{{value}}", "1601930": "大地領域時 拍組招式↑{{value}}", "1601940": "對手 毒傷害場地時 拍組招式↑G{{value}}", "1601950": "對手能力↓時 拍組招式↑{{value}}", "1601960": "冰柱領域時 拍組招式↑{{value}}", "1601970": "神奧鬥陣 (特殊)時 拍組招式↑G{{value}}", "1601980": "淨空領域時 拍組招式↑G{{value}}", "1601990": "下雨時拍組招式威力↑G{{value}}", "1602010": "首次拍招後 招式次數 回復{{value}}", "1602020": "拍招後 快攻次數 回復{{value}}", "1602030": "首次拍招後 回復次數 回復{{value}}", "1602040": "拍招後 寶可夢招式 次數回復{{value}}", "1602050": "拍招後 寶可夢招式 次數回復 至多一次{{value}}", "1602060": "首次拍招後 個人技次數 回復{{value}}", "1602070": "首次拍招後 快攻 次數回復{{value}}", "1602080": "危機時 快攻次數回復 至多一次{{value}}", "1602090": "拍組招式後 訓練家招式 次數回復{{value}}", "1603010": "下雨時 極巨化招式 威力↑{{value}}", "1603020": "場地招式 計量槽加速時 拍組招式↑G{{value}}", "1603030": "場地招式 計量槽加速時 拍組招式↑{{value}}", "1603040": "玉蟲領域時 拍組招式↑G{{value}}", "1603050": "鬥陣時 拍招威力↑{{value}}", "1603060": "我方速度↑時 拍組招式↑{{value}}", "1603070": "天氣場地領域 變化時 拍招↑G{{value}}", "1603080": "拳頭領域時 拍招↑{{value}}", "1603100": "對手 岩石傷害場地 時拍招↑G{{value}}", "1603120": "拳頭領域時 拍招↑G{{value}}", "1603130": "城都鬥陣(特殊)時拍組招式↑G{{value}}", "1603140": "對手抵抗↓時拍組招式↑G{{value}}", "1603160": "惡顏領域時拍組招式↑G{{value}}", "1603180": "帕底亞鬥陣(物理)時威力↑G{{value}}", "1701100": "晴天時 異常無效", "1701110": "睡眠無效G", "1701120": "妨害無效", "1701130": "下雨時 妨害無效", "1701150": "晴天時 妨害無效", "1701160": "天氣正常時 妨害無效", "1701180": "精神場地時 異常無效", "1701190": "青草場地時 異常無效", "1701200": "電氣場地時 妨害無效", "1701210": "電氣場地時 異常無效", "1701220": "畏縮無效G", "1701230": "晴天時 異常及妨害 無效G", "1701240": "中毒無效G", "1701250": "下雨時 異常無效", "1701260": "惡顏領域時 妨害無效", "1701270": "岩石領域時 異常無效", "1701280": "青草場地時 妨害狀態無效", "1701290": "妖精領域時 異常無效G", "1701300": "冰雹時 異常無效", "1701310": "被攻擊時無視 攻擊特攻提升", "1701320": "精神場地時 異常狀態 妨害無效G", "1701330": "被攻擊時無視 天氣場地領域 威力提昇G", "1701340": "龍之領域時 妨害無效", "1701350": "異常狀態 妨害無效", "1701360": "冰柱領域時 異常無效G", "1701370": "鋼鐵領域時 異常狀態妨害 無效G", "1701380": "大地領域 異常狀態妨害 無效G", "1701390": "冰雹無效G", "1701400": "鬥陣時 異常無效", "1701410": "沙暴無效G", "1701420": "青草場地時 異常狀態 妨害無效G", "1701430": "睡眠畏縮無效G", "1701440": "冰雹時 妨害無效", "1701450": "劇毒領域時 異常無效G", "1701460": "對手 毒傷害場地時 異常/妨害無效G", "1701470": "鬥陣時異常狀態妨害無效G", "1701480": "場地招式 計量槽加速時 異常狀態 妨害無效G", "1701490": "玉蟲領域時 異常無效", "1701500": "灼傷無效G", "1701510": "妖精領域時異常狀態妨害無效G", "1703010": "拍招後解除 惡化狀態", "1703020": "寶可夢 出招解除 異常狀態G{{value}}", "1703040": "瀕死時 我方解除 異常狀態", "1703060": "拍招後 解除異常狀態", "1703070": "招式後解除 異常狀態G", "1703080": "出招後 異常解除{{value}}", "1703090": "中招後解除 異常狀態{{value}}", "1703100": "拍招後解除 異常狀態G{{value}}", "1703110": "極巨招式後 解除異常G{{value}}", "1703120": "中招後解除 妨害狀態{{value}}", "1703130": "出招後解除 異常狀態{{value}}", "1703150": "招式後解除 妨害狀態{{value}}", "1703160": "拍招後解除 不利變化G{{value}}", "1703170": "訓練家 出招後解除 異常狀態G{{value}}", "1704010": "異常狀態妨害 回復後無效化", "1704020": "無傷上場時 挺住", "1704030": "冰雹時HP回復{{value}}", "1704050": "晴天時HP回復{{value}}", "1704070": "對手中招後 賦予混亂{{value}}", "1704080": "危機時招式後 萬眾矚目", "1704090": "沙暴時HP回復{{value}}", "1704100": "對手中招後 賦予中毒{{value}}", "1704110": "變化招賦予 異常狀態G{{value}}", "1704120": "上場時 下次必中要害", "1704130": "攻擊時 賦予畏縮{{value}}", "1704140": "拍招後 下次必中要害", "1704150": "下雨時HP回復{{value}}", "1704160": "無傷上場時 附帶回復", "1704170": "對手中拍招後 賦予睡眠", "1704180": "招式後 萬眾矚目", "1704190": "對手中招後 賦予冰凍{{value}}", "1704200": "上場時 下次必中", "1704210": "首次拍招後 挺住G", "1704220": "對手中招後 賦予劇毒{{value}}", "1704230": "對手中招後 賦予睡眠{{value}}", "1704240": "招式 擊中要害時 賦予混亂{{value}}", "1704250": "招式後下次 必中要害{{value}}", "1704260": "招式後 附帶回復{{value}}", "1704270": "首次上場時 下次必要害G", "1704280": "電氣場地時 HP回復{{value}}", "1704290": "精神場地時 HP回復{{value}}", "1704300": "招式後 附帶回復G", "1704310": "上場時下次 計量槽消耗0", "1704320": "拍招後下次 計量槽消耗0", "1704330": "拍招後 附帶回復G", "1704340": "首次拍招後 挺住", "1704350": "招式後下次 效果絕佳 威力提升{{value}}", "1704360": "禁止替換時 下次不消耗 計量槽{{value}}", "1704370": "上場時下次 效果絕佳 威力提升", "1704380": "禁止替換時 HP回復{{value}}", "1704390": "擊中要害時 下次不消耗 計量槽{{value}}", "1704400": "中毒灼傷 麻痺同步", "1704410": "出招後 下次不消耗 計量槽{{value}}", "1704420": "變化招式時 下次效果絕佳 威力提升{{value}}", "1704430": "晴天時出招 下次效果絕佳 威力提升{{value}}", "1704440": "下雨時出招 下次效果絕佳 威力提升{{value}}", "1704450": "極巨招式後 下次傷害防禦", "1704460": "被攻擊時 下次不消耗 計量槽{{value}}", "1704470": "極巨招式後 附帶回復", "1704480": "攻擊時 下次不消耗 計量槽{{value}}", "1704490": "首次危機時 下次效果絕佳 威力提升", "1704500": "首次HP減半時 下次傷害防禦", "1704510": "首次拍招後 下次效果絕佳 威力提升", "1704520": "失敗時 物理招式 增強{{value}}", "1704530": "極巨招式後 下次效果絕佳 威力↑", "1704540": "拍招後賦予 禁止替換", "1704550": "拍招後 附帶回復", "1704560": "個人技後賦予 物理增強(1){{value}}", "1704570": "攻擊時賦予 異常狀態G{{value}}", "1704580": "打倒對手時 下次效果絕佳 威力提升", "1704600": "效果絕佳時 下次不消耗 計量槽{{value}}", "1704610": "暗影潛襲後 下次效果絕佳 威力提升", "1704620": "個人技後賦予 特殊增強(1) G{{value}}", "1704630": "個人技後下次 不耗計量槽{{value}}", "1704640": "效果絕佳時 下次效果絕佳 威力提升{{value}}", "1704650": "招式後下次 不耗計量槽{{value}}", "1704660": "拍招後賦予 物理增強(1){{value}}", "1704670": "拍招後 賦予睡眠G", "1704680": "HP減半時 變化招時賦予 特殊增強(1)G{{value}}", "1704690": "首次拍招後 下次傷害防禦", "1704700": "妖怪領域時 HP回復{{value}}", "1704710": "個人技後 下次效果絕佳 威力提升{{value}}", "1704720": "首次拍招後 下次不消耗 計量槽G", "1704730": "首次上場時 賦予 物/特增強{{value}}", "1704740": "攻擊時 賦予混亂{{value}}", "1704750": "變化招式時 賦予物/特 增強(1)G{{value}}", "1704760": "精神場時攻擊 下次不消耗 計量槽{{value}}", "1704770": "HP減半時 下次不耗氣 至多一次{{value}}", "1704780": "極巨招式後 賦予 特殊增強(1)G{{value}}", "1704790": "變化招式時 賦予 物理增強(1){{value}}", "1704800": "被攻擊時賦予 對手麻痺{{value}}", "1704810": "攻擊時賦予 妨害狀態{{value}}", "1704820": "要害時下次 必中要害{{value}}", "1704830": "玉蟲領域時 HP回復{{value}}", "1704840": "回復招賦予 至多一次 物理特殊 增強(1)G{{value}}", "1704850": "拍招後下次 效果絕佳 威力提升{{value}}", "1704860": "拍招後賦予 特殊增強(1){{value}}", "1704870": "招式後賦予 特殊增強(1){{value}}", "1704880": "中招後賦予 物理增強(1){{value}}", "1704890": "青草場地時 HP回復{{value}}", "1704900": "拍招後賦予 至多一次 特殊增強(1)G{{value}}", "1704910": "使出次數限定 招式時賦予 特殊增強(1)G{{value}}", "1704920": "招式後賦予 物理特殊 增強(1){{value}}", "1704930": "上場時賦予 特殊增強G{{value}}", "1704940": "首次 危機時賦予 特殊增強{{value}}", "1704950": "上場時下次 傷害防禦", "1704960": "被攻擊時 對手灼傷{{value}}", "1704970": "攻擊時 賦予麻痺{{value}}", "1704980": "招式後賦予 特殊增強(1)G{{value}}", "1704990": "首次上場時 附帶回復", "1705010": "對手灼傷 傷害提升{{value}}", "1705020": "對手束縛 傷害增加{{value}}", "1705030": "對手中毒 傷害增加{{value}}", "1705040": "混亂的對手 攻擊自身 機率提升{{value}}", "1705050": "異常狀態 妨害無效 時間延長{{value}}", "1705060": "麻痺中對手 失敗率提升{{value}}", "1706010": "電屬性攻擊 賦予麻痺{{value}}", "1706020": "冰屬性攻擊 賦予冰凍{{value}}", "1706030": "招式後賦予 物理增強(2){{value}}", "1706050": "個人技後 賦予物理特殊 增強(1){{value}}", "1706060": "等待時賦予 物理增強(1){{value}}", "1706080": "鋼鐵領域時 HP回復{{value}}", "1706090": "惡顏領域時 HP回復{{value}}", "1706100": "拍招後賦予 至多一次 物理增強(1)G{{value}}", "1706110": "首次上場時 挺住G", "1706120": "攻擊時 賦予灼傷{{value}}", "1706130": "我方 中招後賦予 特殊增強(1){{value}}", "1706140": "攻擊 中毒中對手時 下次不消耗 計量槽{{value}}", "1706150": "寶可夢 變化招式時 物/特增強(1){{value}}", "1706160": "岩石領域時 HP回復{{value}}", "1706170": "攻擊時 賦予束縛{{value}}", "1706180": "防禦成功時 賦予至多一次 物理增強(1)G{{value}}", "1706190": "能力下降時 下次不消耗 計量槽{{value}}", "1706200": "被攻擊時 賦予對手 中毒麻痺睡眠{{value}}", "1706210": "攻擊灼傷對手 賦予特殊增強(1){{value}}", "1706220": "對手失敗時 賦予物/特增強(1){{value}}", "1706230": "拍組招式後 賦予劇毒G{{value}}", "1706240": "攻擊中毒對手 下次效果絕佳 威力提升{{value}}", "1706250": "拍招/極巨招式 賦予物理增強(1)G{{value}}", "1706260": "首次攻擊 地面抵抗↓", "1706270": "僅限一次 再次挺住", "1706280": "首次拍招後 下次效果絕佳 威力↑G", "1706290": "首次攻擊時 鋼屬性抵抗↓", "1706300": "上場時 附帶回復G", "1706310": "首次攻擊 弱點抵抗↓", "1706320": "個人技後 一次異常妨害 無效化G{{value}}", "1706330": "首次個人技 後賦予對手 惡抵抗↓G", "1706340": "攻擊 非提升對手 下次計量槽0{{value}}", "1706350": "烏拉烏拉的 海風", "1706360": "美樂美樂的 海風", "1706370": "阿卡拉的 海風", "1706390": "攻擊 非提升對手 賦予畏縮{{value}}", "1706400": "攻擊麻痺對手 下次不消耗 計量槽{{value}}", "1706410": "對手首次中 變化招式時 龍屬性抵抗↓", "1706420": "攻擊 無法閃避對手 賦予畏縮{{value}}", "1706430": "招式後賦予 物理增強(1)G{{value}}", "1706440": "精神場地時 攻擊時賦予 物理增強(1){{value}}", "1706450": "對手中 極巨招式後 毒屬性抵抗↓G{{value}}", "1706460": "賦予對手 中毒時 賦予劇毒", "1706470": "招式後賦予 物理增強(1){{value}}", "1706480": "首次HP60% 下次傷害防禦", "1706490": "招式後賦予 物理增強(3){{value}}", "1706500": "使出變化招式 賦予 物理增強(2){{value}}", "1706510": "對手鋼傷害場 攻擊時下次 不消耗計量槽{{value}}", "1706520": "氣魄提升時 攻擊時賦予 物理增強(3){{value}}", "1706530": "極巨招式後 下次 不消耗計量槽", "1706540": "使出 變化招式時 賦予 物理增強(1)G{{value}}", "1706550": "快攻招式後 賦予 物理增強(1){{value}}", "1706560": "攻擊灼傷對手 下次效果絕佳 威力提升{{value}}", "1706570": "拍招後賦予 物理增強(2){{value}}", "1706580": "對手失敗時 賦予 物理增強(2){{value}}", "1706590": "被攻擊時 下次效果絕佳 威力提升{{value}}", "1706600": "拍招後下次 計量槽消耗0G{{value}} ", "1706610": "攻擊時 賦予變化G{{value}}", "1706620": "被攻擊時 賦予對手中毒{{value}}", "1706630": "攻擊冰凍對手 賦予 特殊增強(1){{value}}", "1706640": "招式後賦予 特殊增強(2){{value}}", "1706650": "極巨招式後 下次不消耗 計量槽G", "1706660": "攻擊時 賦予1種 妨害狀態{{value}}", "1706670": "首次攻擊時 妖精抵抗↓", "1706680": "拍招後賦予 至多一次 特殊增強 (2)G{{value}}", "1706690": "攻擊禁止替換 對手時下次 計量槽消耗0{{value}}", "1706700": "攻擊禁止替換 對手時下次 效果絕佳威力提升{{value}}", "1706710": "對手 惡傷害場地 攻擊時下次 計量槽消耗0{{value}}", "1706720": "攻擊麻痺對手 賦予 特殊增強(1){{value}}", "1706730": "拍組招式後 賦予 物理增強(2)G{{value}}", "1706740": "對手首次中 拍組招式後 妖精抵抗↓", "1706760": "攻擊中毒對手 賦予 特殊增強(1){{value}}", "1706770": "我方引發 天氣/場地/領域 賦予 特殊增強(1){{value}}", "1706780": "攻擊 異常對手 下次不消耗 計量槽{{value}}", "1706790": "拍招及 極巨招式後 賦予 特殊增強(2){{value}}", "1706800": "拍組招式後 氣魄↑{{value}}", "1706810": "個人技後 下次計量槽 消耗0G{{value}}", "1706820": "打倒對手時 賦予特殊增強 (2){{value}}", "1706830": "能力下降時 賦予物理 增強(1){{value}}", "1706840": "訓練家招式後 僅限一次賦予 物理/特殊增強(1)G{{value}}", "1706850": "首次上場時 草屬性抵抗↑{{value}}", "1706860": "對手中拍招 後賦予麻痺", "1706870": "個人技後賦予 特殊增強 (1){{value}}", "1706880": "攻擊時下次 不消耗計量槽 或賦予 特殊增強(1)", "1706890": "對手中拍組 極巨化招式後 同屬性 抵抗↓G{{value}}", "1706900": "攻擊時賦予 物理增強(1){{value}}", "1706910": "首次拍招後 賦予 特殊增強G{{value}}", "1706920": "我方引發天氣 /場地/領域 時 賦予物理 增強(1){{value}}", "1706930": "灼傷時攻擊時 賦予物理 增強(1){{value}}", "1706940": "攻擊妨害對手 下次效果絕佳 威力提升{{value}}", "1706950": "攻擊時賦予 特殊增強(1){{value}}", "1706960": "命中時賦予 物理增強(1){{value}}", "1706970": "沙暴時攻擊時 賦予物理 增強(1){{value}}", "1706980": "上場時物理 招式增強{{value}}", "1706990": "拍組極巨化 招式後物理/特殊 增強G{{value}}", "1707010": "我方場地效果 對象時攻擊時 下次計量槽 消耗0{{value}}", "1707020": "攻擊抵抗↓ 對手時下次 計量槽消耗0{{value}}", "1707030": "命中時 賦予畏縮{{value}}", "1707040": "我方中招後 賦予 物理/特殊 增強(1){{value}}", "1707050": "拍招後賦予 物理/特殊 增強(2){{value}}", "1707060": "自身引發 全體/我方場地 下次不消耗計量槽{{value}}", "1707070": "極巨招式後 特殊增強{{value}}", "1707080": "回復招式後 附帶回復G", "1707090": "拍招後賦予 物理/特殊 增強(1){{value}}", "1707100": "物理極巨 招式後 物理增強{{value}}", "1707110": "特殊極巨 招式後 特殊增強{{value}}", "1707120": "鬥陣時攻擊 賦予物理 增強(1){{value}}", "1707130": "首次上場時 物理增強G{{value}}", "1707140": "攻擊能力 非提升對手時 賦予物理 增強(1){{value}}", "1707150": "毒屬性攻擊 賦予中毒{{value}}", "1707160": "自身引發 全體/我方場地 賦予特殊增強(1){{value}}", "1707170": "變化招式時 賦予 特殊增強(1){{value}}", "1707180": "首次上場時 物理增強{{value}}", "1707190": "首次上場時 特殊增強{{value}}", "1707200": "拍招後 賦予 特殊增強(2){{value}}", "1707220": "首次上場時 賦予睡眠G", "1707230": "寶可夢 出招後賦予 物理增強(1){{value}}", "1707240": "首次拍招後 物理增強G{{value}}", "1707250": "等待時賦予 特殊增強(2){{value}}", "1707260": "我方引發 鬥陣時賦予 特殊增強(1){{value}}", "1707270": "等待時賦予 特殊增強(1){{value}}", "1707280": "我方瀕死時 物理增強{{value}}", "1707290": "對手首次中 拍組招式後 龍屬性抵抗↓{{value}}", "1707300": "攻擊時賦予 畏縮&麻痺{{value}}", "1707310": "攻擊時消耗 樹果次數& 賦予特殊增強(3){{value}}", "1707320": "鬥陣時攻擊時 下次不消耗 計量槽{{value}}", "1707330": "招式後賦予 拍組招式 增強(4){{value}}", "1707340": "能力下降時 賦予 物理增強(2){{value}}", "1707350": "招式後賦予 拍組招式 增強(3){{value}}", "1707360": "拍招後賦予 拍組招式 增強(5){{value}}", "1707370": "訓練家 出招後賦予 物理增強(1)G{{value}}", "1707380": "自身引發鬥陣時 賦予物理/ 特殊增強(1)G{{value}}", "1707390": "快攻招式後 賦予物理增強(1)G{{value}}", "1707400": "上場時 特殊增強{{value}}", "1707410": "上場時 拍招增強{{value}}", "1707420": "首次攻擊時 草屬性抵抗↓", "1707430": "首次拍招後 物理增強{{value}}", "1707440": "變化招式時 賦予物理/ 特殊增強(1)G{{value}}", "1707450": "首次樹果 次數為0時 特殊增強{{value}}", "1707460": "首次攻擊時 毒屬性抵抗↓", "1707470": "極巨招式後 物理增強{{value}}", "1707480": "訓練家出招後 賦予拍組招式 增強(1)G{{value}}", "1707490": "惡屬性威力↑G{{value}}", "1707500": "飛行屬性威力↑G{{value}}", "1707510": "寶可夢首次 出招後 特殊增強{{value}}", "1707520": "攻擊時賦予 拍組招式 增強(1){{value}}", "1707530": "對手中 極巨招式後 賦予妨害狀態G{{value}}", "1707540": "變化招式賦予 妨害狀態G{{value}}", "1707550": "對手中 極巨招式後 賦予麻痺G{{value}}", "1707560": "我方中招後 賦予拍招增強(2){{value}}", "1707570": "我方引發鬥陣時 賦予物理/ 特殊增強(1)G{{value}}", "1707580": "拍招及 極巨招式後 賦予物理增強(2){{value}}", "1707590": "極巨招式後 拍招增強G{{value}}", "1707600": "招式後下次 傷害防禦{{value}}", "1707610": "攻擊時消耗 樹果次數 ＆賦予物理增強(1)G{{value}}", "1707620": "對手失敗時 賦予物理/特殊 增強(1)G{{value}}", "1707630": "鋼鐵領域時 攻擊時下次 不消耗計量槽{{value}}", "1707640": "電屬性威力↑G{{value}}", "1707650": "命中時賦予 特殊增強(1){{value}}", "1707660": "命中時賦予 拍招增強(1){{value}}", "1707670": "自身引發 藍天領域時 賦予特殊增強(1)G{{value}}", "1707680": "訓練家出招後 賦予 物理增強(3){{value}}", "1707690": "我方引發 天氣時賦予 特殊增強(2){{value}}", "1707700": "極巨招式後 拍招增強{{value}}", "1707710": "首次上場時 下次傷害防禦", "1707720": "訓練家出招後 賦予物理/特殊 增強(1)G{{value}}", "1707730": "HP減半時 賦予至多一次 物理/特殊增強(2)G{{value}}", "1707740": "使出 精神祈禱時 賦予特殊增強(1)G{{value}}", "1707750": "被攻擊時 賦予特殊增強(1){{value}}", "1707760": "對手中 極巨招式後 同屬性抵抗↓{{value}}", "1707770": "對手火傷害場地時 攻擊時賦予 特殊增強(1){{value}}", "1707780": "攻擊時賦予 拍招增強(2){{value}}", "1707790": "對手中 極巨招式後 賦予灼傷{{value}}", "1707800": "下雨時 攻擊時下次 不消耗計量槽{{value}}", "1707810": "青草場地時 攻擊時下次 不消耗計量槽{{value}}", "1707820": "危機時下次 傷害防禦 至多一次{{value}}", "1707830": "極巨招式後 物理增強G{{value}}", "1707840": "晴天時 攻擊時下次 不消耗計量槽{{value}}", "1707850": "我方中招後 賦予拍招增強(4){{value}}", "1707860": "招式後賦予 拍招增強(1)G{{value}}", "1707870": "首次拍招後 特殊增強{{value}}", "1707880": "同步招式 次數為0時 非同步招式攻擊時 賦予特殊增強(1){{value}}", "1707890": "我方中招後 下次效果 絕佳威力↑{{value}}", "1707900": "大地領域時 攻擊時下次 不消耗計量槽{{value}}", "1707910": "招式後 賦予 特殊增強(2)G{{value}}", "1707920": "招式後 賦予 物理增強(2)G{{value}}", "1707930": "大地領域時 HP回復{{value}}", "1707940": "使出 大地祈願時 賦予物理增強(2){{value}}", "1707950": "下雨時命中時賦予拍組招式增強(1){{value}}", "1707960": "被攻擊時賦予物理增強(1)G{{value}}", "1707970": "被攻擊時賦予特殊增強(1)G{{value}}", "1707980": "岩石屬性 威力↑G{{value}}", "1707990": "冰屬性 威力↑G{{value}}", "1708010": "首次變化招式 次數為0時 物理增強{{value}}", "1708020": "自身引發晴天時 下次不消耗 計量槽{{value}}", "1708030": "電氣場地時 攻擊時賦予 特殊增強(1){{value}}", "1708040": "招式後下次 效果絕佳威力↑G{{value}}", "1708050": "訓練家招式 次數為0時 攻擊時下次 不消耗計量槽{{value}}", "1708060": "訓練家招式 次數為0時 攻擊時賦予 特殊增強(2){{value}}", "1708070": "我方攻擊 灼傷的對手時 賦予特殊增強(1){{value}}", "1708080": "首次樹果 次數為0時 物理增強G{{value}}", "1708090": "攻擊灼傷 對手時下次 不消耗計量槽{{value}}", "1708100": "拍招後賦予 特殊增強(1)G{{value}}", "1708110": "使出鋼鐵祈願 時賦予 特殊增強(2){{value}}", "1708120": "首次上場時特殊增強G{{value}}", "1708130": "被拍組招式攻擊時賦予物理增強(2){{value}}", "1708150": "被攻擊時賦予拍組招式增強(1)G{{value}}", "1708160": "下雨時攻擊時賦予特殊增強(2){{value}}", "1708170": "我方引發天氣 /場地/領域賦予 特殊增強(1)G{{value}}", "1708180": "一般屬性 威力↑G{{value}}", "1708190": "格鬥屬性 威力↑G{{value}}", "1708200": "火屬性 威力↑G{{value}}", "1708210": "首次上場時 賦予自身睡眠", "1708220": "命中時賦予 物理/特殊 增強(1){{value}}", "1708230": "首次特殊增強 6以上時賦予 特殊增強{{value}}", "1708250": "我方引發 玉蟲領域賦予 特殊增強(1){{value}}", "1708260": "拍組招式後 賦予特殊增強(2)G{{value}}", "1708270": "招式後下次 不消耗計量槽G{{value}}", "1708280": "首次 使出招式時 特殊增強G{{value}}", "1708290": "首次攻擊時 一般屬性抵抗↓", "1708300": "招式後賦予 物理/特殊增強(2){{value}}", "1708310": "首次拍招後 氣魄↑{{value}}", "1708320": "我方引發 鬥陣時賦予 物理增強(2){{value}}", "1708330": "我方引發 鬥陣時賦予 拍招增強(3){{value}}", "1708340": "我方能力↑時 賦予拍招 增強(1){{value}}", "1708350": "被拍招攻擊時 賦予物理/ 特殊增強(1)G{{value}}", "1708360": "我方攻擊 畏縮中的對手時 賦予物理/ 特殊增強(1){{value}}", "1708370": "被攻擊時 賦予對手束縛{{value}}", "1708380": "寶可夢首次 使出變化招式 下次傷害防禦", "1708390": "對手場上1隻 寶可夢時 攻擊時賦予 物理/特殊增強(1){{value}}", "1708400": "對手場上1隻 寶可夢時 攻擊時下次 計量槽消耗0{{value}}", "1708410": "首次上場時 &首次拍招後 賦予特殊增強{{value}}", "1708420": "寶可夢出招後 賦予拍招 增強(2){{value}}", "1708430": "寶可夢使出 變化招式時 賦予特殊增強 (2){{value}}", "1708440": "晴天時我方 攻擊時賦予 特殊增強 (1){{value}}", "1708450": "我方攻擊 畏縮中的對手時 賦予拍招增強(2){{value}}", "1708460": "妖精領域時 HP回復{{value}}", "1708470": "對手場上 1隻寶可夢時 攻擊時賦予 特殊增強(1){{value}}", "1708480": "我方引發 鬥陣時賦予 物理增強(1)G{{value}}", "1708490": "我方引發 鬥陣時下次 不消耗計量槽{{value}}", "1708500": "我方引發天氣 /場地/領域時 賦予物理/特殊 增強(1)G{{value}}", "1708510": "隊伍使出拍招 後賦予物理/ 特殊增強(1)G{{value}}", "1708520": "幽靈屬性 威力↑G{{value}}", "1708530": "毒屬性 威力↑G{{value}}", "1708540": "水屬性 威力↑G{{value}}", "1708550": "拍招後賦予 物理/特殊 增強(1)G{{value}}", "1708560": "首次上場時 拍招增強{{value}}", "1708570": "寶可夢首次 使出變化招式 特殊增強 G{{value}}", "1708580": "招式後下次 吸引全體招式 {{value}}", "1708590": "首次拍招後 物理/特殊 增強G{{value}}", "1708600": "拍招後賦予 物理增強 (3){{value}}", "1708610": "我方攻擊 異常對手時 賦予物理/特殊 增強(1){{value}}", "1708620": "我方攻擊 異常對手時 賦予拍招增強 (2){{value}}", "1708630": "首次上場時 幽靈屬性 抵抗↓G{{value}}", "1708640": "首次訓練家 招式後 拍招增強10", "1708650": "妖怪領域時 攻擊時賦予 妨害狀態{{value}}", "1708660": "攻擊妨害狀態 對手時下次 不消耗計量槽 {{value}}", "1708670": "攻擊妨害狀態 對手時賦予 物理/特殊 增強(1){{value}}", "1708680": "首次拍招後 幽靈屬性 抵抗↓G{{value}}", "1708690": "首次上場時 下次效果絕佳 威力↑G", "1708700": "寶可夢出招後 賦予拍招增強 (1)G{{value}}", "1708710": "極巨化招式後 物理/特殊 增強{{value}}", "1708720": "首次上場時 物理/特殊 增強G{{value}}", "1708730": "首次上場時 拍招增強G{{value}}", "1708740": "使出拳頭祈願 賦予物理增強 (2){{value}}", "1708750": "拳頭領域攻擊 下次計量槽0{{value}}", "1708760": "我方引發 青草場地時 賦予物理/特殊 增強(1)G{{value}}", "1708770": "效果絕佳時 賦予1種 妨害狀態{{value}}", "1708780": "自身引發 惡顏領域時 賦予特殊增強 (1)G{{value}}", "1708790": "對手岩石傷害 場地時攻擊時 下次計量槽0{{value}}", "1708800": "訓練家出招後 賦予特殊增強 (2){{value}}", "1708810": "首次拍招後 下次傷害防禦G", "1708820": "拍招後賦予 物理/特殊 增強(2)G{{value}}", "1708830": "首次上場時 賦予劇毒G", "1708840": "首次攻擊時 物理/特殊 增強{{value}}", "1708850": "妖怪領域時 攻擊時賦予 物理/特殊 增強(1){{value}}", "1708860": "首次拍招後 拍組招式 增強10", "1708870": "自身首次引發城都鬥陣(特殊)時挺住G", "1708880": "首次攻擊時 賦予特殊爆擊", "1708890": "城都鬥陣(特殊)時招式後下次不消耗計量槽{{value}}", "1708900": "我方引發 妖怪領域時 物理/特殊 增強(2)G{{value}}", "1708910": "招式後賦予 物理/特殊 增強(1)G{{value}}", "1708920": "我方引發鬥陣 時下次計量槽0G{{value}}", "1708930": "攻擊時賦予 物理/特殊 增強(1){{value}}", "1708940": "寶可夢首次 使出變化招式 下次計量槽0G", "1708950": "攻擊中毒中的對手時賦予拍組招式增強(2){{value}}", "1708960": "攻擊時賦予特殊增強(3){{value}}", "1708970": "拍組招式後下次必中要害G", "1708980": "登場時 物理/特殊增強 G{{value}}", "1708990": "自身引發 帕希歐鬥陣 (防禦)時 特殊增強G{{value}}", "1709000": "首次攻擊時 火屬性抵抗↓", "1709010": "防禦成功時賦予物理增強(1)G{{value}}", "1709020": "防禦成功時賦予特殊增強(1)G{{value}}", "1709030": "首次拍組招式後一般屬性抵抗↓G{{value}}", "1709040": "首次拍組招式後火屬性抵抗↓G{{value}}", "1709050": "首次拍組招式後水屬性抵抗↓G{{value}}", "1709060": "首次拍組招式後電屬性抵抗↓G{{value}}", "1709070": "首次拍組招式後草屬性抵抗↓G{{value}}", "1709080": "首次拍組招式後冰屬性抵抗↓G{{value}}", "1709090": "首次拍組招式後超能力屬性抵抗↓G{{value}}", "1709100": "首次拍組招式後惡屬性抵抗↓G{{value}}", "1709110": "首次拍組招式後妖精屬性抵抗↓G{{value}}", "1709120": "首次草屬性攻擊時變成青草場地&草屬性抵抗↓", "1709130": "首次岩石屬性攻擊時變成岩石領域&岩石屬性抵抗↓", "1709140": "首次拍組招式後岩石屬性抵抗↓G{{value}}", "1709150": "首次妖怪祈願次數為0時物理增強{{value}}", "1709160": "訓練家出招後賦予物理增強(2){{value}}", "1709170": "攻擊異常中的對手時賦予拍組招式增強(3){{value}}", "1709180": "拍組招式後統一賦予特殊增強(1~4)G{{value}}", "1709190": "自身引發關都鬥陣(特殊)時賦予特殊增強(1){{value}}", "1709210": "我方攻擊時自身物理增強1/拍組招式增強2", "1709220": "隊伍使出拍組招式後賦予物理增強(2){{value}}", "1709250": "我方引發天氣/場地/領域時賦予物理增強(1)G{{value}}", "1709270": "瀕死時拍組招式增強G10", "1709280": "拍組招式及拍組極巨化招式後賦予特殊增強(2)G{{value}}", "1709290": "隊伍使出拍組招式後賦予特殊增強(2){{value}}", "1709300": "招式後賦予物理增強(2)/拍組招式增強(4)", "1709310": "自身引發鋼鐵領域時賦予物理/特殊增強(1)G{{value}}", "1709370": "青草場地時攻擊時下次不消耗計量槽&賦予中毒", "1709380": "妖怪領域時攻擊時下次不消耗計量槽&賦予灼傷", "1709390": "龍之領域時攻擊時下次不消耗計量槽&賦予麻痺", "1709420": "隊伍使出拍組招式後賦予物理增強(1){{value}}", "1709430": "拍組/拍組極巨化招式後賦予物理/特殊增強(1)G{{value}}", "1709440": "上場時物理/特殊增強{{value}}", "1709490": "首次拍組招式後物理/特殊增強{{value}}", "1709540": "青草場地時攻擊時賦予物理增強(1)G{{value}}", "1709550": "鬥陣時攻擊時賦予物理增強(1)G{{value}}", "1801060": "命中率 下降抗性{{value}}", "1801070": "閃避率 下降抗性{{value}}", "1801090": "全種類 下降抗性{{value}}", "1802060": "命中下降無效", "1802070": "閃避下降無效", "1802080": "要害下降無效", "1802090": "全種類 下降無效", "1802100": "沙暴時 全種類 下降無效", "1802110": "晴天時 全種類 下降無效", "1802120": "命中提升無效", "1802130": "精神場地時 全種類 下降無效", "1802140": "妖精領域時 全種類 下降無效", "1802150": "冰雹時 全種類 下降無效", "1802160": "電氣場地時 全種類 下降無效G", "1802170": "防禦下降無效 G", "1802180": "特攻 下降無效G", "1802190": "攻擊下降無效G", "1802200": "妖精領域時 全種類 下降無效G", "1802210": "鬥陣時 全種類↓無效G", "1802220": "岩石領域時 全種類↓無效G", "1802230": "玉蟲領域時 全種類↓無效", "1802240": "惡顏領域時 全種類↓無效", "1802250": "淨空領域時 全種類↓無效G", "1802260": "全種類↓無效 &寶可夢招式 及拍招 擊中要害化", "1802270": "龍之領域時全種類↓無效G", "1803010": "瀕死時 能力轉移", "1803020": "替換時 能力轉移", "1804010": "上場時 攻擊下降G{{value}}", "1804020": "上場時 速度下降G{{value}}", "1804030": "擊中要害時 速度提升{{value}}", "1804040": "擊中要害時 要害率提升{{value}}", "1804050": "出招後速度↑{{value}}", "1804060": "攻擊時 攻擊提升{{value}}", "1804070": "攻擊時 防禦下降{{value}}", "1804080": "出招後防禦↑{{value}}", "1804090": "攻擊時 能力提升{{value}}", "1804100": "能力下降時 特攻提升{{value}}", "1804110": "瀕死時 攻擊特攻 降低G{{value}}", "1804120": "被攻擊時 閃避提升{{value}}", "1804130": "被攻擊時 速度提升 2階段{{value}}", "1804140": "首次 HP減半時 閃避提升{{value}}", "1804150": "被物理攻擊時 速度下降{{value}}", "1804160": "攻擊時 能力下降{{value}}", "1804170": "上場時 閃避提升{{value}}", "1804180": "上場時 速度提升{{value}}", "1804190": "上場時 要害提升{{value}}", "1804200": "首次危機時 特攻提升{{value}}", "1804210": "其他 拍組瀕死時 攻擊↑{{value}}", "1804220": "對手中招後 特攻下降{{value}}", "1804250": "能力下降時 攻擊提升{{value}}", "1804260": "首次危機時 閃避提升{{value}}", "1804270": "對手中招後 攻擊特攻↑{{value}}", "1804280": "首次危機時 速度提升{{value}}", "1804290": "出招後 特攻提升{{value}}", "1804300": "出招後 攻擊提升G{{value}}", "1804310": "出招後 要害率↑G{{value}}", "1804320": "被攻擊時 防禦提升{{value}}", "1804330": "被攻擊時 特防提升{{value}}", "1804340": "首次危機時 防禦提升G{{value}}", "1804350": "首次 HP減半時 速度提升{{value}}", "1804360": "出招後 要害率↑{{value}}", "1804370": "出招後 特防↑G{{value}}", "1804380": "出招後 閃避率↑{{value}}", "1804390": "招式後 要害提升G{{value}}", "1804400": "招式後 特攻提升{{value}}", "1804410": "招式後 速度提升G{{value}}", "1804420": "命中時 防禦下降{{value}}", "1804520": "出招後 特攻提升G{{value}}", "1804530": "招式後 攻擊提升{{value}}", "1804540": "招式後 特防提升{{value}}", "1804550": "拍招後 {{value}}種能力提升{{value}}", "1804560": "上場時 防禦提升{{value}}", "1804570": "招式後 攻擊提升G{{value}}", "1804580": "招式後 防禦提升G{{value}}", "1804590": "上場時 攻擊提升{{value}}", "1804600": "首次危機時 攻擊提升{{value}}", "1804610": "上場時 命中下降G{{value}}", "1804620": "招式後 速度提升{{value}}", "1804630": "拍招後 攻擊提升G{{value}}", "1804640": "攻擊時 特防下降{{value}}", "1804650": "招式後 防禦提升{{value}}", "1804660": "上場時 特防提升{{value}}", "1804670": "上場時 特防下降G{{value}}", "1804680": "招式後 閃避提升{{value}}", "1804690": "招式後 命中提升G{{value}}", "1804700": "我方中招後 防禦提升{{value}}", "1804710": "首次危機時 要害提升{{value}}", "1804720": "出招後 閃避率↑G{{value}}", "1804730": "招式後 閃避提升G{{value}}", "1804740": "對手失敗時 攻擊提升{{value}}", "1804750": "對手失敗時 特攻提升{{value}}", "1804760": "拍招後 要害提升{{value}}", "1804770": "拍招後 攻擊下降G{{value}}", "1804780": "對手中招後 防禦特防↓{{value}}", "1804800": "打倒對手時 攻擊特攻↑{{value}}", "1804810": "上場時 特攻下降G{{value}}", "1804820": "被攻擊時 攻擊提升{{value}}", "1804830": "攻擊時 攻擊下降{{value}}", "1804840": "要害時 攻擊提升{{value}}", "1804850": "要害時 特攻提升{{value}}", "1804860": "招式後特 攻提升G{{value}}", "1804870": "招式後特 防提升G{{value}}", "1804880": "被攻擊時 特攻提升{{value}}", "1804890": "被攻擊時 防禦提升G{{value}}", "1804900": "攻擊時 閃避下降{{value}}", "1804910": "攻擊時 命中下降{{value}}", "1804930": "攻擊 混亂的對手時 防禦↓{{value}}", "1804940": "攻擊時 防禦下降G{{value}}", "1804950": "攻擊時 特防下降G{{value}}", "1804960": "攻擊時 防禦提升{{value}}", "1804970": "攻擊時 速度下降{{value}}", "1804980": "招式 擊中要害時 特防↑{{value}}", "1804990": "瀕死時 特防下降G{{value}}", "1805010": "沙暴時 閃避提升", "1805030": "異常狀態 命中提升{{value}}", "1805050": "下雨時招式 瞄準要害{{value}}", "1805070": "HP減半時招式 瞄準要害{{value}}", "1805080": "上場時 閃避下降G{{value}}", "1805090": "拍招瞄準要害{{value}}", "1805100": "冰雹時招式 瞄準要害{{value}}", "1805110": "上場時 防禦下降G{{value}}", "1805120": "效果絕佳時 要害提升{{value}}", "1805130": "效果絕佳時 特攻提升{{value}}", "1805140": "招式及拍招 及極巨招式 擊中要害化", "1805150": "招式及拍招 擊中要害化", "1805160": "沙暴時寶可夢 招式及拍招 瞄準要害{{value}}", "1807010": "被攻擊時 攻擊吸收{{value}}", "1807020": "攻擊時 能力吸收{{value}}", "1807030": "攻擊時 防禦吸收{{value}}", "1807040": "攻擊時 特防吸收{{value}}", "1807050": "攻擊時 速度吸收{{value}}", "1807060": "攻擊 吸收5種能力 中1種G{{value}}", "1807070": "被攻擊 吸收5種能力 中1種{{value}}", "1807080": "攻擊時 攻擊能力吸收{{value}}", "1808010": "招式後解除 能力下降{{value}}", "1808020": "危機時解除 能力下降 至多一次{{value}}", "1808030": "拍招後解除 能力下降{{value}}", "1808040": "上場時解除 能力下降", "1808050": "拍招後 能力提升反轉G", "1808060": "拍組招式後 解除 能力下降G{{value}}", "1809010": "上場時 命中提升{{value}}", "1809020": "拍招後 閃避提升{{value}}", "1809030": "上場時 速度提升G{{value}}", "1809040": "冰雹時出招 要害率↑G{{value}}", "1809050": "招式後 能力提升G{{value}}", "1809060": "上場時 能力提升{{value}}", "1809070": "首次危機時 特防提升{{value}}", "1809080": "出招後特防↑{{value}}", "1809090": "清除濃霧後 閃避下降{{value}}", "1809100": "被攻擊時 攻擊特攻 提升G{{value}}", "1809110": "對手失敗時 攻擊提升G{{value}}", "1809120": "拍招後 防禦提升{{value}}", "1809130": "拍招後 命中提升{{value}}", "1809140": "上場時 能力提升G{{value}}", "1809150": "拍組招式後 特攻提升{{value}}", "1809160": "擊中要害時 攻擊提升{{value}}", "1809170": "寶可夢招式 下降G{{value}}", "1809180": "防禦成功時 防禦提升{{value}}", "1809190": "防禦成功時 特防提升{{value}}", "1809200": "防禦成功時 攻擊提升G{{value}}", "1809210": "下雨時攻擊 特攻提升{{value}}", "1809220": "擊中要害時 防禦提升{{value}}", "1809230": "對手失敗時 閃避提升{{value}}", "1809240": "能力下降 效果2倍", "1809250": "首次拍招後 攻擊提升{{value}}", "1809260": "對手中招後 攻擊特攻↑G{{value}}", "1809270": "攻擊 禁止替換對手 計量槽↑{{value}}", "1809280": "擊中要害時 速度提升{{value}}", "1809290": "變化招式後 HP回復G{{value}}", "1809300": "上場時 命中提升G{{value}}", "1809310": "上場時 攻擊提升G{{value}}", "1809320": "上場時 特攻提升G{{value}}", "1809330": "上場時 攻擊特攻 提升{{value}}", "1809340": "攻擊時 特防提升{{value}}", "1809350": "攻擊 睡眠對手時 要害提升G{{value}}", "1809360": "出招後 速度↑G{{value}}", "1809370": "對手中招後 攻擊防禦↓{{value}}", "1809380": "攻擊時 速度提升G{{value}}", "1809390": "沙暴時出招 速度↑G{{value}}", "1809400": "被妨害時 速度提升{{value}}", "1809410": "首次使出 變化招式後 攻擊特攻↑G{{value}}", "1809420": "變化招式時 要害提升{{value}}", "1809430": "變化招式 能力提升 效果2倍", "1809440": "招式後 要害提升{{value}}", "1809450": "攻擊時 7種能力下降{{value}}", "1809460": "攻擊時 防禦提升G{{value}}", "1809470": "攻擊時 特防提升G{{value}}", "1809480": "上場時 防禦特防↑{{value}}", "1809490": "沙暴時出招 防禦特防↑{{value}}", "1809500": "沙暴時攻擊 命中下降{{value}}", "1809510": "對手失敗時 速度提升G{{value}}", "1809530": "HP減半時 防禦提升G{{value}}", "1809540": "個人技後 特防提升G{{value}}", "1809550": "極巨招式後 速度下降G{{value}}", "1809560": "對手失敗時 命中提升G{{value}}", "1809570": "對手失敗時 攻擊特攻 提升G{{value}}", "1809580": "變化招式後 攻擊下降G{{value}}", "1809590": "變化招式後 特攻下降G{{value}}", "1809600": "極巨招式後 防禦提升{{value}}", "1809610": "上場時 要害提升G{{value}}", "1809620": "個人技後 特攻提升G{{value}}", "1809630": "拍招後 閃避下降G{{value}}", "1809640": "首次HP減半時 攻擊提升{{value}}", "1809650": "變化招式時 特攻提升G{{value}}", "1809660": "變化招式時 防禦提升G{{value}}", "1809670": "對手中招後 閃避下降G{{value}}", "1809680": "對手中招後 速度下降G{{value}}", "1809690": "被攻擊時 速度提升G{{value}}", "1809700": "打倒對手時 攻擊提升{{value}}", "1809710": "攻擊麻痺對手 5種能力下降{{value}}", "1809720": "攻擊時 要害提升G{{value}}", "1809730": "極巨招式後 特防提升{{value}}", "1809740": "極巨招式後 特防提升G{{value}}", "1809750": "結凍頭時攻擊 速度提升{{value}}", "1809760": "變化招式時 攻擊提升G{{value}}", "1809770": "變化招式時 能力下降G{{value}}", "1809780": "被攻擊時 防禦特防 提升G{{value}}", "1809790": "攻擊時 特攻提升{{value}}", "1809800": "個人技後 攻擊提升G{{value}}", "1809810": "冰雹時出招 防禦特防↑{{value}}", "1809820": "變化招式時 速度提升G{{value}}", "1809830": "變化招式時 要害提升{{value}}", "1809850": "攻擊 妨害中對手時 特防↓{{value}}", "1809860": "攻擊 妨害中對手時 攻擊特攻↓{{value}}", "1809870": "個人技後 特攻提升{{value}}", "1809880": "個人技後 特防提升{{value}}", "1809890": "首次上場時 特攻下降G{{value}}", "1809900": "沙暴時攻擊 攻擊下降{{value}}", "1809910": "首次使出 變化招式時 5種能力↑G{{value}}", "1809920": "對手中招後 特防下降{{value}}", "1809930": "變化招式時 速度提升G{{value}}", "1809950": "攻擊妨害對手 能力下降 2階段{{value}}", "1809960": "被攻擊時 攻擊提升G{{value}}", "1809970": "首次使出 變化招式時 防禦提升G{{value}}", "1809980": "首次使出 變化招式時 特防提升G{{value}}", "1809990": "首次變化招時 防禦特防 提升G{{value}}", "1810010": "首次拍招後 5種能力 提升G{{value}}", "1810020": "攻擊 混亂對手時 能力下降{{value}}", "1810030": "出招後 防禦↑G{{value}}", "1810040": "變化招式時 特防提升 2階段G{{value}}", "1810050": "攻擊時 防禦下降 2階段{{value}}", "1810060": "被攻擊時 對手防禦 下降{{value}}", "1810070": "被攻擊時 對手特防 下降{{value}}", "1810080": "命中時 要害提升{{value}}", "1810090": "命中時 速度下降{{value}}", "1810100": "對手中招後 特攻下降 2階段{{value}}", "1810110": "首次上場時 速度提升G{{value}}", "1810120": "首次上場時 防禦提升G{{value}}", "1810130": "首次上場時 特防提升G{{value}}", "1810140": "個人技後 特攻提升 2階段{{value}}", "1810150": "個人技後 要害提升 2階段{{value}}", "1810160": "對手中 招式/拍招/ 極巨招式後 特防↓{{value}}", "1810170": "對手中 招式/拍招/ 極巨招式後 特攻特防↓{{value}}", "1810180": "對手中 招式/拍招/ 極巨招式後 能力↓{{value}}", "1810190": "攻擊 麻痺對手時 速度下降{{value}}", "1810200": "極巨招式後 防禦下降{{value}}", "1810210": "攻擊 麻痺對手時 要害提升G{{value}}", "1810220": "命中時 能力下降{{value}}", "1810230": "青草場攻擊時 防禦↑G& 防禦↓G{{value}}", "1810240": "精神場攻擊時 特防↑G& 特防↓G{{value}}", "1810250": "電氣場攻擊時 速度↑G& 速度↓G{{value}}", "1810260": "個人技後 防禦特防 提升{{value}}", "1810270": "個人技後 防禦特防 提升2階段{{value}}", "1810280": "個人技後 要害提升G{{value}}", "1810290": "攻擊時 速度下降 2階段{{value}}", "1810300": "效果絕佳時 速度下降 2階段{{value}}", "1810310": "火屬攻擊時 攻擊下降{{value}}", "1810320": "水屬攻擊時 防禦下降{{value}}", "1810330": "蟲屬攻擊時 特防下降{{value}}", "1810340": "蟲屬攻擊時 特攻下降{{value}}", "1810350": "灼傷的對手 中招後 防禦特防↓{{value}}", "1810360": "招式後 攻擊2 擊中要害率1↑{{value}}", "1810370": "防禦成功時 防禦特防提升G{{value}}", "1810380": "使出次數限定 招式時 特防提升G{{value}}", "1810390": "首次拍招後 防禦下降G{{value}}", "1810400": "拍招後 命中下降G{{value}}", "1810410": "攻擊時 命中提升G{{value}}", "1810420": "對手中 招式及拍招後 攻擊↓{{value}}", "1810430": "對手中 招式及拍招後 特攻↓{{value}}", "1810440": "對手中 招式及拍招後 特防↓{{value}}", "1810450": "對手中 招式及拍招後 速度↓{{value}}", "1810460": "對手中 招式及拍招後 閃避率↓{{value}}", "1810470": "拍招後 特防提升G{{value}}", "1810480": "拍招後 擊中要害率 提升G{{value}}", "1810490": "拍招後 閃避提升G{{value}}", "1810500": "自身能力提升 效果2倍", "1810510": "變化招式時 防禦提升 2階段{{value}}", "1810520": "變化招式時 特防提升 2階段{{value}}", "1810530": "首次HP減半時 特攻提升{{value}}", "1810540": "下雨時命中 特防下降{{value}}", "1810550": "對手失敗時 防禦特防 提升G{{value}}", "1810560": "電氣場地時攻擊時速度下降G{{value}}", "1810570": "攻擊麻痺對手 攻擊防禦 下降{{value}}", "1810580": "攻擊中毒對手 攻擊特攻 下降{{value}}", "1810590": "攻擊時 特攻下降{{value}}", "1810600": "招式後 攻擊特攻提升{{value}}", "1810610": "對手中 寶可夢招式後 能力下降{{value}}", "1810620": "被攻擊時 5種能力 提升1種G{{value}}", "1810630": "攻擊灼傷對手 攻擊特防 下降{{value}}", "1810640": "招式後 命中率提升{{value}}", "1810650": "極巨招式後 防禦提升G{{value}}", "1810660": "攻擊中毒對手 能力下降 2階段{{value}}", "1810670": "攻擊時 閃避率提升G{{value}}", "1810680": "攻擊中毒對手 攻擊提升{{value}}", "1810690": "攻擊中毒對手 速度提升{{value}}", "1810700": "首次HP減半 攻擊特攻提升{{value}}", "1810710": "招式後 5種能力 提升1種G{{value}}", "1810720": "攻擊 無法閃避對手 速度提升G{{value}}", "1810740": "招式後 5種能力 中1種↑{{value}}", "1810750": "寶可夢出招後 防禦特防 提升{{value}}", "1810760": "攻擊 禁止替換對手 命中率↓{{value}}", "1810770": "拍招後防禦 下降G{{value}}", "1810780": "我方引發 天氣/場地/領域 閃避率提升G{{value}}", "1810790": "使出破滅之願 同一能力 提升2階段G", "1810800": "對手中 寶可夢招式 特防下降 2階段{{value}}", "1810810": "對中毒對手 使出變化招式 能力下降 效果{{value}}倍", "1810820": "出招後 速度提升 2階段{{value}}", "1810830": "拍組招式後 速度提升G{{value}}", "1810840": "命中時 閃避率提升{{value}}", "1810850": "首次HP60% 攻擊特攻 提升{{value}}", "1810860": "拍招後 特防提升{{value}}", "1810870": "拍招後 防禦特防提升{{value}}", "1810880": "攻擊灼傷對手 特攻下降{{value}}", "1810890": "攻擊束縛對手 特防下降{{value}}", "1810900": "使用 吸收招式攻擊 攻擊↓{{value}}", "1810910": "寶可夢招式 能力提升 效果2倍", "1810920": "對手中 寶可夢招式 攻擊下降{{value}}", "1810930": "使出 破滅之願時 同一能力提升G", "1810940": "使出 變化招式時 能力提升{{value}}", "1810950": "極巨招式後 防禦下降G{{value}}", "1810960": "攻擊灼傷對手 攻擊下降{{value}}", "1810970": "攻擊束縛對手 速度下降{{value}}", "1810980": "使用 吸收招式攻擊 特攻↓{{value}}", "1810990": "使出 變化招式時 命中率提升 2階段G{{value}}", "1811010": "攻擊灼傷對手 能力下降{{value}}", "1811020": "攻擊麻痺對手 防禦特防 下降{{value}}", "1811030": "極巨招式後 攻擊提升{{value}}", "1811040": "攻擊中毒對手 能力下降{{value}}", "1811050": "對手中寶可夢 變化招式時 特防下降{{value}}", "1811060": "攻擊時 攻擊特攻 提升G{{value}}", "1811070": "對手首次 中拍招後 防禦特防下降{{value}}", "1811080": "對手中 寶可夢招式後 防禦下降{{value}}", "1811090": "對手中 招式及拍招後 防禦下降 2階段{{value}}", "1811100": "攻擊時 速度提升 2階段G{{value}}", "1811120": "對手中 招式及拍招後 特防下降 2階段{{value}}", "1811130": "對手 惡傷害場地 攻擊防禦特防 下降{{value}}", "1811140": "對手 惡傷害場地 攻擊時 速度提升{{value}}", "1811150": "攻擊時 攻擊提升G{{value}}", "1811160": "攻擊時 特攻提升G{{value}}", "1811170": "攻擊束縛對手 攻擊下降{{value}}", "1811180": "對手中招後 攻擊特攻下降{{value}}", "1811190": "攻擊時 閃避率提升{{value}}", "1811200": "招式後 攻擊特攻 提升G{{value}}", "1811210": "對手中 招式及拍招 攻擊下降 2階段{{value}}", "1811220": "對手中 招式及拍招 特攻下降 2階段{{value}}", "1811230": "上場時 能力下降G{{value}}", "1811240": "我方引發 天氣/場地/領域 速度提升G{{value}}", "1811250": "攻擊異常對手 能力下降 2階段{{value}}", "1811260": "首次個人技後 特攻提升G{{value}}", "1811270": "命中時 攻擊下降{{value}}", "1811280": "出招後 防禦特防提升 G{{value}}", "1811290": "訓練家出招後 速度閃避率 提升G{{value}}", "1811300": "招式後 攻擊特攻 提升2階段{{value}}", "1811310": "對手中極巨化 招式後7種 能力下降{{value}}", "1811320": "物理攻擊時 防禦下降 2階段{{value}}", "1811330": "特殊攻擊時 特防下降 2階段{{value}}", "1811340": "寶可夢使出 變化招式時 攻擊下降G{{value}}", "1811350": "寶可夢使出 變化招式時 特攻下降G{{value}}", "1811360": "攻擊時防禦 特防下降{{value}}", "1811370": "對手中拍招後 特攻下降{{value}}", "1811380": "拍招後特攻 提升G{{value}}", "1811390": "拍組招式後 5種能力 提升G{{value}}", "1811400": "劇毒領域時 攻擊時 能力下降{{value}}", "1811410": "命中時 能力提升 2階段{{value}}", "1811420": "登場時 攻擊速度 提升{{value}}", "1811430": "對手中寶可夢 變化招式時 防禦下降 2階段{{value}}", "1811440": "攻擊麻痺中的 對手時 防禦下降{{value}}", "1811450": "被攻擊時 對手5種能力 其中1種下降 2階段{{value}}", "1811460": "對手首次 中拍招後 能力下降2倍", "1811470": "上場時特攻 速度提升{{value}}", "1811480": "命中時 特防下降{{value}}", "1811490": "拍招後7種 能力提升{{value}}", "1811500": "訓練家招式後 攻擊特攻 提升{{value}}", "1811510": "極巨化招式後 攻擊特攻 提升G{{value}}", "1811520": "寶可夢首次 使出變化招式 擊中要害率 提升G{{value}}", "1811530": "對手中寶可夢 變化招式時 攻擊下降 2階段{{value}}", "1811540": "被攻擊時 特攻提升G{{value}}", "1811550": "鬥陣時攻擊時 攻擊特攻 下降{{value}}", "1811560": "對手中拍招後 攻擊特攻 下降{{value}}", "1811570": "上場時 閃避率 提升G{{value}}", "1811580": "攻擊禁止替換 中的對手時 5種能力其1↑G{{value}}", "1811590": "首次 訓練家招式後 防禦特防提升{{value}}", "1811600": "自身引發 全體/我方場地 攻擊特攻提升G{{value}}", "1811610": "對手中 變化招式時 防禦下降{{value}}", "1811620": "攻擊時 攻擊特攻 下降{{value}}", "1811630": "對手中 極巨招式後 特防下降G{{value}}", "1811640": "我方中招後 特防提升{{value}}", "1811650": "變化招式時 特攻提升{{value}}", "1811660": "上場時 特攻特防 提升{{value}}", "1811670": "攻擊 麻痺中的對手 特防下降{{value}}", "1811680": "被攻擊時 對手攻擊 &特攻下降{{value}}", "1811690": "首次上場時 攻擊下降G{{value}}", "1811700": "攻擊禁止替換 中的對手時 攻擊特攻下降{{value}}", "1811710": "晴天時 攻擊時 攻擊防禦下降{{value}}", "1811720": "招式後 招式計量槽2↑{{value}}", "1811730": "攻擊時 能力下降 3次{{value}}", "1811740": "快攻招式後 能力下降 2階段{{value}}", "1811750": "招式後 特攻2 要害率1↑{{value}}", "1811760": "晴天時 攻擊時 2種能力下降{{value}}", "1811770": "上場時 特攻閃避提升{{value}}", "1811780": "上場時 特攻4 要害率{{value}}↑", "1811790": "對手中招式 及拍招後 防禦下降{{value}}", "1811800": "首次上場時 7種能力 下降G{{value}}", "1811810": "冰雹時 攻擊時 特防下降{{value}}", "1811820": "首次拍式後 命中閃避 下降G{{value}}", "1811830": "自身引發 鬥陣時 防禦特防2↑G{{value}}", "1811840": "首次上場時 防禦特防↑{{value}}", "1811850": "攻擊時 特防下降 2階段{{value}}", "1811860": "我方中招後 特攻提升{{value}}", "1811870": "攻擊麻痺對手 攻擊下降 2階段{{value}}", "1811880": "被攻擊時 閃避率2↑G{{value}}", "1811890": "寶可夢使出 變化招式時 防禦特防↑{{value}}", "1811900": "首次上場時 7種能力↑{{value}}", "1811910": "被攻擊時 對手速度2↓{{value}}", "1811920": "晴天時攻擊時 防禦特防↓{{value}}", "1811930": "對手中 極巨招式後 特防↓{{value}}", "1811940": "自身首次引發 神奧鬥陣(特殊)時 特攻↑{{value}}", "1811950": "拍組招式後 自身 防禦特防↓{{value}}", "1811960": "招式後自身 防禦特防↓{{value}}", "1811970": "攻擊灼傷 中的對手時 特攻特防↓{{value}}", "1811980": "攻擊麻痺 中的對手時 攻擊特攻↑G{{value}}", "1811990": "對手失敗時 能力2↑G{{value}}", "1812010": "我方中招後 攻擊↑{{value}}", "1812060": "攻擊時 特攻特防↓{{value}}", "1812070": "妖精領域時 攻擊時能力↓2次{{value}}", "1812080": "攻擊灼傷 中的對手時 能力2↓{{value}}", "1812090": "攻擊束縛中的對手時速度2↓{{value}}", "1812100": "我方引發天氣 /場地/領域時 5種能力其中 1種2↑G{{value}}", "1812110": "訓練家招式 次數為1以上時 攻擊時特防↓{{value}}", "1812120": "訓練家招式 次數為0時 攻擊時能力2↓{{value}}", "1812130": "攻擊混亂 中的對手時 命中↓{{value}}", "1812140": "攻擊時 能力2↓{{value}}", "1812150": "攻擊灼傷 中的對手時 攻擊特攻↓{{value}}", "1812160": "攻擊時 攻擊2↓{{value}}", "1812180": "攻擊時 特攻4↓{{value}}", "1812190": "寶可夢首次 使出變化招式 特攻↑{{value}}", "1812200": "寶可夢首次 使出變化招式 擊中要害率 ↑{{value}}", "1812210": "攻擊時特防 3↓{{value}}", "1812220": "我方攻擊 異常對手時 能力↓{{value}}", "1812240": "被攻擊時 同一能力2 ↑G{{value}}", "1812260": "寶可夢使出 變化招式時 速度6↑{{value}}", "1812270": "晴天時我方 攻擊時 速度↑G{{value}}", "1812280": "我方攻擊 束縛中的對手時 能力↑{{value}}", "1812290": "對手中 寶可夢招式後 特攻↓{{value}}", "1812300": "攻擊時 命中率3↓{{value}}", "1812310": "極巨招式後 防禦特防↑{{value}}", "1812320": "晴天時攻擊時 防禦下降{{value}}", "1812330": "拳頭領域時 攻擊時 特防↓{{value}}", "1812340": "自身引發合眾 鬥陣(特殊)時 防禦特防 2↑G{{value}}", "1812350": "攻擊時 防禦特防2↑ G{{value}}", "1812360": "首次上場時 7種能力↑G{{value}}", "1812370": "近身戰後 攻擊特攻↓{{value}}", "1812380": "攻擊灼傷中的 對手時 防禦特防 ↓{{value}}", "1812390": "自身引發合眾 鬥陣(特殊)時 攻擊2↑G{{value}}", "1812400": "自身引發合眾 鬥陣(特殊)時 特攻2↑G{{value}}", "1812410": "太晶化時 攻擊↑{{value}}", "1812420": "下雨時攻擊時 能力2↓{{value}}", "1812430": "自身首次引發 岩石傷害場地 時攻撃↑{{value}}", "1812440": "自身首次引發 岩石傷害場地 擊中要害率↑{{value}}", "1812450": "對手岩石傷害 場地時攻擊時 能力2↓{{value}}", "1812460": "招式後 攻擊速度↑G{{value}}", "1812470": "攻擊灼傷對手 時攻擊防禦 2↓{{value}}", "1812480": "攻擊中毒對手 時防禦特防 ↓{{value}}", "1812490": "攻擊時 防禦6↓{{value}}", "1812500": "攻擊時 特防6↓{{value}}", "1812510": "我方引發鬥陣 時速度2↑ G{{value}}", "1812520": "自身首次引發城都鬥陣(特殊)時特攻↑G{{value}}", "1812530": "自身首次引發城都鬥陣(特殊)時擊中要害率↑G{{value}}", "1812540": "物理攻擊時 賦予物理增強 (3){{value}}", "1812550": "特殊攻擊時 賦予特殊增強 (3){{value}}", "1812560": "首次上場時 攻撃特攻↓G{{value}}", "1812570": "攻擊時 特攻2↓{{value}}", "1812580": "攻擊時 防禦速度↓{{value}}", "1812590": "攻擊混亂中的對手時特防2↓{{value}}", "1812600": "攻擊時防禦3↓{{value}}", "1812610": "首次上場時 擊中要害率 ↑{{value}}", "1812620": "防禦成功時防禦4↓G{{value}}", "1812630": "防禦成功時特防4↓G{{value}}", "1812640": "對手中寶可夢招式及拍組招式後防禦特防2↓{{value}}", "1812650": "對手中招後同一能力2↓{{value}}", "1812660": "攻擊時同一能力↓2次{{value}}", "1812670": "首次上場時防禦特防↑G{{value}}", "1812680": "上場時攻擊6擊中要害率{{value}}↑", "1812690": "對手中招後攻擊2↓{{value}}", "1812700": "對手中招後特攻2↓{{value}}", "1812710": "攻擊時攻擊防禦2↓{{value}}", "1812720": "首次上場時特攻{{value}}擊中要害3↑", "1812740": "青草場地時攻擊時防禦2↓{{value}}", "1812750": "岩石領域時攻擊時攻擊2↓{{value}}", "1812760": "攻擊混亂中的對手時能力2↓{{value}}", "1812790": "自身引發鬥陣時速度2↑G{{value}}", "1812820": "首次上場時計數加速1&擊中要害率3↑", "1812840": "攻擊時攻擊2↑G{{value}}", "1812850": "攻擊時特攻2↑G{{value}}", "1812860": "首次拍組招式後能力↓10次G", "1902010": "首次危機時 減輕場地 物理傷害", "1902020": "拍招後變成 青草場地", "1902030": "首次上場時 變成冰雹", "1902040": "上場時場地 異常狀態防禦", "1902050": "首次拍招後 場地招式 計量槽加速", "1902060": "首次上場時 變成晴天", "1902070": "首次上場時 變成下雨", "1902100": "首次上場時 變成沙暴", "1902110": "首次拍招後 變成晴天", "1902120": "首次拍招後 變成下雨", "1902130": "首次拍招後 變成沙暴", "1902140": "首次上場時 減輕場地 物&特傷害", "1902150": "出招後 解除天氣{{value}}", "1902160": "首次拍招後 場地要害防禦", "1902170": "回復招式後 場地招式 計量槽加速", "1902180": "首次拍招後 變成電氣場地", "1902190": "沙暴時間 延長{{value}}", "1902200": "首次登場時 變成沙暴& 沙暴無效", "1902210": "首次變化招式 場地招式 計量槽加速", "1902220": "變化招式時 場地招式 計量槽加速", "1902230": "首次危機時 場地招式 計量槽加速", "1902240": "首次 拍招後變成 大地領域", "1902250": "首次 上場時變成 大地領域", "1902260": "減輕物理傷害 時間延長{{value}}", "1902270": "減輕特殊傷害 時間延長{{value}}", "1902280": "異常狀態防禦 時間延長{{value}}", "1902290": "極巨招式後 變成電氣場地", "1902300": "首次上場時 變成鋼鐵領域", "1902310": "妖精領域 時間延長{{value}}", "1902320": "首次 上場時變成 妖精領域", "1902330": "首次 上場時變成 龍之領域", "1902340": "拍招後變成 下雨", "1902350": "拍招後變成 電氣場地", "1902360": "首次上場時 變成藍天領域", "1902370": "招式後 回氣加速場地{{value}}", "1902380": "岩石領域 時間延長{{value}}", "1902390": "拍招後計量槽 加速場地", "1902400": "首次上場時 減輕場地 物理傷害", "1902410": "首次拍招後 拳頭領域", "1902420": "首次上場時 變成電氣場地&電氣場地 時間延長{{value}}", "1902430": "首次上場時 變成妖精領域&妖精領域 時間延長{{value}}", "1902440": "首次上場時 變成青草場地&青草場地 時間延長{{value}}", "1902450": "首次上場時 變成精神場地&精神場地 時間延長{{value}}", "1902460": "能力無法提升 時間延長{{value}}", "1902470": "招式後 減輕場地 物理傷害{{value}}", "1902480": "自身引發 冰柱領域時 變成冰雹", "1902490": "拍組招式後 變成精神場地", "1902500": "拍組招式後 變成妖精領域", "1902510": "首次上場時 變成冰柱領域", "1902520": "冰雹時間 延長{{value}}", "1902530": "冰柱領域 時間延長{{value}}", "1902540": "打倒對手時 回氣加速 場地{{value}}", "1902550": "首次上場時 變成 妖怪領域", "1902560": "首次上場時 減輕 場地特殊傷害", "1902570": "首次拍招後 變成冰雹", "1902580": "龍之領域 時間延長{{value}}", "1902590": "拍組招式後 變成惡顏領域", "1902600": "首次HP減半 變成晴天", "1902610": "對手 惡傷害場地 時間延長{{value}}", "1902620": "首次拍招後 場地能力 無法提升", "1902630": "招式後 場地 要害防禦{{value}}", "1902640": "劇毒領域 時間延長{{value}}", "1902650": "首次拍招後 變成劇毒領域", "1902660": "電氣場地 時間延長{{value}}", "1902670": "首次拍招後 變成淨空領域", "1902680": "合眾鬥陣 (物理) 時間延長{{value}}", "1902690": "拍招後變成 藍天領域", "1902700": "藍天領域 時間延長{{value}}", "1902710": "關都鬥陣(特殊) 時間延長{{value}}", "1902720": "訓練家出招後 場地要害防禦{{value}}", "1902730": "城都鬥陣(物理) 時間延長{{value}}", "1902740": "青草場地 時間延長{{value}}", "1902750": "自身引發場地 要害防禦減輕 場地物理 &特殊傷害", "1902760": "首次上場時 變成岩石領域", "1902770": "拍組招式後 變成岩石領域", "1902780": "鋼鐵領域 時間延長{{value}}", "1902790": "神奧鬥陣 (防禦) 時間延長{{value}}", "1902800": "首次上場時 變成電氣場地", "1902810": "首次上場時 變成劇毒領域", "1902820": "大地領域 時間延長{{value}}", "1902830": "招式後 場地能力 無法提升{{value}}", "1902840": "首次 變化招式時 變成鋼鐵領域", "1902850": "合眾鬥陣 (防禦)時間 延長{{value}}", "1902860": "首次攻擊時 場地能力 無法提升", "1902870": "首次上場時 變成惡顏領域", "1902880": "伽勒爾鬥陣 (特殊)時間 延長{{value}}", "1902890": "首次HP 減半時 變成冰雹", "1902900": "極巨招式後 場地招式 計量槽加速", "1902910": "妖怪領域 時間延長{{value}}", "1902920": "惡顏領域 時間延長{{value}}", "1902930": "阿羅拉 鬥陣(特殊) 時間延長{{value}}", "1902940": "阿羅拉 鬥陣(防禦) 時間延長{{value}}", "1902950": "訓練家出招後 場地招式 計量槽加速{{value}}", "1902960": "帕希歐 鬥陣(防禦) 時間延長{{value}}", "1902970": "拍組招式後 變成冰柱領域", "1902980": "首次上場時 變成青草場地", "1902990": "超極巨狂擂亂打後 變成青草場地", "1903020": "火傷害場地 無效", "1903080": "毒傷害 場地無效", "1903130": "岩石傷害 場地無效", "1903160": "惡傷害場地 無效", "1903170": "鋼傷害場 無效", "1904020": "火傷害場地 抗性{{value}}", "1904080": "毒傷害 場地抗性{{value}}", "1904130": "岩石傷害 場地抗性{{value}}", "1904160": "惡傷害場地 抗性{{value}}", "1904170": "鋼傷害場 抗性{{value}}", "1904190": "全傷害 場地抗性{{value}}", "1905010": "首次使出 求雨時 變成妖精領域", "1905020": "超極巨破陣火球後 變成晴天", "1905030": "極巨拳鬥後 變成拳頭領域", "1905040": "極巨飛衝後 變成藍天領域", "1905050": "極巨招式後 變成晴天", "1905060": "首次拍招後 變成冰柱領域", "1905070": "首次拍招後 變成龍之領域", "1905080": "首次使出 大晴天時 變成青草場地", "1905090": "極巨招式後 變成淨空領域", "1905100": "淨空領域 時間延長{{value}}", "1905110": "帕底亞 鬥陣(防禦) 時間延長{{value}}", "1905120": "極巨招式後 變成妖怪領域", "1905130": "首次上場時 變成精神場地", "1905140": "寶可夢首次 出招後 變成拳頭領域", "1905150": "極巨招式後 變成劇毒領域", "1905160": "寶可夢首次 出招後 變成精神場地", "1905170": "精神場地 時間延長{{value}}", "1905180": "首次上場時 變成 毒傷害場地", "1905190": "首次拍招後 變成岩石領域", "1905200": "首次攻擊時 變成下雨", "1905210": "首次樹果 次數為0時 變成鋼鐵領域", "1905220": "被攻擊時 變成沙暴{{value}}", "1905230": "超極巨天譴雷誅後 變成妖精領域", "1905240": "首次使出 妖精祈願時 變成電氣場地", "1905250": "極巨岩石後 變成岩石領域", "1905260": "首次上場時 變成玉蟲領域", "1905270": "玉蟲領域 時間延長{{value}}", "1905280": "寶可夢 首次出招後 變成沙暴", "1905290": "極巨大地後 變成大地領域", "1905300": "使出 電氣場地時 變成劇毒領域", "1905310": "首次拍招後 變成青草場地", "1905320": "首次上場時 變成淨空領域", "1905330": "首次 訓練家招式後 變成青草場地", "1905340": "首次上場時 場地變成 阿羅拉鬥陣（特殊）", "1905350": "拍招後變成 火傷害場地", "1905360": "自身引發下雨時 場地變成 伽勒爾鬥陣（特殊）", "1905370": "自身引發青草場地時 場地變成 伽勒爾鬥陣（物理）", "1905380": "自身引發晴天時 場地變成 伽勒爾鬥陣（防禦）", "1905390": "拍組招式後 解除天氣{{value}}", "1905400": "首次上場時 場地變成 帕底亞鬥陣（特殊）", "1905410": "首次拍招後 場地變成 帕底亞鬥陣（特殊）", "1905420": "大地領域時 計量槽加速{{value}}", "1905430": "拍組招式後 變成 毒傷害場地", "1905440": "對手 毒傷害場地 時間延長{{value}}", "1905450": "首次上場時變成EX晴天", "1905460": "首次上場時變成EX下雨", "1905480": "關都鬥陣(防禦) 時間延長{{value}}", "1905490": "豐緣鬥陣(防禦) 時間延長{{value}}", "1905500": "首次拍招後 場地變成 關都鬥陣(防禦)", "1905510": "首次拍招後 場地變成 豐緣鬥陣(防禦)", "1905520": "首次拍招後 場地變成 帕底亞鬥陣(防禦)", "1905530": "神奧鬥陣(特殊) 時間延長{{value}}", "1905540": "計量槽 加速場地 時間延長{{value}}", "1905550": "豐緣鬥陣(物理)時間延長{{value}}", "1905560": "城都鬥陣(防禦)時間延長{{value}}", "1905580": "極巨化招式後 變成 EX玉蟲領域", "1905590": "城都鬥陣(特殊) 時間延長{{value}}", "1905600": "首次上場時 場地變成 城都鬥陣(特殊)", "1905610": "首次訓練家 招式後 場地變成 帕底亞鬥陣(防禦)", "1905620": "首次上場時 場地變成 合眾鬥陣(防禦)", "1905630": "首次拍招後 場地變成 合眾鬥陣(防禦)", "1905640": "極巨招式後 變成龍之領域", "1905650": "拳頭領域 時間延長{{value}}", "1905660": "首次拍招後 場地變成 城都鬥陣(防禦)", "1905670": "首次拍招後 場地變成 卡洛斯鬥陣(防禦)", "1905680": "首次拍招後 場地變成 伽勒爾鬥陣(防禦)", "1905690": "卡洛斯鬥陣 (防禦) 時間延長{{value}}", "1905700": "伽勒爾鬥陣 (防禦) 時間延長{{value}}", "1905710": "首次上場時 場地變成神奧 鬥陣(防禦)", "1905720": "首次攻擊時 變成EX 藍天領域", "1905730": "首次上場時 減輕場地特殊傷害＆ 減輕特殊傷害 時間延長{{value}}", "1905740": "首次攻擊時 變成妖怪領域", "1905750": "首次攻擊時 變成妖怪領域＆ 妖怪領域 時間延長{{value}}", "1905760": "拍組招式後 減輕場地 特殊傷害", "1905770": "自身引發晴天 時變成 拳頭領域", "1905780": "首次上場時 場地變成 帕底亞鬥陣(防禦)", "1905790": "首次上場時 場地變成合眾 鬥陣(特殊)", "1905800": "登場時城都 鬥陣(物理)& 賦予物理增強 G{{value}}", "1905810": "首次攻擊時 變成岩石領域", "1905820": "首次攻擊時 變成龍之領域", "1905830": "首次拍招後 場地變成 關都鬥陣(物理)", "1905840": "首次攻擊時 變成 EX劇毒領域", "1905850": "首次拍招後 場地變成 神奧鬥陣(特殊)", "1905860": "首次訓練家 招式後變成 EX妖怪領域", "1905870": "首次攻擊時 變成 EX電氣場地", "1905880": "首次攻擊時 變成 EX大地領域", "1905890": "首次拍招後 變成妖精領域", "1905900": "晴天&拳頭 領域時間 延長{{value}}", "1905910": "首次攻擊時 場地變成 帕底亞鬥陣 (防禦)", "1905920": "首次拍招後 場地變成神奧 鬥陣(防禦)", "1905930": "首次拍招後 場地變成 阿羅拉鬥陣 (防禦)", "1905940": "首次上場時 場地變成豐緣 鬥陣(防禦)", "1905950": "對手 岩石傷害場地 時間延長{{value}}", "1905960": "拍組太晶化時 變成惡顏領域", "1905970": "合眾鬥陣(特殊) 時間延長{{value}}", "1905980": "首次上場時 變成拳頭領域", "1905990": "首次上場時 場地變成 伽勒爾鬥陣(防禦)", "1906000": "首次上場時 場地變成 伽勒爾鬥陣(防禦) &時間延長{{value}}", "1906010": "首次上場時 場地變成 神奧鬥陣(特殊)", "1906020": "首次上場時 場地變成 神奧鬥陣(特殊) &時間延長{{value}}", "1906030": "首次上場時 場地變成 關都鬥陣(物理) &時間延長{{value}}", "1906040": "首次攻擊時 場地變成關都鬥陣(特殊)", "1906050": "首次拍組招式後場地變成關都鬥陣(特殊)", "1906070": "首次拍招後 變成妖怪領域", "1906080": "首次攻擊時 變成精神場地 &時間延長{{value}}", "1906090": "首次拍招後 場地變成 合眾鬥陣(物理)", "1906100": "帕底亞鬥陣(特殊)時間延長{{value}}", "1906110": "寶可夢首次使出變化招式時變成EX冰柱領域", "1906120": "首次上場時 場地變成 帕希歐鬥陣 (防禦)", "1906130": "訓練家出招後場地變成關都鬥陣(特殊)", "1906150": "首次攻擊時 變成劇毒領域", "1906170": "首次攻擊時 變成晴天", "1906180": "首次攻擊時 變成晴天 &晴天時間延長{{value}}", "1906230": "首次攻擊時 變成玉蟲領域", "1906300": "首次上場時場地變成關都鬥陣(特殊)", "1906340": "首次拍組招式後變成劇毒領域&劇毒領域時間延長{{value}}", "1906380": "首次攻擊時場地變成城都鬥陣(防禦)", "1906390": "青草場地&岩石領域時間延長{{value}}", "1906420": "招式後變成下雨&變成惡顏領域", "1906430": "下雨&惡顏領域時間延長{{value}}", "1906440": "首次拍組招式後變成下雨&下雨時間延長{{value}}", "1906450": "神奧鬥陣(物理)時間延長{{value}}", "1906460": "首次攻擊時變成岩石領域&岩石領域時間延長{{value}}", "1906470": "首次使用同步招式攻擊時變成EX拳頭領域", "1906480": "3種卡洛斯鬥陣時間延長{{value}}", "1906490": "帕底亞鬥陣(物理)時間延長{{value}}", "1906500": "自身引發鋼鐵領域時場地變成伽勒爾鬥陣(防禦)", "1906560": "關都鬥陣(物理)時間延長{{value}}", "1906570": "伽勒爾鬥陣(物理)時間延長{{value}}", "1906580": "首次拍組招式後場地變成城都鬥陣(物理)", "1906590": "首次拍組招式後場地變成城都鬥陣(特殊)", "1906600": "首次拍組招式後場地變成伽勒爾鬥陣(物理)", "1906610": "首次拍組招式後場地變成伽勒爾鬥陣(特殊)", "1906630": "首次拍組招式後場地變成3種關都鬥陣&時間延長{{value}}", "1906650": "首次上場時場地變成關都鬥陣(物理)", "1906660": "首次上場時場地變成關都鬥陣(防禦)", "1906670": "首次攻擊時變成惡顏領域&惡顏領域時間延長{{value}}", "1906720": "首次拍組招式後變成拳頭領域&拳頭領域時擊中要害無效G", "1906730": "首次波導彈・神氣次數為0時場地變成卡洛斯鬥陣(特殊)", "1906740": "卡洛斯鬥陣(特殊)時間延長{{value}}", "1906750": "首次碎岩・天破次數為0時場地變成卡洛斯鬥陣(物理)", "1906760": "卡洛斯鬥陣(物理)時間延長{{value}}", "1906770": "減輕物理&特殊傷害時間延長{{value}}", "1906780": "招式後場地減輕物理&特殊傷害{{value}}", "1906830": "首次拍組招式後變成淨空領域&淨空領域時間延長{{value}}", "1906860": "首次攻擊時變成青草場地&青草場地時間延長{{value}}", "2101020": "下雨時 要害無效G", "2101030": "惡顏領域時 要害無效G", "2101040": "冰柱領域時 要害無效G", "2101050": "帕底亞 鬥陣(防禦)時 要害無效G", "2101060": "精神場地時 擊中要害無效", "2101070": "擊中要害無效G", "2101080": "對手 毒傷害場地時 擊中要害無效G", "2101090": "場地招式 計量槽加速時 擊中要害無效G", "2101100": "合眾鬥陣(特殊) 時擊中要害 無效G", "2101110": "岩石領域時 擊中要害無效G", "2101120": "鬥陣時擊中要害 無效G", "2101130": "淨空領域時 擊中要害無效G", "2101160": "龍之領域時擊中要害無效G", "2201010": "異常機率 提升{{value}}", "2201020": "妨害機率 提升{{value}}", "2201030": "下降機率 提升{{value}}", "2201040": "擊中要害時 妨害率提升{{value}}", "2201060": "異常&妨害 機率提升{{value}}", "2201070": "下降機率& 效果2倍", "2301010": "沙暴時 特防提升", "2301020": "冰雹時 防禦提升", "2301030": "精神場地時 特防提升", "2301040": "沙暴無效& 防禦特防提升", "2301050": "HP一半以上 攻擊提升{{value}}", "2301060": "寶可夢招式 全體化", "2301070": "拍招後 寶可夢招式 全體化", "2301090": "HP減半時 防禦特防 提升{{value}}", "2301100": "冰雹時 防禦特防提升", "2301110": "天氣變化時 5種能力提升", "2301120": "變化招式時 能力提升 全體化{{value}}", "2301130": "拍招全體化", "2301140": "極巨招式 全體化", "2301150": "我方 場地效果時 5種能力提升{{value}}", "2301160": "HP減少時 特攻提升{{value}}", "2301170": "招式及 極巨招式 全體化", "2301180": "對手中寶可夢 變化招式 下降G{{value}}", "2301190": "晴天時 攻擊↑{{value}}", "2301200": "電氣場地時 特攻↑{{value}}", "2301220": "招式及拍招 攻擊全體化", "2301230": "拍組太晶化中5種能力↑{{value}}", "2401110": "超能力屬性 防守", "2401200": "龍屬性防守G", "2401210": "火屬性防守G", "2401220": "水屬性防守G", "2401240": "草屬性防守G", "2804010": "伽勒爾的 耀眼王牌", "2804020": "關都的 耀眼傳說", "2804030": "洗翠的 耀眼珍珠", "2804040": "洗翠的 寶可夢馴化師", "3201110": "Let's Go!伊布!", "3201370": "Let's Go!皮卡丘!", "3201410": "Music Start!", "3201580": "唔啊啊啊啊～～～!!!", "3201590": "請等一下!", "3201910": "劇毒哪怕是一丁點也會構成威脅!", "3202010": "進化戰士!", "3202020": "點燃鬥志喚醒腦細胞!", "3202030": "趕緊存在腦海的資料夾吧~!", "3202050": "夯到不行的 潮女的美貌", "3202070": "毒行人生,毒奏舞台!", "3202100": "喜歡玩相機 的旅人", "3202110": "梳得強韌 又美麗的造型", "3202120": "黑曜原野 的場長", "3301050": "首次上場時 草屬性 拍組太晶化", "3301070": "首次上場時 格鬥屬性 拍組太晶化", "3301080": "首次上場時 拍組毒太晶化", "3301130": "首次上場時 拍組岩石太晶化", "3301150": "首次上場時 拍組龍太晶化", "3301160": "首次上場時 拍組惡太晶化", "5130206": "非變化時 招式及拍招 傷害↓{{value}}", "5130207": "非異常時 招式及拍招 傷害↓{{value}}", "5130212": "非不利變化時寶可夢/拍組招式傷害↓{{value}}", "5170401": "打倒對手時 下次必中要害", "5210101": "非異常時 要害無效", "9901040": "AR系統", "9901120": "水屬性防守& 下雨時HP回復", "9901210": "內蘊鬥志 水變幻", "9901220": "嚴以律己 惡變幻", "9901450": "曲目: 超能力", "9901451": "曲目: 格鬥", "9901480": "戰術:注重攻擊", "9901500": "快為我加油打打氣~!", "9901510": "驚爆幻影!", "9901550": "還有剩,儘管吃!", "9901580": "是在這邊點餐嗎?", "9901730": "大～幅成長吧!", "9901790": "在阿羅拉大家都是好朋友!", "9901840": "你要夾著尾巴逃回家去了!", "9901930": "DJ惡事的頻率 ", "9901970": "180度大轉向的發展", "9901980": "站到最後屹立不搖的才是勝者!!", "9902010": "冠軍時刻!", "9902050": "一日入毒，終身為毒!", "9902070": "掀起猛烈的沙暴吧!", "9902090": "硬梆梆的喔～!", "9902460": "我沒有失去戰意……!", "9902480": "雪上加霜,禍不單行", "9902540": "極巨化･伸展台", "9902560": "我活力十足喔~!", "9902570": "生命力爆發!!", "9902730": "高風險･高回報", "9902740": "擲骰難收!", "9902750": "閃耀銀色光芒 的靈魂", "9902760": "漩渦捲湧的 暴風雨", "9902770": "翱翔深海的 銀色翅膀", "9902780": "療癒心靈 的美麗", "9902790": "漣漪鎮 的回憶", "9902800": "金色的 正直之心", "9902810": "永不消逝 的彩虹", "9902820": "呼喚幸福的 七彩翅膀", "9902830": "來做有趣 的事吧!", "9902840": "Let’s  度假!", "9902850": "適合出遊 的好日子", "9902990": "充滿活力的 笑容之光輝", "9903000": "與岩石屬性 並肩作戰 的記憶", "9903010": "伽勒爾王牌的 致勝絕招", "9903020": "靜默無聲的 鬥志之光輝", "9903030": "四溢而出的 龍之氣場", "9903040": "活生生的傳奇 之直覺", "9903050": "平息對戰 的幫手", "9903060": "侵蝕靈魂 的空間", "9903070": "深謀遠慮的 首領的決斷", "9903080": "對創造神的 心醉著迷", "9903090": "毀壞的 異常氣息", "9903100": "沒有天地之分 的世界", "9903110": "對戰愛好者 掀起的旋風", "9903120": "白英雄響起的 雷鳴", "9903130": "黑英雄帶來的 豐收", "9903140": "更迭季節的 化身", "9903200": "大吾(偵探)的全心全意", "9903210": "美極套裝竹蘭(異裝2)的全力以赴", "9903240": "N(2022夏季)的全力以赴", "9903270": "莉莉艾(2024冬季)的全力以赴", "9903280": "阿馴(英雄)的全神貫注", "9903290": "小優(修行套裝)的全心全意", "9903330": "哪裡還有時間 慢慢數啊!", "9903350": "120號道路的回憶", "9903370": "按下快門的 好機會!", "9903380": "就這樣 繼續保持……!", "9903390": "我要又壞又可 愛地出招囉!", "9903400": "我要惡作劇囉~!", "9903470": "沸､騰､起､來､了!", "9903490": "2馬赫的上進心", "9903570": "兩個世界交錯 重疊的地方", "9903580": "一口氣解決吧!", "9903590": "要害在哪啊!", "9903670": "引領鬥志 的力量", "9903680": "快如閃電 的一踢", "9903730": "好~啊球~!", "9903740": "我要開始上色了!", "9903750": "盡聽我意!", "9903830": "進攻進攻再進攻!", "9903840": "換個造型吧!", "9903890": "會稍~微有點搖晃喔", "9903930": "來吧!慶典時間到!", "9903970": "特大的感謝!", "9904090": "閃光燈要閃囉!", "9904100": "調高快門速度!" } });
  const POMATOOLS_MOVE_ABBR = Object.freeze({ "en": { "567": "Trick or Treat", "580": "Grassy-T", "604": "Electric-T", "640": "Psychic-T", "4041": "Topaz TB", "4042": "Emerald TB", "4043": "Lazulite TB", "4044": "Rutile TB", "4045": "Amethyst TB", "4046": "Spinel TB", "4047": "Ametrine TB", "4048": "Dioptase TB", "4049": "Lazurite TB", "4050": "Rainbow Jewel TB", "4051": "Green Jasper TB", "6000": "O Volt Tackle", "6001": "BB Thunderbolt", "6002": "S Aura Sphere", "6003": "U Dazzling Gleam", "6004": "R Noble Roar", "6005": "B Quick Attack", "6006": "T Double Team", "6007": "P Diamond Storm", "6008": "H Hydro Pump", "6009": "V Cross Poison", "6010": "F Fiery Wrath", "6011": "R Thunderous Kick", "6012": "I Freezing Glare", "6013": "B Leer", "6014": "T Night Slash", "6015": "W Electroweb", "6016": "SD Protect", "6017": "U Swords Dance", "6018": "N Psycho Cut", "6019": "RS Razor Leaf", "6020": "D Ice Beam", "6021": "P Surf", "6022": "C Triple Axel", "6023": "S Breaking Swipe", "6024": "R Double Shock", "6025": "FW Ice Beam", "6026": "TW Roost", "6027": "FW Flare Blitz", "6029": "W Howl", "6030": "C Earthquake", "6031": "TP Ceaseless Edge", "6032": "B Triple Arrows", "6033": "G Bulldoze", "6034": "S Draining Kiss", "6035": "F Sludge Wave", "6036": "SE Overdrive", "6037": "A X-Scissor", "6038": "G Frenzy Plant", "6039": "B Relic Song", "6040": "DB Outrage", "6041": "FB Stun Spore", "6042": "SF Mind Blown", "6043": "AZI Avalanche", "6044": "UB Zap Cannon", "6045": "P Fleur Cannon", "6046": "H Belch", "6047": "FS Icicle Crash", "6048": "D Hypnosis", "6049": "B Mortal Spin", "6050": "M Rock Slide", "6051": "H Headlong Rush", "6052": "M Bitter Malice", "6053": "M Metronome", "6054": "E Stored Power", "6055": "S Megahorn", "6056": "M Bullet Punch", "6057": "R Mud Slap", "6058": "SH Gigaton Hammer", "6059": "EC Fake Tears", "6060": "N Blast Burn", "6061": "A Confuse Ray", "6062": "BG Bleakwind Storm", "6063": "WL Sacred Sword", "6064": "BS Hyper Drill", "6065": "B Flame Wheel", "6066": "PS Shell Side Arm", "6067": "CC Chilly Reception", "6068": "DS Spore", "6069": "SH Shadow Ball", "6070": "S Ominous Wind", "6071": "P Shell Side Arm", "6072": "BB Jaw Lock", "6073": "G Rock Tomb", "6074": "N Meteor Beam", "6075": "F Play Rough", "6076": "AR Earthquake", "6077": "AF Bullet Punch", "6078": "AR Hyper Beam", "6079": "P Make It Rain", "6080": "AO Sunsteel Strike", "6081": "FB Hydro Cannon", "6082": "P Kowtow Cleave", "6083": "Liquidation D", "6084": "T Shadow Ball", "6085": "Blizzard CI", "6086": "RF lames Hex", "6087": "DL Wild Charge", "6088": "B Icy Wind", "6089": "Psychic LoD", "6090": "Rage Fist F", "6091": "A Fire Blast", "6092": "SN Disarming Voice", "6093": "BS Leech Life", "6094": "G Swallow", "6095": "G Crunch", "6096": "E Mystical Fire", "6097": "CP Smog", "6098": "Glare BS", "6099": "DH Iron Head", "6100": "A Cotton Spore", "6101": "E Pyro Ball", "6102": "S Drum Beating", "6103": "HP Snipe Shot", "6106": "B Seed Flare", "6107": "PoF Energy Ball", "6108": "GS Headlong Rush", "6109": "R Precipice Blades", "6110": "B Origin Pulse", "6111": "AO Night Daze", "6112": "TS Charm", "6113": "BF Behemoth Blade", "6114": "RF Sacred Fire", "6115": "L Dazzling Gleam", "6116": "GM Esper Wing", "6117": "SB Scale Shot", "6118": "PT Infernal Parade", "6119": "SS Steel Beam", "6120": "ES Shadow Ball", "6121": "AS Hyper Beam", "6122": "SF Bug Buzz", "6123": "FC Thunderclap", "6124": "TC Wildbolt Storm", "6125": "R Focus Blast", "6126": "S Sunsteel Strike", "6127": "L Moongeist Beam", "6128": "SS Feather Dance", "6129": "A Sweet Scent", "6130": "T…… Dragon Hammer", "6131": "Feint Attack ◓", "6132": "Feint Attack ◒", "6133": "AS Aeroblast", "6134": "AS Sacred Fire", "6135": "PS Muddy Water", "6136": "S Solar Beam", "6137": "SS Mist", "6138": "HB Iron Defense", "6139": "RR Sunny Day", "6140": "B Blizzard", "6142": "S Dragon Claw", "6143": "TS Outrage", "6144": "M Quick Attack", "6145": "IL Hex", "6146": "G Hyper Beam", "6147": "DW Shadow Force", "6148": "HW Bleakwind Storm", "6149": "M Wildbolt Storm", "6150": "PA Sandsear Storm", "6151": "F Rock Smash", "6152": "P Rock Slide", "6153": "S Victory Dance", "6154": "TF Protect", "6155": "CnB Fake Tears", "6156": "DF Flare Blitz", "6157": "HF Aqua Tail", "6158": "S Hurricane", "6159": "A Air Slash", "6160": "D Iron Defense", "6161": "D High Horsepower", "6162": "AZ Ice Burn", "6163": "SS Psyblade", "6164": "C Malignant Chain", "6165": "SS Overheat", "6166": "S Wood Hammer", "6167": "T Glaive Rush", "6168": "B Chloroblast", "6169": "B Order Up", "6170": "S Spirit Shackle", "6171": "DK Slash", "6172": "A Rock Slide", "6173": "A Stone Edge", "6174": "A Bubble Beam", "6175": "A Hydro Pump", "6176": "BB Play Rough", "6177": "PC Earth Power", "6178": "E Thunderbolt", "6179": "O Thunder", "6180": "G Thunder", "6181": "I False Surrender", "6182": "I Calm Mind", "6183": "L Ivy Cudgel", "6184": "K Tera Starstorm", "6185": "A Aura Sphere", "6186": "A Rock Smash", "6187": "A Psybeam", "6188": "A Psychic", "6189": "EE Zen Headbutt", "6190": "B Steel Wing", "95700": "Plant Power Bug Beam" }, "fr": { "2": "Poing Karaté", "8": "Poing Glace", "9": "Poing Éclair", "40": "Dard Venin", "41": "Double Dard", "42": "Dard Nuée", "53": "Lance Flammes", "71": "Vol Vie", "76": "Lance Soleil", "78": "Para Spore", "86": "Cage Éclair", "87": "Fatal Foudre", "88": "Jet Pierres", "98": "Vive Attaque", "202": "Giga Sangsue", "238": "Coup Croix", "249": "Éclate Roc", "280": "Casse Brique", "295": "Lumi Éclat", "297": "Danse Plume", "319": "Strido Son", "328": "Tourbi Sable", "338": "Végé Attaque", "342": "Queue Poison", "354": "Psycho Boost", "359": "Marto Poing", "400": "Tranche Nuit", "404": "Plaie Croix", "406": "Draco Choc", "407": "Draco Charge", "412": "Éco Sphère", "418": "Pisto Poing", "429": "Miroi Tir", "432": "Anti Brume", "440": "Poison Croix", "453": "Aqua Jet", "459": "Hurle Temps", "460": "Spatio Rift", "479": "Anti Air", "534": "Coqui Lame", "546": "Techno Buster", "596": "Pico Défense", "609": "Frotte Frimousse", "615": "Myria Vagues", "619": "Draco Ascension", "641": "Furie Bond", "652": "Bec Canon", "654": "Draco Marteau", "663": "Aqua Brèche", "670": "Coup Varia Type", "672": "Clepto Mânes", "720": "Caboche Kaboum", "751": "Draco Flèches", "4041": "TE topaze", "4042": "TE émeraude", "4043": "TE lazulite", "4044": "TE rutile", "4045": "TE améthyste", "4046": "TE spinelle", "4047": "TE amétrine", "4048": "TE dioptase", "4049": "TE lazurite", "4050": "TE pierre arc-en-ciel", "4051": "TE jaspe vert", "6000": "Électacle S", "6001": "Tonnerre S", "6002": "Aurasphère S", "6003": "Éclat Magique S", "6004": "Râle Mâle S", "6005": "Vive Attaque S", "6006": "Reflet S", "6007": "Orage Adamantin S", "6008": "Hydrocanon S", "6009": "Poison Croix S", "6010": "Fureur Ardente S", "6011": "Coup Fulgurant S", "6012": "Regard Glaçant S", "6013": "Groz'Yeux S", "6014": "Tranche Nuit S", "6015": "Toile Élek S", "6016": "Abri S", "6017": "Danse Lames S", "6018": "Coupe Psycho S", "6019": "Tranch'Herbe S", "6020": "Laser Glace S", "6021": "Surf S", "6022": "Triple Axel S", "6023": "Abattage S", "6024": "Double Décharge S", "6025": "Laser Glace S", "6026": "Atterrissage S", "6027": "Boutefeu S", "6028": "Giga Impact S", "6029": "Grondement S", "6030": "Séisme S", "6031": "Vagues à Lames S", "6032": "Triple Flèche S", "6033": "Piétisol S", "6034": "Vampibaiser S", "6035": "Cradovague S", "6036": "Overdrive S", "6037": "Plaie Croix S", "6038": "Végé-Attaque S", "6039": "Chant Antique S", "6040": "Colère S", "6041": "Para-Spore S", "6042": "Caboche Kaboum S", "6043": "Avalanche S", "6044": "★ Élecanon ★", "6045": "Canon Floral S", "6046": "Éructation S", "6047": "Chute Glace S", "6048": "Hypnose S", "6049": "Toupie Éclat S", "6050": "Éboulement S", "6051": "Assaut Frontal S", "6052": "Cœur de Rancœur S", "6053": "Métronome S", "6054": "Force Ajoutée S", "6055": "Mégacorne S", "6056": "Pisto Poing S", "6057": "Coud'Boue S", "6058": "Marteau Mastoc S", "6059": "Croco Larme S", "6060": "Rafale Feu S", "6061": "Onde Folie S", "6062": "Typhon Hivernal S", "6063": "Lame Sainte S", "6064": "Hyperceuse S", "6065": "Roue de Feu S", "6066": "Kokiyarme S", "6067": "Neigeux de Mots S", "6068": "Spore S", "6069": "Ball'Ombre S", "6070": "Vent Mauvais S", "6071": "Kokiyarme S", "6072": "Croque Fort S", "6073": "Tomberoche S", "6074": "Laser Météore S", "6075": "Câlinerie S", "6076": "Séisme S", "6077": "Pisto Poing S", "6079": "Ruée d'Or S", "6080": "Choc Météore S", "6081": "Hydroblast S", "6082": "Génusection S", "6083": "Aqua-Brèche S", "6084": "Ball'Ombre S", "6085": "Blizzard S", "6086": "Châtiment S", "6087": "Éclair Fou S", "6088": "Vent Glace S", "6089": "Psyko S", "6090": "Poing de Colère S", "6092": "Voix Enjôleuse S", "6093": "Vampirisme S", "6094": "Avale S", "6095": "Mâchouille S", "6096": "Feu Ensorcelé S", "6097": "Purédpois S", "6098": "Regard Médusant S", "6100": "Spore Coton S", "6101": "Ballon Brûlant S", "6102": "Tambour Battant S", "6103": "Tir de Précision S", "6104": "Nitro Crash E", "6105": "Turbo Volt V", "6106": "Fulmigraine S", "6107": "Éco-Sphère S", "6108": "Assaut Frontal S", "6109": "Lame Pangéenne S", "6110": "Onde Originelle S", "6111": "Explonuit S", "6112": "Charme S", "6113": "Gladius Maximus S", "6114": "Feu Sacré S", "6115": "Éclat Magique S", "6116": "Ailes Psycho S", "6117": "Rafale Écailles S", "6118": "Cortège Funèbre S", "6119": "Métalaser S", "6120": "Ball'Ombre S", "6121": "Ultralaser S", "6122": "Bourdon S", "6123": "Vif Éclair S", "6124": "Typhon Fulgurant S", "6125": "Exploforce S", "6126": "Choc Météore S", "6127": "Rayon Spectral S", "6128": "Danse Plumes S", "6129": "Doux Parfum S", "6130": "Draco Marteau S", "6131": "Feinte ◓", "6132": "Feinte ◒", "6133": "Aéroblast S", "6134": "Feu Sacré S", "6135": "Ocroupi S", "6136": "Lance-Soleil S", "6137": "Brume S", "6138": "Mur de Fer S", "6142": "Dracogriffe S", "6143": "Colère S", "6144": "Vive Attaque S", "6145": "Châtiment S", "6146": "Ultralaser S", "6147": "Revenant S", "6148": "Typhon Hivernal S", "6149": "Typhon Fulgurant S", "6150": "Typhon Pyrosable S", "6151": "Éclate-Roc flamboyant", "6152": "Éboulement S", "6154": "Abri S", "6155": "Croco Larme S", "6156": "Boutefeu S", "6157": "Hydro-Queue S", "6158": "Vent Violent sacré", "6159": "Lame d'Air céleste", "6160": "Mur de Fer dévoué", "6161": "Cavalerie Lourde ardente", "6162": "Feu Glacé S", "6163": "Lame Psychique S", "6164": "Chaîne Malsaine S", "6165": "Surchauffe S", "6166": "Martobois S", "6167": "Charge Glaive S", "6168": "Herblast S", "6169": "Plat du Jour S", "6170": "Tisse Ombre S", "6171": "Tranche S", "6172": "Éboulement S", "6173": "Lame de Roc S", "6174": "Bulles S", "6175": "Hydrocanon S", "6176": "Câlinerie S", "6177": "Telluriforce S", "6178": "Tonnerre S", "6179": "Fatal-Foudre S", "6180": "Fatal-Foudre G", "6181": "Fourbette S", "6182": "Plénitude S", "6183": "Massue Liane S", "6184": "Pluie Térastrale S", "6185": "Aurasphère S", "6186": "Éclate-Roc S", "6187": "Rafale Psy S", "6188": "Psyko S", "6189": "Psykoud'Boul S", "6190": "Ailes d'Acier S", "7000": "Récolte G Max", "7001": "Hantise G Max", "7040": "Sentence G Max", "7041": "Multicoup G Max", "7042": "Foudre G Max", "7043": "Téphra G Max", "7044": "Résonance G Max", "7045": "Percussion G Max", "7046": "Foudre G Max", "7047": "Fournaise G Max", "7048": "Pestilence G Max", "7049": "Percée G Max", "7050": "Pyroball G Max" }, "de": { "2": "Karateschl.", "9": "Donnerschl.", "38": "Risikotack.", "65": "Bohrschn.", "78": "Stachelsp.", "84": "Donnerscho.", "94": "Psychokin.", "98": "Ruckzuckh.", "103": "Kreideschr.", "129": "Sternsch.", "137": "Schlangenbl.", "138": "Traumfr.", "178": "Baumwolls.", "181": "Pulverschn.", "182": "Schutzsch.", "209": "Funkenspr.", "231": "Eisenschw.", "234": "Morgengr.", "249": "Zertrümmer.", "297": "Daunenreig.", "306": "Zermalmkl.", "307": "Lohekanon.", "308": "Aquahaub.", "322": "Kosmik Kraft", "325": "Finsterfau.", "337": "Drachenkl.", "338": "Flora Statue", "394": "Flammenbl.", "405": "Käfergebr.", "408": "Juwelenkr.", "418": "Patronenh.", "425": "Schattenst.", "427": "Psychokl.", "428": "Zen Kopfstoß", "429": "Spiegelsal.", "437": "Blätterst.", "442": "Eisensch.", "462": "Quetschgr.", "469": "Rundumsch.", "529": "Schlagboh.", "533": "Sanctokl.", "543": "Steinsch.", "548": "Mystoschw.", "556": "Eiszapfh.", "557": "V Generator", "565": "Stachelf.", "566": "Phantomkr.", "568": "Kampfgebr.", "570": "Paraboll.", "572": "Blütenw.", "574": "Säuselst.", "588": "Königssch.", "592": "Dampfschw.", "593": "Dimensions.", "594": "Wasser Shuriken", "596": "Schutzst.", "605": "Zaubersch.", "609": "Wangenrubb.", "612": "Steigerung.", "613": "Unheilssch.", "617": "Ursprungsw.", "618": "Abgrundskl.", "619": "Zenitstürm.", "624": "Schattenf.", "626": "Schaumser.", "629": "Pferdest.", "643": "Überhebl.", "649": "Sanktionsk.", "652": "Schnabelk.", "653": "Schuppenr.", "654": "Drachenham.", "658": "Kanonenb.", "660": "Fruststamp.", "661": "Schattenkn.", "663": "Aquadurchs.", "664": "Prisma Laser", "665": "Stahlgest.", "666": "Schattenst.", "668": "Elektropik.", "670": "Multi Angriff", "672": "Diebessch.", "744": "Dynamax Kanone", "745": "Präzisionss.", "751": "Drachenpf.", "778": "Trommelschl.", "781": "Gigantenh.", "782": "Gigantenst.", "794": "Sternenst.", "799": "Schuppens.", "800": "Meteorstr.", "818": "Trefferschw.", "824": "Blizzard Lanze", "826": "Schauderspr.", "838": "Schmetterr.", "840": "Auraschw.", "841": "Niedertr.", "843": "Drillingspf.", "844": "Phantomp.", "845": "Klingenschw.", "866": "Letalwirb.", "869": "Kniefallsp.", "888": "Doppelstr.", "890": "Rüstungsk.", "893": "Riesenham.", "906": "Tera Sternhagel", "4041": "TA Topas", "4042": "TA Smaragds", "4043": "TA Lazuliths", "4044": "TA Rutils", "4045": "TA Amethysts", "4046": "TA Spinells", "4047": "TA Ametrins", "4048": "TA Dioptas", "4049": "TA Lasurits", "4050": "TA Regenbogenjuwels", "4051": "TA Jaspis", "6000": "Volttackle S", "6001": "Donnerblitz S", "6002": "Aurasphäre S", "6003": "Zaubersch. S", "6004": "Kampfgebr. S", "6005": "Ruckzuckh. S", "6006": "Doppelteam S", "6007": "Diamantst. S", "6008": "Hydropumpe S", "6009": "Giftstreich S", "6010": "Brennender Zorn S", "6011": "Donnernder Tritt S", "6012": "Eisiger Blick S", "6013": "Silberbl. S", "6014": "Nachthieb S", "6015": "Elektronetz S", "6016": "Schutzsch. S", "6017": "Schwerttanz S", "6018": "Psychokl. S", "6019": "Rasierblatt S", "6020": "Eisstrahl S", "6021": "Surfer S", "6022": "Dreifach-Axel S", "6023": "Breitseite S", "6024": "Zweifachl. S", "6025": "Eisstrahl S", "6026": "Ruheort S", "6027": "Flammenbl. S", "6028": "Gigastoß G", "6029": "Jauler S", "6030": "Erdbeben S", "6031": "Klingenschw. S", "6032": "Drillingspf. S", "6033": "Dampfwalze S", "6034": "Diebeskuss S", "6035": "Hochgefühls S", "6036": "Overdrive S", "6037": "Kreuzschere S", "6038": "Flora Statue S", "6039": "Urgesang S", "6040": "Wutanfall S", "6041": "Stachelsp. S", "6042": "Knallkopf S", "6043": "Lawine S", "6044": "Blitzkanone S", "6045": "Kanonenb. S", "6046": "Rülpser S", "6047": "Eiszapfh. S", "6048": "Hypnose S", "6049": "Letalwirb. S", "6050": "Steinhagel S", "6051": "Schmetterr. S", "6052": "Niedertr. S", "6053": "Metronom S", "6054": "Kraftvorrat S", "6055": "Vielender S", "6056": "Patronenh. S", "6057": "Lehmschelle S", "6058": "Riesenham. S", "6059": "Trugträne S", "6060": "Lohekanon. S", "6061": "Konfustrahl S", "6062": "Polarorkan S", "6063": "Sanctokl. S", "6064": "Hyperbohrer S", "6065": "Flammenrad S", "6066": "Muschelw. S", "6067": "Eisige Stimm. S", "6068": "Pilzspore S", "6069": "Spukball S", "6070": "Unheilböen S", "6071": "Muschelw. S", "6072": "Fesselbiss S", "6073": "Felsgrab S", "6074": "Meteorstr. der Leere", "6075": "Knuddler S", "6076": "Erdbeben S", "6077": "Patronenh. S", "6078": "Hyperstrahl S", "6079": "Goldrausch S", "6080": "Stahlgest. S", "6081": "Aquahaub. S", "6082": "Kniefallsp. S", "6083": "Aquadurchs. S", "6084": "Spukball S", "6085": "Blizzard S", "6086": "Bürde S", "6087": "Stromstoß S", "6088": "Eissturm S", "6089": "Psychokin. S", "6090": "Zornesfaust S", "6091": "Feuersturm S", "6092": "Säuselst. S", "6093": "Blutsauger S", "6094": "Verzehrer S", "6095": "Knirscher S", "6096": "Magieflamme S", "6097": "Smog S", "6098": "Schlangenbl. S", "6099": "Eisensch. S", "6100": "Baumwolls. S", "6101": "Feuerball S", "6102": "Trommelschl. S", "6103": "Präzisionss. S", "6104": "Kollisionsk. K", "6105": "Blitztour P", "6106": "Schocksamen S", "6107": "Energieball S", "6108": "Schmetterr. S", "6109": "Abgrundskl. S", "6110": "Ursprungsw. S", "6111": "Nachtflut S", "6112": "Charme S", "6113": "Gigantenh. S", "6114": "Läuterfeuer S", "6115": "Zaubersch. S", "6116": "Auraschw. S", "6117": "Schuppens. S", "6118": "Phantomp. S", "6119": "Stahlstrahl S", "6120": "Spukball S", "6121": "Hyperstrahl S", "6122": "Käfergebrumm S", "6123": "Sturmblitz S", "6124": "Donnerorkan S", "6125": "Fokusstoß S", "6126": "Stahlgest. S", "6127": "Schattenst. S", "6128": "Daunenreig. S", "6129": "Lockduft S", "6130": "Drachenham. S", "6131": "Finte ◓", "6132": "Finte ◒", "6133": "Luftstoß S", "6134": "Läuterfeuer S", "6135": "Lehmbrühe S", "6136": "Solarstrahl S", "6137": "Weißnebel S", "6138": "Eisenabwehr S", "6139": "Sonnentag S", "6140": "Blizzard S", "6142": "Drachenkl. S", "6143": "Wutanfall S", "6144": "Ruckzuckh. S", "6145": "Bürde S", "6146": "Hyperstrahl S", "6147": "Schemenkraft S", "6148": "Polarorkan S", "6149": "Donnerorkan S", "6150": "Wüstenorkan S", "6151": "Zertrümmer. S", "6152": "Steinhagel S", "6153": "Siegestanz S", "6154": "Schutzsch. S", "6155": "Trugträne S", "6156": "Flammenbl. S", "6157": "Nassschweif S", "6158": "Orkan S", "6159": "Luftschnitt S", "6160": "Eisenabwehr S", "6161": "Pferdestärke S", "6162": "Frosthauch S", "6163": "Psychoschneide S", "6164": "Giftkettung S", "6165": "Hitzekoller S", "6166": "Holzhammer S", "6167": "Großklingenstoß S", "6168": "Chlorostrahl S", "6169": "Auftischen S", "6170": "Schattenf. S", "6171": "Schlitzer S", "6172": "Steinhagel S", "6173": "Steinkante S", "6174": "Blubbstrahl S", "6175": "Hydropumpe S", "6176": "Knuddler S", "6177": "Erdkräfte S", "6178": "Donnerblitz S", "6179": "Donner S", "6180": "Donner S+", "6181": "Kniefalltrick S", "6182": "Gedankengut S", "6183": "Rankenkeule S", "6184": "Tera Sternhagel S", "6185": "Aurasphäre S", "6186": "Zertrümmer. S", "6187": "Psystrahl S", "6188": "Psychokin. S", "6189": "Zen-Kopfstoß S", "6190": "Stahlflügel S", "7000": "Giga Recycling", "7001": "Giga Spuksperre", "7002": "Unendynast.", "7003": "Dyna Angriff", "7005": "Dyna Faust", "7007": "Dyna Düse", "7008": "Dyna Düse", "7009": "Dyna Giftschwall", "7010": "Dyna Giftschwall", "7011": "Dyna Erdstoß", "7012": "Dyna Erdstoß", "7013": "Dyna Brocken", "7016": "Dyna Schwarm", "7018": "Dyna Spuk", "7019": "Dyna Stahlzacken", "7021": "Dyna Brand", "7022": "Dyna Brand", "7024": "Dyna Flut", "7025": "Dyna Flora", "7026": "Dyna Flora", "7027": "Dyna Gewitter", "7028": "Dyna Gewitter", "7030": "Dyna Kinese", "7033": "Dyna Wyrm", "7034": "Dyna Wyrm", "7038": "Dyna Zauber", "7039": "Dyna Wall", "7040": "Giga Sanktion", "7041": "Giga Multihieb", "7042": "Giga Blitzhagel", "7043": "Giga Schlacke", "7044": "Giga Melodie", "7045": "Giga Getrommel", "7046": "Giga Blitzhagel", "7047": "Giga Feuerflug", "7048": "Giga Gestank", "7049": "Giga Stahlschlag", "7050": "Giga Brandball", "7051": "Giga Voltschlag", "7052": "Giga Feuerkessel", "7053": "Giga Feuerkessel", "7054": "Giga Gähnzwang", "8011": "Kraftres.", "8201": "Kanto Analyse", "8204": "Johto Analyse", "8207": "Hoenn Analyse", "8212": "Einalls Leidensch.", "8213": "Einall Analyse", "8219": "Alola Analyse", "8222": "Galar Analyse", "8225": "Paldea Analyse", "19020": "X-Vert.", "19021": "X-Vert. (Team)", "19023": "X-Vert.+ (Team)", "19053": "X Tempo+ (Team)", "19100": "Attackenl. auffüllen", "19170": "Energiek.", "19510": "Normalst.", "19630": "Gesteinsst.", "19640": "Geisterst.", "19650": "Drachenst.", "19660": "Unlichtst.", "19700": "Pflanzenst.", "19720": "Psycho Gebet", "30100": "Normal- Gefährtenstoß", "30200": "Feuer- Gefährtenstoß", "30300": "Wasser- Gefährtenstoß", "30400": "Elektro- Gefährtenstoß", "30500": "Pflanzen- Gefährtenstoß", "30600": "Eis- Gefährtenstoß", "30700": "Kampf- Gefährtenstoß", "30800": "Gift- Gefährtenstoß", "30900": "Boden- Gefährtenstoß", "31000": "Flug- Gefährtenstoß", "31100": "Psycho- Gefährtenstoß", "31200": "Käfer- Gefährtenstoß", "31300": "Gesteins- Gefährtenstoß", "31400": "Geister- Gefährtenstoß", "31500": "Drachen- Gefährtenstoß", "31600": "Unlicht- Gefährtenstoß", "31700": "Stahl- Gefährtenstoß", "31800": "Feen- Gefährtenstoß", "40100": "Normal- Gefährtenstrahl", "40200": "Feuer- Gefährtenstrahl", "40300": "Wasser- Gefährtenstrahl", "40400": "Elektro- Gefährtenstrahl", "40500": "Pflanzen- Gefährtenstrahl", "40600": "Eis- Gefährtenstrahl", "40700": "Kampf- Gefährtenstrahl", "40800": "Gift- Gefährtenstrahl", "40900": "Boden- Gefährtenstrahl", "41000": "Flug- Gefährtenstrahl", "41100": "Psycho- Gefährtenstrahl", "41200": "Käfer- Gefährtenstrahl", "41300": "Gesteins- Gefährtenstrahl", "41400": "Geister- Gefährtenstrahl", "41500": "Drachen- Gefährtenstrahl", "41600": "Unlicht- Gefährtenstrahl", "41700": "Stahl- Gefährtenstrahl", "41800": "Feen- Gefährtenstrahl", "85100": "Wasserstrahl der glorreichen Zukunft" }, "es": { "4041": "Tera Topacio", "4042": "Tera Esmeralda", "4043": "Tera Lazulita", "4044": "Tera Rutilo", "4045": "Tera Amatista", "4046": "Tera Espinela", "4047": "Tera Ametrino", "4048": "Tera Dioptasa", "4049": "Tera Lazurita", "4050": "Tera Gema Irisada", "4051": "Tera Jaspe Verde", "6000": "Placaje Eléctrico O", "6001": "Rayo A", "6002": "S Esfera Aural", "6003": "Brillo Mágico A", "6004": "Rugido de Guerra S", "6005": "Ataque Rápido E", "6006": "Doble Equipo S", "6007": "Tormenta de Diamantes R", "6008": "Hidrobomba S", "6009": "Veneno X D", "6010": "Furia Candente F", "6011": "Patada Relámpago C", "6012": "Mirada Heladora I", "6013": "Malicioso V", "6014": "Tajo Umbrío B", "6015": "Electrotela S", "6016": "Protección O", "6017": "Danza Espada I", "6018": "Psicocorte J", "6019": "Hoja Afilada T", "6020": "Rayo Hielo de Alas Gélidas", "6021": "Surf P", "6022": "Triple Axel A", "6023": "Vasto Impacto I", "6024": "Electropalmas ATM", "6025": "Rayo Hielo AG", "6026": "Respiro AT", "6027": "Envite Ígneo AA", "6028": "Giga Impacto T", "6029": "Aullido C", "6030": "Terremoto T", "6031": "Tajo Metralla P", "6032": "Triple Flecha LE", "6033": "Terratemblor R", "6034": "Beso Drenaje A", "6035": "Onda Tóxica D", "6036": "Amplificador ET", "6037": "Tijera X A", "6038": "Planta Feroz G", "6039": "Canto Arcaico I", "6040": "Enfado A", "6041": "Paralizador MA", "6042": "Cabeza Sorpresa LE", "6043": "Alud G", "6044": "Electrocañón BB", "6045": "Cañón Floral P", "6046": "Eructo D", "6047": "Chuzos C", "6048": "Hipnosis O", "6049": "Giro Mortífero F", "6050": "Avalancha C", "6051": "Arremetida N", "6052": "Rencor RR", "6053": "Metrónomo E", "6054": "Poder Reserva E", "6055": "Megacuerno E", "6056": "Puño Bala A", "6057": "Bofetón Lodo C", "6058": "Martillo Colosal F", "6059": "Llanto Falso H", "6060": "Anillo Ígneo F", "6061": "Rayo Confuso C", "6062": "Vendaval Gélido A", "6063": "Espada Santa A", "6064": "Hipertaladro M", "6065": "Rueda Fuego A", "6066": "Moluscañón V", "6067": "Fría Acogida R", "6068": "Espora S", "6069": "Bola Sombra CE", "6070": "Viento Aciago L", "6071": "Moluscañón V", "6072": "Presa Maxilar R", "6073": "Tumba Rocas G", "6074": "Rayo Meteórico V", "6075": "Carantoña A", "6076": "Terremoto PC", "6077": "Puño Bala RC", "6078": "Hiperrayo BC", "6079": "Fiebre Dorada I", "6080": "Meteoimpacto DT", "6081": "Hidrocañón T", "6082": "Genufendiente E", "6083": "Hidroariete M", "6084": "Bola Sombra E", "6085": "Ventisca M", "6086": "Infortunio V", "6087": "Voltio Cruel C", "6088": "Viento Hielo A", "6089": "Psíquico A", "6090": "Puño Furia S", "6091": "Llamarada FC", "6092": "Voz Cautivadora C", "6093": "Chupavidas E", "6094": "Tragar D", "6095": "Triturar V", "6096": "Llama Embrujada A", "6097": "Polución A", "6098": "Deslumbrar A", "6099": "Cabeza de Hierro A", "6100": "Esporagodón F", "6101": "Balón Ígneo E", "6102": "Batería Asalto A", "6103": "Disparo Certero AP", "6104": "Nitrochoque E", "6105": "Electroderrape P", "6106": "Fogonazo F", "6107": "Energibola R", "6108": "Arremetida A", "6109": "Filo del Abismo R", "6110": "Pulso Primigenio A", "6111": "Pulso Noche NC", "6112": "Encanto E", "6113": "Tajo Supremo HA", "6114": "Fuego Sagrado LI", "6115": "Brillo Mágico C", "6116": "Ala Aural A", "6117": "Ráfaga Escamas P", "6118": "Marcha Espectral C", "6119": "Metaláser A", "6120": "Bola Sombra M", "6121": "Hiperrayo CC", "6122": "Zumbido S", "6123": "Relámpago Súbito E", "6124": "Electormenta C", "6125": "Onda Certera M", "6126": "Meteoimpacto H", "6127": "Rayo Umbrío S", "6128": "Danza Pluma T", "6129": "Dulce Aroma C", "6130": "Martillo Dragón T", "6131": "Finta ◓", "6132": "Finta ◒", "6133": "Aerochorro MC", "6134": "Fuego Sagrado AC", "6135": "Agua Lodosa E", "6136": "Rayo Solar L", "6137": "Neblina N", "6138": "Defensa Férrea R", "6139": "Día Soleado M", "6140": "Ventisca R", "6142": "Garra Dragón R", "6143": "Enfado E", "6144": "Ataque Rápido S", "6145": "Infortunio F", "6146": "Hiperrayo P", "6147": "Golpe Umbrío MO", "6148": "Vendaval Gélido I", "6149": "Electormenta E", "6150": "Simún de Arena O", "6151": "Golpe Roca F", "6152": "Avalancha P", "6154": "Protección PP", "6155": "Llanto Falso AyM", "6156": "Envite Ígneo LT", "6157": "Acua Cola P", "6158": "Vendaval TC", "6159": "Tajo Aéreo FC", "6160": "Defensa Férrea F", "6161": "Fuerza Equina F", "6162": "Llama Gélida <0", "6163": "Psicohojas A", "6164": "Cadena Virulenta P", "6165": "Sofoco S", "6166": "Mazazo R", "6167": "Asalto Espadón I", "6168": "Clorofiláser P", "6169": "Oído Cocina B", "6170": "Puntada Sombría C", "6171": "Cuchillada MD", "6172": "Avalancha PC", "6173": "Roca Afilada PC", "6174": "Rayo Burbuja PC", "6175": "Hidrobomba CC", "6176": "Carantoña C", "6177": "Tierra Viva P", "6178": "Rayo E", "6179": "Trueno P", "6180": "Trueno T", "6181": "Irreverencia R", "6182": "Paz Mental D", "6183": "Garrote Liana F", "6184": "Teraclúster M", "6185": "Esfera Aural PC", "6186": "Golpe Roca DC", "6187": "Psicorrayo CC", "6188": "Psíquico CC", "6189": "Cabezazo Zen P", "6190": "Ala de Acero N", "8219": "Análisis de Alola", "19001": "Minipoción M", "91900": "Rayo Gélido que Pone los Pelos de Punta", "93500": "Rayo Gélido que te Dejará Helado" }, "it": { "34": "Corposcon.", "35": "Avvolgibot.", "42": "Missispil.", "43": "Fulmisg.", "53": "Lanciafiam.", "71": "Assorbim.", "109": "Stordiragg.", "192": "Elettrocann.", "202": "Gigassorb.", "241": "Giornodi.", "243": "Specchiov.", "297": "Danzadip.", "298": "Strampada.", "325": "Pugnodomb.", "336": "Gridodilot.", "462": "Sbriciolma.", "466": "Funestove.", "479": "Abbattim.", "500": "Veicolaf.", "570": "Caricapar.", "572": "Fiortemp.", "577": "Assorbiba.", "591": "Diamant.", "593": "Forodim.", "598": "Elettromi.", "599": "Velenotr.", "609": "Elettroco.", "625": "Bracciote.", "652": "Cannonbe.", "653": "Clamorsq.", "657": "Gusciotr.", "662": "Rocciarap.", "665": "Astrocar.", "668": "Elettropizz.", "670": "Multiatt.", "746": "Morsostr.", "749": "Colpocatr.", "778": "Tamburatt.", "784": "Vastoimp.", "789": "Frantuman.", "792": "Sbarram.", "794": "Sfolgor.", "800": "Raggiomet.", "826": "Inquietant.", "878": "Turboschi.", "4041": "Terasc: topazio", "4042": "Terasc: smeraldo", "4043": "Terasc: lazulite", "4044": "Terasc: rutilo", "4045": "Terasc: ametista", "4046": "Terasc: spinello", "4047": "Teras: ametrino", "4048": "Teras: dioptasio", "4049": "Teras: lazurite", "4050": "Teras: astrogemma", "4051": "Teras: diaspro verde", "6000": "Locomov. S", "6001": "Fulmine S", "6002": "Forzasfera S", "6003": "Magibrillio S", "6004": "Urlo S", "6005": "Attacco Rapido S", "6006": "Doppioteam S", "6007": "Diamant. S", "6008": "Idropompa S", "6009": "Velenocroce S", "6010": "Furia Ardente S", "6011": "Calcio Tonante S", "6012": "Sguardo Gelido S", "6013": "Fulmisguardo S", "6014": "Nottesferza S", "6015": "Elettrotela S", "6016": "Protezione S", "6017": "Danzaspada S", "6018": "Psicotaglio S", "6019": "Foglielama S", "6020": "Geloraggio S", "6021": "Surf S", "6022": "Triplo Axel S", "6023": "Vastoimpatto S", "6024": "Doppiolampo S", "6025": "Geloraggio S", "6026": "Trespolo S", "6027": "Fuococarica S", "6028": "Gigaimpatto S", "6029": "Gridodilotta S", "6030": "Terremoto S", "6031": "Lama Milleflutti S", "6032": "Triplodardo S", "6033": "Battiterra S", "6034": "Assorbiba. S", "6035": "Fangonda S", "6036": "Overdrive S", "6037": "Forbice X S", "6038": "Radicalbero G", "6039": "Cantoantico S", "6040": "Oltraggio S", "6041": "Paralizzante S", "6042": "Sbalorditesta S", "6043": "Slavina S", "6044": "Elettrocann. ★", "6045": "Cannonfiore S", "6046": "Rutto S", "6047": "Scagliagelo S", "6048": "Ipnosi S", "6049": "Glitturbine S", "6050": "Frana S", "6051": "Scontro Frontale S", "6052": "Livore S", "6053": "Metronomo S", "6054": "Veicolaf. S", "6055": "Megacorno S", "6056": "Pugnoscarica S", "6057": "Fangosberla S", "6058": "Granmartello S", "6059": "Falselacrime S", "6060": "Incendio S", "6061": "Stordiraggio S", "6062": "Tempesta Boreale S", "6063": "Spadasolenne S", "6064": "Ipertrapano S", "6065": "Ruotafuoco S", "6066": "Armaguscio S", "6067": "Freddura S", "6068": "Spora S", "6069": "Palla Ombra S", "6070": "Funestove. S", "6071": "Armaguscio S", "6072": "Morsostr. S", "6073": "Rocciotomba S", "6074": "Raggiomet. S", "6075": "Carineria S", "6077": "Pugnoscarica S", "6078": "Iper Raggio celestiale", "6079": "Corsa all'Oro S", "6080": "Astrocar. S", "6081": "Idrocannone S", "6082": "Genufendente S", "6083": "Idrobreccia S", "6084": "Palla Ombra S", "6085": "Bora S", "6086": "Sciagura S", "6087": "Sprizzalampo S", "6088": "Ventogelato S", "6089": "Psichico S", "6090": "Pugno Furibondo S", "6091": "Fuocobomba S", "6092": "Incantavoce S", "6093": "Sanguisuga S", "6094": "Introenergia S", "6095": "Sgranocchio S", "6097": "Smog S", "6098": "Sguardo Feroce S", "6099": "Metaltestata S", "6100": "Cotonspora S", "6101": "Palla Infuocata S", "6102": "Tamburatt. S", "6103": "Tiromirato S", "6104": "Turboschi. scarlatto", "6106": "Infuriaseme benaug.", "6107": "Energipalla lussuregg.", "6108": "Scontro Frontale S", "6109": "Spade Telluriche S", "6110": "Primopulsar S", "6111": "Urtoscuro S", "6112": "Fascino S", "6113": "Taglio Maestoso S", "6114": "Magifuoco S", "6115": "Magibrillio S", "6116": "Ali d'Aura S", "6117": "Squamacolpo S", "6118": "Corteo Spettrale S", "6119": "Raggio d'Acciaio S", "6120": "Palla Ombra S", "6121": "Iper Raggio SS", "6122": "Ronzio S", "6123": "Saetta★S", "6124": "Tempesta Tonante S", "6125": "Focalcolpo S", "6126": "Astrocarica S", "6127": "Raggio d'Ombra S", "6128": "Danzadip. S", "6129": "Profumino S", "6130": "Marteldrago S", "6131": "Finta ◓", "6132": "Finta ◒", "6133": "Aerocolpo S", "6134": "Magifuoco S", "6135": "Fanghiglia S", "6136": "Solarraggio S", "6137": "Nebbia S", "6138": "Ferroscudo S", "6139": "Giornodi. S", "6140": "Bora S", "6142": "Dragartigli S", "6143": "Oltraggio S", "6144": "Attacco Rapido S", "6145": "Sciagura S", "6146": "Iper Raggio sontuoso", "6147": "Oscurotuffo S", "6148": "Tempesta Boreale S", "6149": "Tempesta Tonante S", "6150": "Tempesta Ardente S", "6151": "Spaccaroccia S", "6152": "Frana S", "6154": "Protezione S", "6155": "Falselacrime S", "6156": "Fuococarica S", "6157": "Idrondata S", "6158": "Tifone temporalesco", "6159": "Eterelama celeste", "6160": "Ferroscudo premuroso", "6161": "Forza Equina infervorata", "6162": "Vampagelida S", "6163": "Psicolama S", "6164": "Intossicatena S", "6165": "Vampata S", "6166": "Mazzuolegno S", "6167": "Spadoncarica S", "6168": "Clorofillaser S", "6169": "Alta Cucina S", "6170": "Cucitura d'Ombra S", "6171": "Lacerazione S", "6172": "Frana S", "6173": "Pietrataglio S", "6174": "Bollaraggio S", "6175": "Idropompa S", "6176": "Carineria S", "6177": "Geoforza S", "6178": "Fulmine S", "6179": "Tuono S", "6180": "Tuono G", "6181": "Supplicolpo S", "6182": "Calmamente S", "6183": "Clava di Liane S", "6184": "Teracluster S", "6185": "Sferapulsar S", "6186": "Spaccaroccia S", "6187": "Psicoraggio S", "6188": "Psichico S", "6189": "Cozzata Zen S", "6190": "Alacciaio S", "7000": "Gigarinn.", "7001": "Gigaill.", "7010": "Dynacorr.", "7021": "Dynafiamm.", "7022": "Dynafiamm.", "7039": "Dynabarr.", "7042": "Gigapikafol.", "19030": "Att. Sp. X", "19031": "Att. Sp. X-G", "19040": "Dif. Sp. X", "19041": "Dif. Sp. X-G", "19043": "Dif. Sp. X-G+", "19110": "Ricaricost.", "19111": "Ricaricost.-G", "19810": "Barrierifl.", "19830": "Specchiost.", "19850": "Effettosc." }, "ja": { "2": "からて チョップ", "7": "炎のパンチ", "8": "冷凍パンチ", "9": "雷パンチ", "14": "剣の舞", "25": "メガトン キック", "38": "すてみ タックル", "41": "ダブル ニードル", "42": "ミサイル ばり", "51": "溶解液", "53": "火炎放射", "55": "水鉄砲", "56": "ドロポン", "58": "冷凍 ビーム", "60": "サイケ光線", "61": "バブル光線", "63": "破壊光線", "65": "ドリル くちばし", "75": "はっぱ カッター", "76": "ソラビ", "83": "炎の渦", "84": "でんき ショック", "85": "10万 ボルト", "87": "雷", "94": "サイキネ", "95": "催眠術", "98": "電光石火", "104": "影分身", "105": "自己再生", "109": "怪しい光", "113": "光の壁", "122": "舌で なめる", "124": "ヘドロ攻撃", "129": "スピード スター", "136": "飛び膝蹴り", "147": "キノコの 胞子", "153": "大爆発", "161": "トラアタ", "172": "火炎車", "177": "エアロ ブラスト", "182": "守る", "188": "ヘド爆", "190": "オクタン砲", "196": "こごかぜ", "201": "砂嵐", "202": "ギガドレ", "210": "連続斬り", "211": "鋼の翼", "219": "神秘の守り", "221": "聖なる炎", "223": "爆裂パンチ", "225": "竜の息吹", "230": "あまい かおり", "231": "アイアン テール", "232": "メタル クロー", "234": "あさの ひざし", "235": "光合成", "236": "月の光", "238": "クロス チョップ", "243": "ミラコ", "246": "原始の力", "247": "シャドボ", "295": "ラスター パージ", "296": "ミスト ボール", "297": "フェザー ダンス", "298": "フラフラ ダンス", "299": "ブレイズ キック", "304": "ハイボ", "305": "どくどく の キバ", "306": "ブレイク クロー", "307": "ブラスト バーン", "308": "ハイドロ カノン", "309": "コメパン", "314": "エア カッター", "315": "オバヒ", "317": "岩石封じ", "318": "銀色の風", "319": "金属音", "325": "シャドパン", "331": "タネガン", "332": "つばめ返し", "337": "ドラゴン クロー", "338": "ハード プラント", "339": "ビルド アップ", "341": "マッド ショット", "342": "ポイズン テール", "348": "リフブレ", "352": "水の波動", "359": "アムハン", "360": "ジャイロ ボール", "368": "メタバ", "370": "インファ", "394": "フレドラ", "396": "波動弾", "399": "悪の 波動", "401": "アクア テール", "403": "エアスラ", "404": "シザクロ", "405": "さざめき", "406": "竜の 波動", "407": "ドラゴン ダイブ", "408": "パワー ジェム", "409": "ドレパン", "412": "エナボ", "413": "ブレバ", "414": "大地の力", "416": "ギガ インパクト", "418": "バレパン", "420": "つぶて", "421": "シャドクロ", "422": "雷のキバ", "423": "氷のキバ", "424": "炎のキバ", "427": "サイコ カッター", "428": "しねんの ずつき", "429": "ミラショ", "430": "ラスカ", "434": "竜星群", "437": "リフスト", "438": "パワー ウィップ", "440": "クロス ポイズン", "441": "ダスト シュート", "442": "アイヘ", "444": "エッジ", "446": "ステルス ロック", "452": "ウドハン", "453": "アクジェ", "454": "攻撃指令", "455": "防御指令", "456": "回復指令", "457": "もろはの ずつき", "459": "時の咆哮", "460": "亜空切断", "464": "ダクホ", "465": "シード フレア", "466": "怪しい風", "467": "シャドー ダイブ", "469": "ワイガ", "474": "ベノム ショック", "477": "テレキネ", "482": "ヘドウェ", "488": "ニトチャ", "499": "クリア スモッグ", "500": "アシパ", "506": "祟り目", "522": "虫の抵抗", "524": "氷の息吹", "527": "エレキ ネット", "528": "ワイボ", "529": "ドリル ライナー", "532": "ウッド ホーン", "533": "聖なる剣", "534": "シェル ブレード", "539": "ナイト バースト", "540": "サイコ ブレイク", "543": "アフロ ブレイク", "546": "テクノ バスター", "547": "いにしえの うた", "548": "神秘の剣", "549": "凍える世界", "551": "蒼い炎", "553": "フリーズ ボルト", "554": "コールド フレア", "555": "バクア", "556": "氷柱落とし", "557": "Ｖジェネ", "566": "ゴースト ダイブ", "570": "パラボラ チャージ", "574": "チャーム ボイス", "576": "ひっくり 返す", "577": "ドレイン キッス", "580": "グラス フィールド", "585": "ムンフォ", "588": "キンシ", "591": "ダイヤ ストーム", "592": "スチーム バースト", "593": "いじげん ホール", "594": "水手裏剣", "595": "マジカル フレイム", "596": "ニードル ガード", "599": "ベノトラ", "604": "エレキ フィールド", "605": "マジシャ", "609": "ほっぺ すりすり", "612": "グロパン", "613": "デス ウイング", "615": "サウザン ウェーブ", "617": "根源の 波動", "618": "断崖の剣", "619": "ガリョウ テンセイ", "622": "出会い頭", "625": "ＤＤ ラリアット", "626": "うたかた の アリア", "627": "アイス ハンマー", "629": "10万馬力", "631": "ソーラー ブレード", "640": "サイコ フィールド", "649": "コア パニッシャー", "650": "トロピカル キック", "652": "くちばし キャノン", "653": "スケイル ノイズ", "654": "ドラゴン ハンマー", "657": "トラップ シェル", "658": "フルール カノン", "661": "シャドー ボーン", "662": "アクセル ロック", "663": "アクブレ", "664": "プリズム レーザー", "665": "メテオ ドライブ", "666": "シャドー レイ", "668": "びりびり ちくちく", "670": "マルチ アタック", "672": "シャドー スチール", "720": "ビックリ ヘッド", "744": "ダイマ砲", "751": "ドラゴン アロー", "778": "ドラム アタック", "780": "火炎 ボール", "781": "巨獣斬", "782": "巨獣弾", "783": "オーラ ぐるま", "784": "ワイブレ", "786": "オーバー ドライブ", "789": "ソウル クラッシュ", "794": "スター アサルト", "796": "てってい こうせん", "799": "スケイル ショット", "800": "メテオ ビーム", "803": "グラス スライダー", "813": "トリプル アクセル", "818": "水流連打", "821": "凍てつく 視線", "822": "燃え上がる 怒り", "823": "雷鳴蹴り", "824": "ブリザード ランス", "826": "不気味な 呪文", "835": "クロロ ブラスト", "837": "勝利の舞", "840": "オーラ ウイング", "841": "うらみ つらみ", "844": "ひゃっき やこう", "845": "ひけん ちえなみ", "846": "凩嵐", "847": "雷嵐", "848": "熱砂の嵐", "856": "いっちょう あがり", "862": "きょけん とつげき", "866": "キラー スピン", "872": "アクア ステップ", "874": "ゴールド ラッシュ", "875": "サイコ ブレイド", "878": "アクセル ブレイク", "879": "イナズマ ドライブ", "887": "ハイパー ドリル", "888": "ツイン ビーム", "890": "アーマー キャノン", "893": "デカ ハンマー", "902": "シャカシャカ ほう", "904": "ツタ こんぼう", "909": "迅雷", "919": "蛇毒の鎖", "4041": "テラ 黄玉", "4042": "テラ 翠玉", "4043": "テラ 天藍", "4044": "テラ 金紅", "4045": "テラ 紫水", "4046": "テラ 尖晶", "4047": "テラ 紫黄", "4048": "テラ 翠銅", "4049": "テラ 青金", "4050": "テラ 虹玉", "4051": "テラ 碧玉", "5000": "10万 ボルト", "5001": "10万 ボルト", "5002": "雷", "6000": "オリジン ボルテッカー", "6001": "友情の 10万 ボルト", "6002": "超 波動弾", "6003": "極マジシャ", "6005": "電光石火 自在", "6006": "影分身 変幻", "6007": "ピンク ダイヤ ストーム", "6008": "ヒート ハイドロ ポンプ", "6009": "ベノム クロス ポイズン", "6010": "燃え上がる 怒り 烈", "6011": "雷鳴蹴り 轟", "6012": "凍てつく 視線 脅", "6013": "制縛 の にらみつける", "6014": "強奪 の つじぎり", "6015": "ワイル ドエレキ ネット", "6016": "海神の 守る", "6017": "剣の舞 剛", "6018": "ネオ サイコ カッター", "6019": "はっぱ カッター 鋭刃", "6020": "冷凍 ビーム 氷舞", "6021": "清浄の なみのり", "6022": "トリプル アクセル 砕", "6023": "ワイブレ 斬", "6024": "でんこうそうげき 迅", "6025": "氷翼の 冷凍 ビーム", "6026": "雷翼の はねやすめ", "6027": "炎翼の フレドラ", "6028": "G ギガ インパクト", "6029": "決意の とおぼえ", "6030": "砕破の じしん", "6031": "ひけん ちえなみ真打", "6032": "3ぼんのや 五月雨", "6033": "怨念の じならし", "6034": "スター ドレインキッス", "6035": "熱狂 ヘドロ ウェーブ", "6036": "哀響 オーバー ドライブ", "6037": "アクセル シザークロス", "6038": "ギガ ハード プラント", "6039": "詠嘆の いにしえの うた", "6040": "漆黒の げきりん", "6041": "凍蝶の しびれごな", "6042": "怪炎 ビックリ ヘッド", "6043": "絶氷 ゆきなだれ", "6044": "超光★ でんじほう", "6045": "ペルセ フルール カノン", "6046": "ハイパー ゲップ", "6047": "闘魂 氷柱落とし", "6048": "さいみんじゅつ 夢幻", "6049": "ブルーム キラー スピン", "6050": "おお いわなだれ", "6051": "ぶちかまし 朧", "6052": "うらみ つらみ 幻妖", "6053": "妙技 ゆびをふる", "6054": "プロト アシパ", "6055": "スパイラル メガホーン", "6056": "メタル バレパン", "6057": "怒涛の どろかけ", "6058": "カチカチ デカ ハンマー", "6059": "怪演の うそなき", "6060": "ネオ ブラスト バーン", "6061": "誘惑の あやしいひかり", "6062": "黒風 凩嵐", "6063": "白光 聖なる剣", "6064": "弾丸 ハイパー ドリル", "6065": "烈火 の 火炎車", "6066": "毒ドク シェル アームズ", "6067": "上品な さむい ギャグ", "6068": "昏睡 キノコの 胞子", "6069": "夏色 シャドボ", "6070": "渚の 怪しい風", "6071": "毒ドク シェル アームズ", "6072": "再起の くらいつく", "6073": "大岩石封じ", "6074": "ホロウ メテオビーム", "6075": "暴威の じゃれつく", "6076": "じしん 破天", "6077": "バレパンチ 瞬天", "6078": "破壊光線 轟天", "6079": "千金 ゴールド ラッシュ", "6080": "全力 メテオ ドライブ", "6081": "フル ハイドロ カノン", "6082": "パーフェクト ドゲザン", "6083": "アクブレ サンバ", "6084": "テラー シャドボ", "6085": "呪氷の ふぶき", "6086": "昇炎の 祟り目", "6087": "降雷の ワイボ", "6088": "こごかぜ 麗氷", "6089": "サイコキネ シス暁光", "6090": "友愛の 憤怒の 拳", "6091": "だいもんじ 神火", "6092": "星夜の チャーム ボイス", "6093": "鳴虫の きゅうけつ", "6094": "のみこむ 暴飲", "6095": "かみくだく 暴食", "6096": "爆炎 マジカル フレイム", "6097": "秘技 猛毒スモッグ", "6098": "砂縛の へびにらみ", "6099": "金剛 アイヘ", "6100": "豊穣の わたほうし", "6101": "爆烈 火炎 ボール", "6102": "乱撃 ドラム アタック", "6103": "高圧 ねらいうち", "6104": "S アクセル ブレイク", "6105": "V イナズマ ドライブ", "6106": "ブレス シード フレア", "6107": "エナボ 繚乱", "6108": "地裂の ぶちかまし", "6109": "断崖の剣 紅", "6110": "根源の 波動 藍", "6111": "ナイト バースト 暝天", "6112": "甘美な あまえる", "6113": "巨獣斬 蒼牙", "6114": "聖なる炎 虹焔", "6115": "ラブ マジシャ", "6116": "青嵐 オーラ ウイング", "6117": "春風 スケイル ショット", "6118": "ひゃっき やこう 逢魔", "6119": "超硬 てってい こうせん", "6120": "邪魂 のシャドボ", "6121": "破壊光線 陽天", "6122": "さざめき 陽炎", "6123": "迅雷★ フルエレキ", "6124": "雷嵐 召雷", "6125": "きあいだま 練気", "6126": "ソル メテオ ドライブ", "6127": "ルナ シャドー レイ", "6128": "夏空 フェザー ダンス", "6129": "魅惑の あまい かおり", "6130": "長高 ドラゴン ハンマー", "6131": "だましうち 表", "6132": "だましうち 裏", "6133": "エアロ ブラスト 聖海", "6134": "聖なる炎 聖天", "6135": "盛夏の だくりゅう", "6136": "サニー ソラビ", "6137": "白銀の しろいきり", "6138": "巨岩の てっぺき", "6139": "紅熟の にほんばれ", "6140": "涼風の ふぶき", "6141": "破壊光線 Z", "6142": "輝爪の ドラゴン クロー", "6143": "宝鱗の げきりん", "6144": "流星の 電光石火", "6145": "幻光の 祟り目", "6146": "綺羅の 破壊光線", "6147": "破界の シャドー ダイブ", "6148": "凩嵐 厳冬", "6149": "雷嵐 真夏", "6150": "熱砂の嵐 深秋", "6151": "炎纏の いわくだき", "6152": "細石の いわなだれ", "6153": "勝利の舞 栄華", "6154": "厚毛の 守る", "6155": "ワルかわな うそなき", "6156": "舞火の フレドラ", "6157": "圧水の アクア テール", "6158": "ぼうふう 聖嵐", "6159": "エアスラ 天刃", "6160": "献身の てっぺき", "6161": "熱血の 10万馬力", "6162": "コールド フレア ゼロ", "6163": "光刃の サイコ ブレイド", "6164": "蛇毒の鎖 蝕", "6165": "激辛 オバヒ", "6166": "硬質 ウドハン", "6168": "シン クロロ ブラスト", "6170": "幽境の かげぬい", "6171": "王竜の きりさく", "6172": "いわなだれ 天塊", "6173": "エッジ 天穿", "6174": "バブル光線 聖泡", "6175": "ドロポン 聖流", "6176": "蒼愛の じゃれつく", "6177": "岩崖の 大地の力", "6178": "永遠の 10万 ボルト", "6179": "始まりの雷", "6180": "栄光の雷", "6181": "悪鬼の どげざづき", "6182": "桃源の めいそう", "6183": "万緑の ツタこんぼう", "6184": "極彩 テラクラスター", "6185": "波動弾 神気", "6186": "いわくだき 天破", "6187": "サイケ光線 神通", "6188": "サイキネ 神識", "6189": "しねんの ずつき 慧眼", "6190": "鋼の翼 黒鋼", "7000": "キョダイ サイセイ", "7001": "キョダイ ゲンエイ", "7002": "ムゲンダイ ビーム", "7003": "ダイ アタック", "7005": "ダイ ナックル", "7007": "ダイ ジェット", "7008": "ダイ ジェット", "7009": "ダイ アシッド", "7010": "ダイ アシッド", "7011": "ダイ アース", "7012": "ダイ アース", "7013": "ダイ ロック", "7016": "ダイ ワーム", "7018": "ダイ ホロウ", "7019": "ダイ スチル", "7021": "ダイ バーン", "7022": "ダイ バーン", "7024": "ダイ ストリーム", "7025": "ダイ ソウゲン", "7026": "ダイ ソウゲン", "7027": "ダイ サンダー", "7028": "ダイ サンダー", "7030": "ダイ サイコ", "7033": "ダイ ドラグーン", "7034": "ダイ ドラグーン", "7038": "ダイ フェアリー", "7039": "ダイ ウォール", "7040": "キョダイ テンバツ", "7041": "キョダイ レンゲキ", "7042": "キョダイ バンライ", "7043": "キョダイ フンセキ", "7044": "キョダイ センリツ", "7045": "キョダイ コランダ", "7046": "キョダイ バンライ", "7047": "キョダイ ゴクエン", "7048": "キョダイ シュウキ", "7049": "キョダイ コウジン", "7050": "キョダイ カキュウ", "7051": "キョダイ カンデン", "7052": "キョダイ ヒャッカ", "7053": "キョダイ ヒャッカ", "7054": "キョダイ スイマ", "8011": "めざパ", "8044": "めざめる ダンス", "8201": "カントーの 分析", "8202": "カントーの 結束", "8203": "ジョウトの 情熱", "8204": "ジョウトの 分析", "8205": "ジョウトの 結束", "8207": "ホウエンの 分析", "8208": "ホウエンの 結束", "8210": "シンオウの 分析", "8211": "シンオウの 結束", "8212": "イッシュの 情熱", "8213": "イッシュの 分析", "8214": "イッシュの 結束", "8219": "アローラの 分析", "8220": "アローラの 結束", "8221": "ガラルの 情熱", "8222": "ガラルの 分析", "8223": "ガラルの 結束", "8224": "パルデアの 情熱", "8225": "パルデアの 分析", "8226": "パルデアの 結束", "8229": "パシオの 結束", "10007": "勝利への タフネス", "10009": "栄光への 勝ち筋", "10010": "やわじゃないぜ!", "10020": "あがってくよ!", "10021": "森の力を!", "10024": "オン ステージ!", "10028": "潜入開始!", "10029": "ついてきて!", "10037": "しっかりみてなよ!", "10040": "負けないわよ!", "10041": "勝利のＶ!", "10044": "輝いてみせる!", "10047": "熱くなってきたわ!", "10049": "気合いと根性!", "10059": "いい返事!", "10060": "もえてきたぜ!", "10070": "こっちこっち!", "10071": "もーおこったよ!", "10074": "仲良くしてね!", "10075": "もしかして 怖いの?", "10079": "勝っちゃうよー!!", "10090": "全力を尽くす!", "10100": "マキシマム!!", "10110": "理性ブッとばす!", "10111": "ポイズン ライブ!", "10120": "ここが決めどき!", "10121": "高みを 目指す!", "10129": "華麗に 参上!", "10148": "なにをすべきか?", "10151": "次で決める!", "10152": "かかって こい!", "10160": "ひとっとびね!", "10164": "お急ぎですね!", "10165": "いざ 空の旅へ!", "10168": "テイクオフ!", "10169": "とばしますよ!", "10170": "みんなでいくよ!", "10171": "わたしが守る!", "10177": "たまらない……!", "10178": "大好きを ぶつける!", "10179": "栄光への 灯火", "10181": "勉強の成果よ!", "10189": "予習はバッチリ!", "10190": "勝利を切り開く!", "10191": "飛ばしていくぞ!", "10198": "大空を飛び回れ!", "10200": "ひとりじゃない!", "10201": "狙いは完璧!", "10204": "驚かせちゃうよ!", "10207": "楽しくなってきた!", "10210": "かかってこいよ!", "10211": "頂点に立つ!", "10214": "その程度の もんかよ", "10215": "ごまかせないぜ!", "10216": "栄光への 導き", "10218": "お手並み拝見だ!", "10219": "負けらんねーぜ!", "10239": "守ること!", "10240": "勝利の物語を!", "10250": "ぜんぶ気合よ!", "10254": "テキパキ いくよ!", "10264": "盛りあがってくで!", "10270": "緑を力に!", "10274": "こ 怖くないよ!?", "10280": "勝つのはわたし!", "10284": "認めて あげるわ!", "10290": "ホットになるよ!", "10300": "通じ合うヨ!", "10304": "夜空を飛ぶヨ!", "10310": "繋がってるんだ!", "10314": "星空に願いを……!", "10340": "ナイスモチーフ!", "10341": "絵になるね!", "10350": "エレクトリック!", "10359": "ビリビリ ネー!", "10369": "電源ボタン…オン!", "10380": "ザ･ロック!", "10390": "いいんじゃない!", "10399": "ピントを あわせて", "10400": "強き心を見せよ!", "10410": "分析完了!", "10419": "んじゃいきまーす!", "10430": "驚きの嵐!", "10449": "みやぶりましたわ!", "10450": "研究の成果だよ!", "10454": "むしはしぶといよ!", "10459": "徹底的に調べよう!", "10460": "かかってこいや!", "10469": "イイねぇー!", "10470": "力は無限!", "10479": "負けるわけには!", "10480": "勝負こそが全て!", "10490": "きずなを見せて!", "10500": "真剣勝負!", "10510": "ハードにいくよ!", "10519": "前置きは なし!", "10520": "はじめよーかい!", "10530": "諦めないです!", "10540": "忍びの極意!", "10550": "はがねの輝きよ!", "10570": "ウー! ハーッ!", "10590": "うおおーす!", "10600": "風よりもはやく!", "10609": "みやぶれる?", "10620": "楽しませて!", "10629": "素敵でしょ?", "10630": "正念場だな!", "10640": "考えるんだ……!", "10660": "任せておけ!", "10661": "王の輝きをみよ!", "10669": "ひれ伏せ!", "10670": "元気にしちゃう系?", "10679": "だいそーさーく!", "10689": "触れさせんぞ!", "10890": "理想を追い求める!", "10891": "ボクの数式!", "10894": "真実のラブを!", "10897": "ラブをみせよう!", "10899": "幻をみせよう……!", "10901": "試してみよう!", "10904": "クールにいこう!", "10905": "天よりも高く!", "10906": "謎は解けた!", "10907": "攻撃重視だ!", "10908": "スピード勝負だ!", "10909": "守りに徹しよう!", "10910": "楽しい勝負ね!", "10911": "胸が高鳴るわ!", "10912": "調査開始ね!", "10917": "最高の勝負ね!", "10919": "終わらせない!", "10924": "たべちゃうぞー!", "10928": "あなたに勝ちます!", "10940": "面舵いっぱい!", "10960": "まさに芸術!", "10961": "妥協はしません!", "10970": "負けないから…!", "10974": "ありがとう……!", "10980": "アローラの風ー!", "10981": "もっとゼンリョク!", "10989": "楽しんでいくよー!", "10990": "まったなしだぜ!", "10994": "先にいくからなー!", "10998": "遅すぎるぞー!!", "10999": "どんッ!!", "11000": "腕試しだ!", "11009": "栄光への 挑戦", "11014": "感謝の気持ちです!", "11018": "栄光の 賛歌", "11019": "流れるように!", "11020": "せーので第一歩!", "11050": "ウチらもいくぞ!", "11060": "しびれるわよ!", "11062": "気分は そうかい!", "11068": "まぶしく輝く!", "11080": "特急がまいります!", "11081": "発車いたします!", "11084": "通過いたします!", "11090": "全速 前進!", "11091": "目指すは 勝利!", "11094": "安全 運転!", "11100": "かわしまくるわ!", "11101": "なかなかやるわね!", "11109": "耐えてみせる!", "11110": "いざ まいる!", "11114": "天下一品さ!", "11117": "そろそろ始めよう!", "11118": "いざ 真剣勝負!", "11119": "正しく強い心を!", "11120": "あきらめないよ!", "11121": "これで決めるよ!", "11122": "魂の 輝きを!", "11129": "金色に輝く心で!", "11130": "シャキーン!", "11134": "鉄壁ガードです!", "11138": "鋼の 心で!", "11150": "しびれようぜ!", "11154": "心躍る勝負を!", "11159": "充電完了だ!", "11160": "あたしに任せて!", "11161": "楽しい夢を!", "11164": "スウィートに応援!", "11168": "ビューンといくよ!", "11169": "踊りは完璧!", "11170": "レディ ファイト!", "11180": "全力です!!", "11184": "新年のアローラ!", "11185": "月の輝きを!", "11186": "奏でましょう!", "11187": "太陽の輝きを!", "11189": "お茶会の時間です!", "11191": "魂が 震える……!", "11198": "フッ いくぞ……!", "11199": "必ず守るさ……!", "11210": "覚悟を決めな!", "11220": "一緒にがんばろう!", "11228": "ウルトラに 耐えて!", "11229": "不思議なパワーだ!", "11230": "じーっと狙って!", "11234": "ゼンリョク充填!", "11238": "ウルトラ チャンス!", "11239": "元気もりもり!", "11240": "マオの本気食らえ!", "11244": "お待ちどおさま!", "11249": "本日のおすすめ!", "11250": "破壊してやらぁ!", "11254": "手は緩めねぇ!", "11258": "ボヤボヤすんなよ!", "11260": "準備はいいよね?", "11261": "準備はオッケー!", "11268": "気持ち弾んじゃう!", "11269": "仲良しだもんね!", "11270": "イリュージョン!", "11274": "ショーを 始めよう!", "11280": "ぼくは勝つんだ!", "11281": "追いついてみせる!", "11288": "みてて くださいね!", "11289": "ぜったい 勝とうね!", "11298": "捕まえてみなよ?", "11299": "んじゃ いこか!", "11301": "想いに 触れる!", "11304": "どうぞ召しあがれ!", "11308": "はじめましょ!", "11310": "パワーオン!!", "11319": "ひらめきます!", "11320": "天下無双なり!", "11332": "正しさと 強さを!", "11337": "ぶっ倒す!", "11338": "栄光へ 向ける 眼差し", "11340": "ここまで来たか!", "11350": "恨みっこなしだ!", "11360": "世界は広がる!", "11364": "みんなで 勝負だよ", "11369": "始めちゃうかい?", "11370": "レッツ ゴー!", "11371": "夢と 冒険の 世界へ!", "11390": "一緒に いこ!", "11397": "友情のしるし!", "11398": "楽しんじゃお!", "11399": "解けちゃったかも?", "11406": "欲望は 尽きない", "11407": "ほほうッ!", "11409": "歯向かうなら……!", "11440": "怒りを みせましょう", "11470": "相手してやるッ!", "11479": "とばして いくぜッ!", "11481": "ぼくは信じる!", "11484": "宴を始めよう!", "11488": "きみにみえるかな?", "11489": "相手になろう!", "11490": "踊り続けるぞ!", "11499": "おいでませ!", "11500": "もっと高くだ!", "11508": "まだまだ 飛べるぞ!", "11509": "本当の すごさだ!", "11510": "驚くといいです!", "11520": "かっこいいでしょ!", "11560": "力を 試そう", "11580": "輝きみせちゃおう!", "11581": "幕をあげましょう!", "11584": "気高き魂を!", "11589": "さあ 舞台へ!", "11590": "ご覚悟を!", "11600": "つられましたね!", "11601": "いざ キャスト!", "11609": "本気を みてください", "11610": "本気でいきますぞ!", "11620": "一緒に戦おう!", "11628": "力を 貸してよ!", "11629": "教えてあげるよ!", "11704": "幸せを描こう!", "11710": "どりゃああ!!", "11780": "背中は預けます!", "11800": "オーライ!", "11808": "いいムーブだねえ!", "11870": "オ･ルヴォワール!", "11880": "おみせしましょう!", "11900": "ソウルをこめるよ!", "11910": "研究ですから!", "11920": "新たなる大地を!", "11930": "始まりに還す!", "11950": "ふはは!", "11960": "世界を破壊する!", "11961": "信念の炎!", "11990": "覚悟しといてねっ!", "12030": "さりげなく 貫いて", "12040": "ぺろぺろりーん!", "12060": "ウズウズしとる!", "12150": "アピール☆タイム!", "12154": "ライブでショーブ!", "12160": "追い続けるぜ!", "12170": "突入するぞ!!", "12200": "それじゃあいくよ!", "12400": "いつかは主役!", "12410": "不屈の闘志!", "12420": "攻めどきかな!", "12424": "まずは 下ごしらえ!", "12429": "みんなを引っ張る!", "12430": "研ぎ澄ませて!", "12434": "狙いは外さない!", "12437": "キックオフ!", "12438": "みずの極意!", "12439": "もっと有利に!", "12440": "さすがだぞ!", "12446": "本気エネルギー!", "12447": "知識をみせるぞ!", "12448": "試して やるぞ!", "12450": "ノリにあわせなよ!", "12453": "ぶつかりあうよ!", "12454": "負けてられんね!", "12455": "つっぱしるよ!", "12456": "負けるかっての!", "12458": "しぇからしか!!", "12459": "想いをぶつけるよ!", "12467": "勝つしか ない!!", "12468": "仕方ないですね!", "12470": "本気をみせよう!", "12471": "無限大だぜ!", "12474": "プレゼントタイム!", "12478": "盛りあがろうぜ!", "12479": "熱情をみせよう!", "12480": "根こそぎ刈りとる!", "12490": "流し去ってあげる!", "12510": "逃がさない……!", "12514": "お楽しみに……!", "12520": "頭を 燃やせ!", "12528": "若者よ 行け!", "12529": "イチ! ニー!", "12540": "まだよ!", "12550": "手加減しないよ!", "12559": "温度 下げてくよ!", "12560": "名前を呼んでくれ!", "12561": "ライブの 始まりだ!", "12570": "勝つしかねえよな!", "12574": "強さを知らしめる!", "12578": "みくびるなよ!", "12579": "かき乱してやるぜ!", "12590": "任しといて!", "12594": "オーホホホホホホ!", "12620": "行動こそ正義!", "12629": "よりよい未来に!", "12630": "お引き取りを!", "12640": "負けるもんか!", "12649": "思いっきりいくぜ!", "12690": "みんなで ゴー!", "12720": "自分 磨いてんのよォ", "12730": "超･能･力!", "12790": "レッツ 前進っ!", "12820": "応援するボル!", "12840": "時は急げってな!", "12844": "時代の 変化だ!", "12850": "ふるえあがって!!", "12854": "心から 戦える!", "12859": "世界は広いよ!", "12860": "宝探しに出発!", "12870": "キラキラの思い出!", "12890": "本気で戦ろう!", "12891": "最高の 勝負を!", "12899": "勝ちにいくよ!", "12900": "心をひとつに!", "12904": "もっと はやくだ!", "12910": "通じあいます!", "12930": "ブイブイいわす!", "12939": "カチこむ!", "12940": "頭を 冷やそうか", "12960": "人気 シビルドン 登り", "12967": "応援してしてー!", "12968": "生配信してマース!", "12969": "スクショ タイムだ!", "13000": "エネルギーを 頂戴!", "13010": "悪の 奥義!", "13020": "きばりやぁ!", "13029": "足もと 気ィつけや", "13030": "すごいですので!", "13034": "カッチカチですー!", "13170": "お待ちどうさん!", "13179": "めしあがれだ!", "13180": "自分だけの宝物を!", "13188": "テーマは 宝探し!", "13200": "灰に なっちまえ", "13270": "トバして いくよ!", "13280": "我が ポイズンの 神髄", "13290": "あざといの食らえ!", "13300": "背中はみせない!", "13510": "よく 似合ってるわ", "13560": "ガード ガード!", "13640": "山は いいぞ!", "14999": "よし いこう!", "15317": "バカンスの魅力!", "16550": "ピカ! ピーカ!", "16560": "ぶい! いぶぃ!", "16580": "攻めどきの 匂いね!", "17015": "黒鉄の 鎧", "17016": "ホイップ ステップ!", "17100": "息をあわせて!", "17101": "勢いにのって!", "17102": "隙を狙って!", "17103": "耐えていこう!", "17104": "一気にいくよ!", "17105": "みんな堪えて!", "17106": "賢く攻めよう!", "17107": "気合いをあげる!", "19000": "傷ぐすり", "19001": "ミニ 傷ぐすりG", "19002": "いい傷ぐすり", "19010": "プラパ", "19011": "プラパG", "19021": "ディフェンダーG", "19023": "ディフェンダーG+", "19030": "SPアップ", "19031": "SPアップG", "19040": "SPガード", "19041": "SPガードG", "19043": "SPガードG+", "19051": "スピーダーG", "19052": "スピーダー+", "19053": "スピーダーG+", "19058": "EXスピーダー", "19061": "ヨクアタールG", "19071": "ヨクヨケールG", "19080": "クリカ", "19081": "クリカG", "19082": "クリカ+", "19083": "クリカG+", "19090": "なんでも なおし", "19100": "わざ ゲージ アップ", "19110": "ジワ ナオール", "19111": "ジワ ナオールG", "19120": "ツギ クリティカ", "19121": "ツギ クリティカG", "19130": "モトニ モドール", "19131": "モトニ モドールG", "19140": "ツギ アタール", "19141": "ツギ アタールG", "19151": "ハネノケールG", "19170": "ブースト エナジー", "19510": "普の 願", "19560": "氷の 願い", "19570": "闘の 願い", "19580": "毒の 願い", "19590": "地の 願い", "19600": "飛の 願い", "19620": "虫の 願い", "19630": "岩の 願い", "19640": "霊の 願い", "19650": "竜の 願い", "19660": "悪の 願い", "19670": "鋼の 願い", "19680": "妖の 願い", "19700": "グラスの いのり", "19720": "サイコの 祈り", "19800": "エフェクト ガード", "19810": "リフレクタ バリア", "19820": "ひかりの バリア", "19830": "イジョウ ミラー", "19840": "エフェクト ミラー", "19850": "へんか ガード", "19860": "クリティカ ガード", "19870": "しんぴの ガード", "50802": "覚悟を 決める アシッド ポイズン デリート", "51202": "何かを 変える ぜったい ほしょく かいてんざん", "51302": "気持ちが 積み 重なる ワールズエンドフォール", "51303": "かわいい 仕草で ワールズエンドフォール", "51602": "夜空に浮かぶ ブラックホールイクリプス", "60000": "命 爆発!!グロウパンチ", "60300": "バチッといくぜ!シザークロス", "64100": "想いを 背負って 挑む いわなだれ", "64600": "きんピカで カチカチの スチール インパクト", "78900": "笑顔を 絶やさない りゅうのはどう", "80900": "星明かりで 道をつくる サイコキネシス", "81700": "とっておきのナンバー!じごくづき", "88700": "相棒を信じる アフロブレイク", "90600": "潜在能力を追求する ギアソーサー", "90700": "勝利へ向かって撃つ むしのさざめき", "90800": "無限にわきあがる闘魂の Ｖジェネレート", "91000": "世界を変える想いが輝く フリーズボルト", "93500": "氷点下の世界に誘うジ･アイスレイ", "93600": "本当は怖い?ゴーストレイ", "94400": "調査への熱意が燃える ファイアーレイ", "94500": "バチバチひらめく エレクトリックレイ", "94600": "好奇心が溶け込む ウォーターレイ", "97100": "静寂の 中で 吹き荒れる ふぶき", "97200": "世界に その名を 響かせる かみなり", "97300": "燃えあがる ポケモン愛の だいもんじ", "98100": "クラフト名人のひけん･ちえなみ", "98200": "どんどん 実ってく でんこうそうげき", "98700": "最高潮へ 登りつめる ドラゴンインパクト", "98800": "チームの エースを狙う ファイアーインパクト", "98900": "華麗な プレーで狙う フライングインパクト", "99000": "勝利を 決める ファイティングインパクト", "99400": "闇夜を 駆ける 黒き ゴーストレイ", "99500": "ライバルとして 勝ちたい ファイアーレイ", "99600": "だいすきな 相棒と 歩む ブイブイブレイク", "99700": "青い電撃と 哀愁の オーバードライブ", "99800": "キラリ光る 天才ハッカーの チャームボイス", "100000": "そびえる塔の 大君の ノーマル インパクト", "100100": "好きを 貫いて 輝く スチール インパクト", "100200": "進むべき 道を 共に 歩む ロック インパクト", "100300": "温かな 想いが 燃える ファイアー インパクト", "100400": "セピア色の 記憶が よみがえる いにしえのうた", "100500": "めったに みられない フェアリー レイ", "100600": "昔を 思いだす グラウンド インパクト", "100700": "悪の 栄光を 取り戻す ダーク インパクト", "100800": "歯向かう者を こらしめる ポイズン インパクト", "100900": "姿を 欺きだます ポイズン レイ", "101000": "もっとも 冷酷と 呼ばれた フライング レイ", "101100": "勝気な 次女の アイス レイ", "101200": "古の 黒鉄が 放つ スチール インパクト", "101300": "大切な 思いを 受け継ぐ フライング レイ", "101400": "まっすぐに 成長していく グラスレイ", "101500": "思わず みとれる フェアリー インパクト", "101600": "ごつくて かわいい ロック インパクト", "101700": "絶対零度トリックが 放つ ゆきなだれ", "101900": "仲良しな 相棒と 駆ける ピカピカサンダー", "102000": "優しさで 支えあう 魂の フルールカノン", "102700": "トップ チャンピオンが 導く キラー スピン", "103300": "理性を ブッとばす ポイズンレイ", "103400": "熱いソウルで叫ぶ スターの ドラゴンレイ", "103500": "ベストな技を繰りだす ポイズンインパクト", "103600": "静かに 栄える深緑の グラスレイ", "103700": "ダブルイーブイの ノーマルレイ", "103800": "熱い気持ちに 共鳴する ドラゴンクロー", "104000": "パルデア リーグ 面接官の だいちの ちから", "104100": "カチカチ なので つよい デカハンマー", "104400": "幸せを 乗せて 走る グラスインパクト", "104500": "氷雪に 舞う 幻想的な バグレイ", "104600": "硬くて 冷たくて 鋭く 強い スチールインパクト", "104700": "新年を 祝い 舞う ドラゴンレイ", "104800": "燃えあがる エレガントな ファイアーレイ", "104900": "しびれる 勝負を 望む エレクトリックレイ", "105000": "白の 美しさに 負けない フェアリーレイ", "105200": "料理の 楽しさを 教える ノーマルインパクト", "105300": "思い出の 味を 再現する アイスインパクト", "105400": "ファイトが 沸いてくる ノーマルインパクト", "105500": "ダブルピカチュウの エレクトリックレイ", "105600": "波動に 導かれし ファイティングインパクト", "105700": "スパイシーな 情熱 料理人の ほうふく", "105800": "野性味 あふれる いい感じの じゃれつく", "106200": "静かなる 羽ばたきの フライングレイ", "106300": "自分好みな フレーバーの フェアリーレイ", "106500": "月明かりの 下で 踊る グラウンド インパクト", "106600": "笛の 音と 共に 踊る ゴースト レイ", "106700": "ルーレットの 女神が 微笑む ウォーター レイ", "106800": "最高 ダンス チームを 目指す ダーク インパクト", "106900": "楽しく ぶっとぶ フライング インパクト", "107200": "魔法の 国を 支配する サイキック インパクト", "107300": "世界を 悪に 染める ダーク レイ", "107400": "心構えと 実力を 試す グラウンド レイ", "107500": "ライバル心を 燃やす ファイアー レイ", "107900": "超絶 パーフェクトに かわいい ポイズンレイ", "108000": "エレガントな エスパーの サイキックレイ", "108100": "心技体を 極めし 大将の グラスインパクト", "108200": "勇気を 振りしぼって 進む ゴーストレイ", "108300": "満月の 夜に 海へ 誘う ゴーストレイ", "108500": "果てのない 欲望を 満たす かみくだく", "108600": "燃え爆ぜる 何でも屋の アーマー キャノン", "108700": "オタク道を ゆく 服飾担当の ダストシュート", "108800": "シビれる バトりの エレクトリック レイ", "108900": "炎と 共に 上を 目指す ファイアーレイ", "109000": "全力を だせて うれしい ロックインパクト", "109100": "きっと ずーっと 強くなる ドラゴンインパクト", "109200": "全員 やっつけるッ!! フライングレイ", "109300": "広い 世界を みせる アイスインパクト", "109400": "どこまでも ネバっちゃう ダークインパクト", "109900": "ドカン! と撃ち抜くウォーターレイ", "110000": "きみの 物語を はじめる ポイズン インパクト", "110200": "勝ちまくる 完璧な サイキック レイ", "114100": "イイねの 瞬間を 撮る グラウンド インパクト", "114200": "ばっちり 決める エレクトリック インパクト", "114300": "花の 美しさを 愛でる フェアリー レイ", "114400": "広い 海に 思いを はせる ウォーター レイ", "115400": "気持ちは 揺るがない グラウンド インパクト" }, "ko": { "2": "태권 당수", "7": "불꽃 펀치", "8": "냉동 펀치", "9": "번개 펀치", "16": "바람 일으키기", "18": "날려 버리기", "19": "공중 날기", "22": "덩굴 채찍", "25": "메가톤 킥", "33": "몸통 박치기", "38": "이판사판 태클", "41": "더블 니들", "42": "바늘 미사일", "45": "울음 소리", "52": "불꽃 세례", "53": "화염 방사", "54": "흰 안개", "55": "물 대포", "56": "하이드로 펌프", "57": "파도 타기", "58": "냉동 빔", "60": "환상 빔", "61": "거품 광선", "63": "파괴 광선", "65": "회전 부리", "75": "잎날 가르기", "76": "솔라 빔", "78": "저리 가루", "79": "수면 가루", "83": "회오리 불꽃", "84": "전기 쇼크", "85": "10만 볼트", "86": "전기 자석파", "88": "돌 떨구기", "90": "땅 가르기", "103": "싫은 소리", "104": "그림자 분신", "105": "HP 회복", "109": "이상한 빛", "113": "빛의 장막", "118": "손가락 흔들기", "124": "오물 공격", "127": "폭포 오르기", "129": "스피드 스타", "136": "무릎 차기", "137": "뱀 눈초리", "138": "꿈 먹기", "147": "버섯 포자", "150": "튀어 오르기", "157": "스톤 샤워", "161": "트라이 어택", "163": "베어 가르기", "172": "화염 바퀴", "178": "목화 포자", "185": "속여 때리기", "188": "오물 폭탄", "189": "진흙 뿌리기", "190": "대포무노 포", "196": "얼어붙은 바람", "202": "기가 드레인", "204": "애교 부리기", "210": "연속 자르기", "211": "강철 날개", "219": "신비의 부적", "221": "성스러운 불꽃", "223": "폭발 펀치", "224": "메가 혼", "225": "용의 숨결", "230": "달콤한 향기", "231": "아이언 테일", "232": "메탈 클로", "234": "아침 햇살", "238": "크로스 촙", "240": "비 바라기", "242": "깨물어 부수기", "243": "미러 코트", "246": "원시의 힘", "247": "섀도 볼", "249": "바위 깨기", "250": "바다 회오리", "295": "러스터 퍼지", "296": "미스트 볼", "297": "깃털 댄스", "298": "흔들흔들 댄스", "299": "블레이즈 킥", "304": "하이퍼 보이스", "305": "맹독 엄니", "306": "브레이크 클로", "307": "블라스트 번", "308": "하이드로 캐논", "309": "코멧 펀치", "313": "거짓 울음", "314": "에어 커터", "315": "오버 히트", "317": "암석 봉인", "318": "은빛 바람", "322": "코스믹 파워", "325": "섀도 펀치", "328": "모래 지옥", "331": "씨 기관총", "332": "제비 반환", "333": "고드름 침", "336": "멀리 짖기", "337": "드래곤 클로", "338": "하드 플랜트", "339": "벌크 업", "341": "머드 샷", "342": "포이즌 테일", "344": "볼트 태클", "348": "리프 블레이드", "352": "물의 파동", "354": "사이코 부스트", "359": "암 해머", "360": "자이로 볼", "368": "메탈 버스트", "394": "플레어 드라이브", "398": "독 찌르기", "399": "악의 파동", "400": "깜짝 베기", "401": "아쿠아 테일", "402": "씨 폭탄", "403": "에어 슬래시", "404": "시저 크로스", "405": "벌레의 야단법석", "406": "용의 파동", "407": "드래곤 다이브", "408": "파워 젬", "409": "드레인 펀치", "411": "기합 구슬", "412": "에너지 볼", "413": "브레이브 버드", "414": "대지의 힘", "416": "기가 임팩트", "418": "불릿 펀치", "420": "얼음 뭉치", "421": "섀도 클로", "422": "번개 엄니", "423": "얼음 엄니", "424": "불꽃 엄니", "427": "사이코 커터", "428": "사념의 박치기", "429": "미러 샷", "430": "러스터 캐논", "432": "안개 제거", "434": "용 성군", "437": "리프 스톰", "438": "파워 휩", "440": "크로스 포이즌", "442": "아이언 헤드", "444": "스톤 에지", "446": "스텔스 록", "452": "우드 해머", "453": "아쿠아 제트", "454": "공격 지령", "455": "방어 지령", "456": "회복 지령", "457": "양날 박치기", "459": "시간의 포효", "460": "공간 절단", "464": "다크 홀", "465": "시드 플레어", "466": "괴상한 바람", "467": "섀도 다이브", "469": "와이드 가드", "474": "베놈 쇼크", "482": "오물 웨이브", "488": "니트로 차지", "490": "로 킥", "499": "클리어 스모그", "500": "어시스트 파워", "522": "벌레의 저항", "524": "얼음 숨결", "527": "일렉트릭 네트", "528": "와일드 볼트", "529": "드릴 라이너", "532": "우드 혼", "533": "성스러운 칼", "534": "셸 블레이드", "539": "나이트 버스트", "543": "아프로 브레이크", "546": "테크노 버스터", "547": "옛 노래", "548": "신비의 칼", "549": "얼어붙은 세계", "551": "푸른 불꽃", "553": "프리즈 볼트", "554": "콜드 플레어", "555": "바크 아웃", "556": "고드름 떨구기", "557": "V 제너레이트", "565": "마지막 일침", "566": "고스트 다이브", "570": "파라볼라 차지", "574": "차밍 보이스", "577": "드레인 키스", "580": "그래스 필드", "585": "문 포스", "588": "킹 실드", "591": "다이아 스톰", "592": "스팀 버스트", "593": "이차원 홀", "594": "물 수리검", "595": "매지컬 플레임", "596": "니들 가드", "599": "베놈 트랩", "604": "일렉트릭 필드", "605": "매지컬 샤인", "609": "볼 부비부비", "611": "엉겨 붙기", "612": "그로우 펀치", "613": "데스 윙", "615": "사우전드 웨이브", "617": "근원의 파동", "618": "단애의 칼", "624": "그림자 꿰매기", "625": "DD 래리어트", "626": "물거품 아리아", "627": "아이스 해머", "629": "10만 마력", "631": "솔라 블레이드", "640": "사이코 필드", "649": "코어 퍼니셔", "650": "트로피컬 킥", "652": "부리 캐논", "653": "스케일 노이즈", "654": "드래곤 해머", "655": "세차게 휘두르기", "657": "트랩 셸", "658": "플뢰르 캐논", "660": "분함의 발구르기", "661": "섀도 본", "662": "액셀 록", "663": "아쿠아 브레이크", "664": "프리즘 레이저", "665": "메테오 드라이브", "666": "섀도 레이", "668": "찌리리 따끔따끔", "670": "멀티 어택", "672": "섀도 스틸", "720": "깜짝 헤드", "744": "다이맥스 포", "745": "노려 맞히기", "746": "물고 버티기", "749": "타르 샷", "751": "드래곤 애로", "778": "드럼 어택", "783": "오라 휠", "784": "와이드 브레이커", "787": "사과 산", "789": "소울 크래시", "793": "사죄의 찌르기", "794": "스타 어설트", "796": "철제 광선", "799": "스케일 샷", "800": "메테오 빔", "803": "그래스 슬라이더", "813": "트리플 악셀", "818": "수류 연타", "821": "얼어붙는 시선", "822": "타오르는 분노", "823": "천둥 차기", "824": "블리자드 랜스", "826": "섬뜩한 주문", "837": "승리의 춤", "840": "오라 윙", "844": "백귀 야행", "846": "찬바람 폭풍", "847": "번개 폭풍", "848": "열사의 폭풍", "856": "한판 내기", "862": "대검 돌격", "875": "사이코 블레이드", "878": "액셀 브레이크", "879": "라이트닝 드라이브", "887": "하이퍼 드릴", "890": "아머 캐논", "893": "거대 해머", "904": "덩굴 방망이", "906": "테라 클러스터", "919": "악독 사슬", "4041": "테라 버스트: 황옥", "4042": "테라 버스트: 취옥", "4043": "테라 버스트: 천람", "4044": "테라 버스트: 금홍", "4045": "테라 버스트: 자수", "4046": "테라 버스트: 첨정", "4047": "테라 버스트: 자황", "4048": "테라 버스트: 취동", "4049": "테라 버스트: 청금", "4050": "테라 버스트: 홍옥", "4051": "테라 버스트: 벽옥", "5000": "100만 볼트", "5001": "10만 볼트", "6000": "오리진 볼트 태클", "6001": "우정의 100만 볼트", "6003": "극 매지컬 샤인", "6004": "공명하는 부르짖기", "6005": "전광석화 자재", "6006": "그림자 분신 변환", "6007": "핑크 다이아 스톰", "6008": "히트 하이드로 펌프", "6009": "베놈 크로스 포이즌", "6010": "타오르는 분노: 열", "6011": "천둥 차기: 굉", "6012": "얼어붙는 시선: 협", "6013": "속박의 째려보기", "6014": "강탈의 깜짝 베기", "6015": "와일드 일렉트릭 네트", "6016": "해신의 방어", "6017": "칼춤: 강", "6018": "네오 사이코 커터", "6019": "잎날 가르기: 예인", "6020": "냉동 빔: 빙무", "6021": "청정의 파도 타기", "6022": "트리플 악셀: 쇄", "6023": "와이드 브레이커: 참", "6024": "전광쌍격: 신", "6025": "빙익의 냉동 빔", "6026": "뇌익의 날개 쉬기", "6027": "염익의 플레 어 드라이브", "6028": "G 기가 임팩트", "6029": "결의의 멀리 짖음", "6030": "파쇄의 지진", "6031": "비검천중파: 진", "6032": "3연화살: 장마", "6033": "원념의 땅고르기", "6034": "스타 드레인 키스", "6035": "열광 오물 웨이브", "6036": "슬픔의 오버드라이브", "6038": "기가 하드 플랜트", "6039": "영탄의 옛 노래", "6040": "칠흑의 역린", "6041": "빙설의 저리 가루", "6042": "괴염 깜짝 헤드", "6043": "절빙 눈사태", "6044": "초광★ 전자포", "6045": "페르세 플뢰르 캐논", "6046": "하이퍼 트림", "6047": "투혼 고드름 떨구기", "6048": "최면술: 몽환", "6053": "묘기: 손가락 흔들기", "6054": "프로토 어시스트 파워", "6055": "스파이럴 메가 혼", "6056": "메탈 불릿 펀치", "6057": "노도의 진흙 뿌리기", "6058": "단단 거대 해머", "6059": "소름 돋는 연기의 거짓 울음", "6060": "네오 블라스트 번", "6061": "유혹의 이상한 빛", "6062": "흑풍: 찬바람 폭풍", "6063": "백광: 성스러운 칼", "6064": "탄환 하이퍼 드릴", "6065": "열화의 화염 바퀴", "6066": "독이 흘러나오는 셸 암즈", "6067": "고상하고 썰렁한 개그", "6068": "혼수 버섯 포자", "6069": "여름빛 섀도 볼", "6070": "물가의 괴상한 바람", "6071": "독이 흘러나오는 셸 암즈", "6072": "회생의 물고 버티기", "6073": "대 암석 봉인", "6074": "할로우 메테오 빔", "6075": "맹위의 치근거리기", "6076": "지진: 파천", "6077": "불릿 펀치: 순천", "6078": "파괴 광선: 굉천", "6079": "천금 골드러시", "6080": "전력 메테오 드라이브", "6081": "풀 하이드로 캐논", "6082": "퍼펙트 도각참", "6083": "아쿠아 브레이크 삼바", "6084": "테러 섀도 볼", "6085": "주빙의 눈보라", "6086": "승염의 병상첨병", "6087": "강뢰의 와일드 볼트", "6088": "얼어붙은 바람: 여빙", "6089": "사이코키네시스: 효광", "6090": "우애의 분노의 주먹", "6094": "꿀꺽: 대식", "6095": "깨물어 부수기: 폭식", "6096": "폭염 매지컬 플레임", "6097": "비기: 맹독 스모그", "6098": "속박의 뱀 눈초리", "6099": "금강 아이언 헤드", "6104": "S: 액셀 브레이크", "6105": "V: 라이트닝 드라이브", "6106": "블레스 시드 플레어", "6107": "에너지 볼: 요란", "6108": "지열의 들이받기", "6109": "단애의 칼: 홍", "6110": "근원의 파동: 남", "6111": "나이트 버스트: 명천", "6112": "감미로운 애교 부리기", "6113": "거수참: 창아", "6114": "성스러운 불꽃: 홍염", "6115": "러브 매지컬 샤인", "6116": "청람 오라 윙", "6117": "춘풍 스케일 샷", "6118": "백귀 야행: 봉마", "6119": "견고 철제 광선", "6120": "사혼의 섀도 볼", "6121": "파괴 광선: 양천", "6122": "벌레의 야단법석: 양염", "6123": "질풍신뢰 ★ 풀 일렉트릭", "6124": "번개 폭풍: 소뢰", "6125": "기합 구슬: 연기", "6126": "솔 메테오 드라이브", "6127": "루나 섀도 레이", "6128": "여름하늘 깃털 댄스", "6129": "매혹의 달콤한 향기", "6130": "길고높은 드래곤 해머", "6131": "속여 때리기: 앞", "6132": "속여 때리기: 뒤", "6133": "에어로블라스트: 성해", "6134": "성스러운 불꽃: 성천", "6135": "한여름의 탁류", "6136": "서니 솔라 빔", "6137": "은백의 흰 안개", "6138": "거암의 철벽", "6139": "붉게익은 쾌청", "6141": "파괴 광선: Z", "6142": "휘조의 드래곤 클로", "6143": "보배의 역린", "6144": "유성의 전광석화", "6145": "환광의 병상첨병", "6146": "기라의 파괴 광선", "6147": "파계의 섀도 다이브", "6148": "찬바람 폭풍: 엄동", "6149": "번개 폭풍: 진하", "6150": "열사의 폭풍: 심추", "6151": "염화의 바위 깨기", "6152": "세석의 스톤 샤워", "6153": "승리의 춤: 영화", "6154": "두꺼운 털의 방어", "6155": "귀염 사악한 거짓 울음", "6156": "무화의 플레어 드라이브", "6157": "수압의 아쿠아 테일", "6158": "폭풍: 성람", "6159": "에어 슬래시: 천인", "6160": "헌신의 철벽", "6161": "열혈의 10만 마력", "6162": "콜드 플레어: 제로", "6163": "인광의 사이코 블레이드", "6164": "악독 사슬: 식", "6165": "불 같이 매운 오버 히트", "6166": "경질 우드 해머", "6167": "대검 돌격: 정", "6169": "한판 내기: 연", "6170": "유경의 그림자 꿰매기", "6171": "왕룡의 베어 가르기", "6172": "스톤 샤워: 천괴", "6173": "스톤 에지: 천관", "6174": "거품 광선: 성포", "6175": "하이드로 펌프: 성류", "6176": "푸른 사랑의 치근거리기", "6177": "암벽의 대지의 힘", "6178": "영원의 10만 볼트", "6181": "악귀의 사죄의 찌르기", "6182": "도원의 명상", "6183": "만록의 덩굴 방망이", "6184": "극채색 테라 클러스터", "6185": "파동탄: 신기", "6186": "바위 깨기: 천파", "6187": "환상 빔: 신통", "6188": "사이코키네시스: 신식", "6189": "사념의 박치기: 혜안", "6190": "강철 날개: 흑강", "7000": "거다이 재생", "7001": "거다이 환영", "7002": "무한다이 빔", "7003": "다이 어택", "7005": "다이 너클", "7007": "다이 제트", "7008": "다이 제트", "7009": "다이 애시드", "7010": "다이 애시드", "7011": "다이 어스", "7012": "다이 어스", "7013": "다이 록", "7016": "다이 웜", "7018": "다이 할로우", "7019": "다이 스틸", "7021": "다이 번", "7022": "다이 번", "7024": "다이 스트림", "7025": "다이 그래스", "7026": "다이 그래스", "7027": "다이 썬더", "7028": "다이 썬더", "7030": "다이 사이코", "7033": "다이 드라군", "7034": "다이 드라군", "7038": "다이 페어리", "7039": "다이 월", "7040": "거다이 천벌", "7041": "거다이 연격", "7042": "거다이 만뢰", "7043": "거다이 분석", "7044": "거다이 선율", "7045": "거다이 난타", "7046": "거다이 만뢰", "7047": "거다이 옥염", "7048": "거다이 악취", "7049": "거다이 강철진", "7050": "거다이 화염구", "7051": "거다이 감전", "7052": "거다이 백화", "7053": "거다이 백화", "7054": "거다이 수마", "8011": "잠재 파워", "8044": "잠재 댄스", "8201": "관동의 분석", "8202": "관동의 결속", "8203": "성도의 정열", "8204": "성도의 분석", "8206": "호연의 정열", "8207": "호연의 분석", "8208": "호연의 결속", "8210": "신오의 분석", "8211": "신오의 결속", "8212": "하나의 정열", "8214": "하나의 결속", "8217": "칼로스의 결속", "8219": "알로라의 분석", "8220": "알로라의 결속", "8222": "가라르의 분석", "8224": "팔데아의 정열", "8225": "팔데아의 분석", "8229": "파시오의 결속", "10000": "승리의 확신", "10007": "승리의 터프니스", "10008": "승리의 전략", "10009": "영광의 필승법", "10010": "쉽지 않을 걸!", "10021": "숲의 힘을!", "10024": "온 스테이지!", "10028": "잠입 개시!", "10030": "더 강해지겠어", "10039": "함께 나누는 영광", "10040": "지지 않아!", "10041": "승리의 V!", "10045": "열이 오르는데!", "10046": "불타는 투지의 영광", "10049": "기합과 근성!", "10050": "각오는 됐겠지?", "10059": "좋은 대답이야!", "10070": "여기야 여기!", "10071": "정말 ~ 나 화났어!", "10074": "사이좋게 지내자!", "10075": "혹시 무서워?", "10079": "이길 거야~!!", "10080": "손질해 드릴게요", "10081": "좋은 날씨네요", "10084": "꽃을 꽂아볼까요", "10088": "꽃피워 볼까요", "10089": "지지 않아요", "10090": "최선을 다하마!", "10110": "이성을 날려 버려!", "10111": "포이즌 라이브!", "10120": "지금이 승부처!", "10121": "높은 곳을 향할 거야!", "10128": "타이밍을 기다리겠어!", "10129": "화려하게 등장!", "10130": "후회 없이 싸우겠어", "10140": "최선을 다하자", "10148": "무엇을 해야 할까?", "10149": "영광의 사색", "10150": "나의 굳은 의지", "10151": "다음에 끝낸다!", "10159": "유대는 딱딱해!", "10160": "단번에 날자!", "10170": "다 함께 가자!", "10171": "내가 지킬 거야!", "10178": "애정을 부딪칠 거야!", "10179": "영광의 등불", "10180": "더 빨리 간다", "10181": "공부의 성과야!", "10189": "완벽하게 예습했어!", "10190": "승리의 길을 열겠어", "10191": "날려 버리며 가자!", "10198": "대공을 날아다녀!", "10199": "푸른 하늘에 빛나는 영광", "10200": "혼자가 아니야!", "10201": "노림수는 완벽해!", "10204": "놀라게 할 거야!", "10208": "백의 영웅의 영광", "10210": "자 덤벼 봐!", "10211": "정점에 설 거야!", "10214": "겨우 그 정도냐", "10215": "못 속인다고!", "10216": "영광의 인도", "10218": "실력 좀 봐 볼까!", "10219": "질 수 없다고!", "10220": "그거야 그거", "10240": "승리의 이야기!", "10250": "정신 집중이얏!", "10254": "빠릿빠릿하게 간다!", "10260": "엄청 강하다고", "10264": "열광해 보자!", "10269": "안 질 거야~!", "10270": "초록을 힘으로!", "10274": "안 무섭거든!?", "10280": "이기는 건 나야!", "10290": "핫해질 거야!", "10300": "통하고 있어!", "10310": "이어져 있지!", "10320": "혹독함이 부족하다", "10330": "주저앉지 않아", "10340": "나이스 모티브!", "10341": "그림이 되는군요!", "10360": "대단한 과학의 힘", "10370": "늙어도 꽃을 피운다", "10380": "더 락!", "10390": "정말 멋져!", "10399": "초점을 맞춰 봐", "10400": "강한 마음을 보여라", "10410": "분석 완료!", "10420": "화려하게 춤출게요", "10421": "우아하게 이기겠어요...", "10430": "놀라움의 태풍!", "10440": "더 배우세요", "10450": "연구 성과야!", "10459": "철저하게 조사하자!", "10460": "덤벼 보라구!", "10470": "힘은 무한!", "10480": "승부야말로 모든 것", "10481": "승부를 할까", "10482": "넋을 잃을 것 같아", "10487": "끝은 아니다!", "10488": "모든 것을 걸지", "10490": "유대감을 보여줘!", "10510": "하드하게 간다!", "10519": "서두는 생략!", "10520": "시작해 볼까!", "10530": "포기하지 않아요!", "10540": "시노비의 정수!", "10550": "강철의 반짝임!", "10579": "끝없이 강해지겠다", "10580": "승리의 바람이 분다", "10600": "바람보다 빠르게!", "10619": "제대로 하거라", "10620": "즐겁게 만들어 줘!", "10630": "중요한 순간이군!", "10640": "생각하는 거야...!", "10660": "맡겨 둬라!", "10680": "우리 결속은 견고하다", "10890": "이상을 추구해!", "10891": "나의 수식!", "10894": "진실의 사랑을!", "10896": "멈출 수 없어", "10897": "사랑을 보여 줄게!", "10899": "환상을 보여줄게...!", "10900": "내가 제일이지", "10903": "원석을 찾아서", "10904": "쿨하게 가자!", "10905": "하늘보다도 높이!", "10906": "수수께끼는 풀렸어!", "10910": "즐거운 승부야!", "10911": "가슴이 두근거려!", "10912": "조사 개시야!", "10920": "절대 지지 않아", "10928": "당신을 이기겠습니다!", "10940": "키를 우로 돌려라!", "10950": "따분하게 하지 마", "10954": "장난칠 거야", "10960": "가히 예술이로군요", "10961": "타협은 없습니다!", "10970": "지지 않을 거야!", "10980": "알로라의 바람!", "10981": "더 전력으로!", "10989": "즐기면서 할 거야~!", "10990": "기다리게 하기 없기", "11000": "실력 좀 볼까!", "11009": "영광의 도전", "11010": "에너지 충만", "11011": "선물 한가득", "11018": "영광의 찬가", "11020": "함께 첫걸음!", "11029": "영광의 한걸음", "11050": "우리도 가자!", "11060": "짜릿할 거야!", "11061": "반할 것 같아", "11062": "기분은 상큼!", "11064": "행복을 전해 줄게", "11068": "눈부시게 빛날 거야!", "11069": "함께 실력을 높이자", "11080": "특급열차가 옵니다!", "11082": "물러나 주세요!", "11090": "전속력 전진!", "11094": "안전 운전!", "11100": "계속 피해 주겠어!", "11101": "꽤 하는걸!", "11103": "버티고 공격하겠어!", "11108": "또 공격할 거야!", "11109": "버텨 주겠어!", "11116": "상당한 실력인 것 같군", "11119": "올바르고 강한 마음을!", "11120": "포기하지 않아!", "11121": "이걸로 끝내겠어!", "11129": "금빛의 마음으로!", "11138": "강철의 마음으로!", "11139": "상냥한 불빛을", "11140": "내게는 보여", "11144": "마음을 비우고...", "11149": "우리에게는 보여!", "11150": "전율을 느껴 보자!", "11154": "가슴 뛰는 승부를!", "11159": "충전 완료다!", "11160": "내게 맡겨 줘!", "11161": "즐거운 꿈을!", "11164": "스위트하게 응원!", "11167": "나눠 줄게!", "11168": "슝슝 간다!", "11169": "춤은 완벽해!", "11170": "레디 파이트!", "11184": "새해의 알로라!", "11185": "달의 빛을!", "11190": "이것이 그대 답이다", "11191": "영혼이 요동친다...!", "11198": "훗, 간다...!", "11199": "반드시 지키겠다...!", "11201": "빛이 넘쳐 흐르는 사랑", "11218": "근성을 보여 봐", "11220": "같이 힘내자!", "11226": "쏘아 주겠어!", "11228": "울트라 견디기!", "11229": "신비한 파워다!", "11230": "지그시 노리자!", "11238": "울트라 찬스!", "11239": "기운 듬뿍!", "11240": "마오의 진짜 실력 받아라!", "11244": "오래 기다렸지!", "11250": "파괴해 주마!", "11254": "봐주지 않아!", "11258": "우물쭈물하지 마!", "11261": "준비 OK~!", "11264": "뭉실뭉실 귀엽게", "11267": "별빛 하늘에 빛나는 영광", "11269": "우리 사이는 최고지!", "11274": "쇼를 시작하자!", "11280": "저는 이기겠어요!", "11288": "한 번 봐 주세요!", "11289": "꼭 이겨요!", "11290": "상상력을 발휘해 봐", "11298": "잡아 보시지!", "11299": "그럼 가 볼까!", "11300": "나는 지지 않아", "11301": "마음에 닿겠어!", "11304": "맛있게 먹어!", "11308": "시작해 보자!", "11309": "내일로 이어지는 영광", "11310": "파워 온!", "11330": "꺾어 주지", "11331": "내버려 둘 수 없으니까", "11340": "여기까지 왔구나!", "11350": "원망하기 없기다!", "11360": "세계는 넓어질 거야!", "11364": "다 같이 포켓몬 승부다", "11370": "레츠 고!", "11371": "꿈과 모험의 세계로!", "11390": "같이 가자!", "11397": "우정의 증표!", "11399": "풀어낸 것 같아!", "11400": "놓치지 않는다", "11401": "쓴 맛을 볼 거다", "11406": "끝없는 욕망", "11410": "마음에 들지 않는군요", "11440": "분노를 보여드리죠", "11470": "상대해 주지!", "11479": "날려 버리며 가자고!", "11480": "내겐 보여", "11481": "나는 믿어!", "11484": "연회를 시작하자!", "11488": "네가 볼 수 있으려나?", "11489": "상대해 줄게!", "11490": "계속 춤추겠어!", "11500": "더 높이!", "11508": "아직 날 수 있어!", "11509": "진정한 강함이다!", "11510": "놀라도 좋아요!", "11530": "상대해 드리죠", "11560": "힘을 시험해 보자", "11570": "사뿐하고 화사하게", "11579": "용서해 줘", "11580": "빛나는 능력을 보여드리죠!", "11581": "막을 올려 볼까요!", "11584": "고귀한 영혼을!", "11601": "간다, 캐스팅!", "11602": "월척의 반짝임을!", "11609": "진짜 실력을 봐 주시죠", "11610": "진심으로 임하겠다!", "11620": "함께 싸우자!", "11628": "힘을 빌려줘!", "11629": "가르쳐 줄게!", "11700": "자 그럼 승부다", "11704": "행복을 그리자!", "11760": "책은 좋은 겁니다", "11780": "뒤는 맡기겠습니다!", "11830": "부드럽고 단단하게", "11900": "소울을 담겠어!", "11910": "연구를 위해서!", "11920": "새로운 대지를!", "11930": "처음으로 되돌린다!", "11940": "마음이 없는 세계", "11941": "영원한 악몽을", "11960": "세계를 파괴한다!", "11961": "신념의 불꽃!", "11990": "각오해 두라고!", "12030": "자연스럽게 뚫고 나가자", "12060": "근질근질한 걸!", "12120": "어느 쪽이 강한지!", "12154": "라이브로 승부!", "12160": "쫓아갈 것이다!", "12200": "그럼 간다!", "12400": "언젠가는 주인공!", "12410": "불굴의 투지!", "12424": "먼저 밑손질부터!", "12434": "빗맞히지 않아!", "12438": "물의 오의!", "12440": "역시 굉장해!", "12446": "진심의 에너지!", "12448": "시험해 보겠어!", "12450": "박자에 맞춰 봐!", "12451": "짊어지고 있다고!", "12453": "부딪혀 보자!", "12454": "질 수 없어!", "12456": "질까 보냐!", "12459": "마음을 부딪칠 거야!", "12465": "위대한 핑크", "12467": "이겨야만 합니다!!", "12470": "진정한 힘을 보여주지!", "12474": "프레젠트 타임!", "12480": "뿌리 째 뽑아 드리죠!", "12490": "떠내려 보내 주겠어!", "12494": "선물을 받아 보렴", "12500": "분발해야 할 때입니다", "12504": "나눠 드리죠", "12510": "놓치지 않아...!", "12520": "머리를 뜨겁게!", "12528": "가라 젊은이들아!", "12529": "하나! 둘!", "12560": "이름을 불러줘!", "12561": "라이브 시작이다!", "12570": "이겨야 한다고!", "12574": "힘을 보여주지!", "12578": "얕보지 말라고!", "12590": "맡겨 줘!", "12595": "청춘을 즐길 거야!", "12690": "다 함께 고!", "12720": "자신을 단련하고 있다고", "12790": "레츠 전진!", "12821": "불꽃 놀이 볼~", "12829": "깜짝이야 볼!", "12840": "시간은 서두를수록 좋다고!", "12841": "얼른 와!", "12849": "확인해 볼까", "12850": "떨게 해 주겠어!!", "12860": "보물찾기 하러 출발!", "12864": "번영하라 벽록의 가면!", "12870": "반짝이는 추억!", "12874": "별 같이 빛나라!", "12891": "최고의 승부를!", "12899": "이기고 말겠어!", "12930": "브이 브이 몰아붙여 줄게!", "12940": "머리를 식혀 주겠어", "12960": "인기가 저리더프처럼 쭉쭉", "12966": "번뜩임의 꼬마 전구!", "12967": "나에게 응원을~!", "12969": "캡처하려면 지금이야!", "13000": "에너지를 줘!", "13010": "악의 극비 기술!", "13020": "열심히 해보라고!", "13029": "발밑을 조심하라고", "13040": "단순 명료한 게 좋은 겁니다", "13049": "서비스를 해 드리죠", "13170": "많이 기다렸지!", "13174": "실력을 발휘하겠어!", "13188": "테마는 보물찾기!", "13200": "재가 되어라!", "13280": "소인의 독의 진수", "13290": "큰 거 간다!", "13350": "가라 드래곤!", "13370": "성형 시작이다!!", "13510": "잘 어울리네", "13562": "팍 꺾어 줄게!", "13630": "기세를 타고 갑니다!", "13640": "산은 좋다고!", "14999": "좋아 가자!", "16106": "강하고 아름답게", "16550": "피카! 피~카!", "16560": "브이! 이브이!", "16580": "공격 타이밍의 냄새!", "17000": "시작의 한걸음", "17001": "불타는 희망", "17011": "태양의 반짝임", "17012": "거석의 수호", "17013": "감청의 정의", "17015": "쇠철의 갑옷", "17016": "휘핑 스텝!", "17100": "호흡을 맞춰서!", "17101": "기세를 몰아서!", "17102": "틈을 노려!", "17104": "단숨에 간다!", "17105": "다들 버텨 줘!", "17106": "빈틈없이 공격하자!", "17107": "기합을 높이자!", "18500": "자뭉 열매", "19001": "미니 상처약G", "19010": "플러스 파워", "19011": "플러스 파워G", "19020": "디펜드 업", "19021": "디펜드 업G", "19023": "디펜드 업G+", "19030": "스페셜 업", "19031": "스페셜 업G", "19040": "스페셜 가드", "19041": "스페셜 가드G", "19043": "스페셜 가드G+", "19050": "스피드 업", "19051": "스피드 업G", "19052": "스피드 업+", "19053": "스피드 업 G+", "19080": "크리티컬 커터", "19081": "크리티컬 커터G", "19082": "크리티컬 커터+", "19083": "크리티컬 커터G+", "19100": "기술게이지 업", "19120": "다음은 크리티컬", "19121": "다음은 크리티컬G", "19160": "발군 업", "19170": "부스트 에너지", "19560": "고드름의 소원", "19570": "주먹의 소원", "19580": "맹독의 소원", "19590": "대지의 소원", "19600": "푸른 하늘의 소원", "19620": "비단벌레의 소원", "19630": "암석의 소원", "19640": "원령의 소원", "19650": "용의 소원", "19660": "공포의 소원", "19670": "강철의 소원", "19680": "정령의 소원", "19720": "사이코필드의 소원", "19800": "이펙트 가드", "19810": "리플렉터 배리어", "19820": "빛의 배리어", "19830": "이상 미러", "19840": "이펙트 미러", "19850": "변화 가드", "19860": "크리티컬 가드", "19870": "신비의 가드", "30100": "버디즈 노말 임팩트", "30200": "버디즈 파이어 임팩트", "30300": "버디즈 워터 임팩트", "30400": "버디즈 일렉트릭 임팩트", "30500": "버디즈 그래스 임팩트", "30600": "버디즈 아이스 임팩트", "30700": "버디즈 파이팅 임팩트", "30800": "버디즈 포이즌 임팩트", "30900": "버디즈 그라운드 임팩트", "31000": "버디즈 플라잉 임팩트", "31100": "버디즈 사이킥 임팩트", "31200": "버디즈 버그 임팩트", "31300": "버디즈 록 임팩트", "31400": "버디즈 고스트 임팩트", "31500": "버디즈 드래곤 임팩트", "31600": "버디즈 다크 임팩트", "31700": "버디즈 스틸 임팩트", "31800": "버디즈 페어리 임팩트", "40100": "버디즈 노말 레이", "40200": "버디즈 파이어 레이", "40300": "버디즈 워터 레이", "40400": "버디즈 일렉트릭 레이", "40500": "버디즈 그래스 레이", "40600": "버디즈 아이스 레이", "40700": "버디즈 파이팅 레이", "40800": "버디즈 포이즌 레이", "40900": "버디즈 그라운드 레이", "41000": "버디즈 플라잉 레이", "41100": "버디즈 사이킥 레이", "41200": "버디즈 버그 레이", "41300": "버디즈 록 레이", "41400": "버디즈 고스트 레이", "41500": "버디즈 드래곤 레이", "41600": "버디즈 다크 레이", "41700": "버디즈 스틸 레이", "41800": "버디즈 페어리 레이", "50403": "난폭한 뇌신에게 바치는 스파킹 기가 볼트", "50502": "평소에는 상냥한 블룸 샤인 엑스트라", "50802": "각오를 다지는 애시드 포이즌 딜리트", "51101": "천진난만하게 놀리는 맥시멈 사이 브레이커", "51102": "하늘 높이 빛나는 맥시멈 사이브레이커", "51202": "뭔가를 바꿀 절대 포식 회전참", "51302": "마음이 쌓이는 월즈 엔드 폴", "51303": "귀여운 몸짓의 월즈 엔드 폴", "51602": "밤하늘에 떠오르는 블랙홀 이클립스", "51802": "바다색을 칠하는 러블리 스타 임팩트", "60900": "리빙 레전드 블러스트번", "63200": "우리의 모든 것을 알려주는 브레이즈킥", "63700": "세계에서 제일 아름답고 고상한 다이아 스톰", "63900": "눈 내리는 밤을 인도하는 일렉트릭 레이", "64000": "한번에 베기 리프 블레이드", "64600": "뻔쩍뻔쩍하고 단단한 스틸 임팩트", "64800": "길흉을 점치는 다크 임팩트", "73200": "세상에 날갯짓하는 에어컷터", "75000": "올곧은 마음의 드래곤크루", "79400": "평생 잊을 수 없는 독엄니", "80100": "유일무이한 다른차원홀", "80700": "과자를 탐내는 섀도크루", "83300": "세계를 완전히 지배하는 얼다세계", "84100": "유일무이한 다른차원홀", "88400": "시대를 초월해 싹트는 메지컬리프", "88700": "파트너를 믿는 아프로 브레이크", "90700": "승리를 향해 쏘는 벌레의 야단법석", "90800": "무한히 샘솟는 투혼의 V 제너레이트", "91000": "세상을 바꿀 마음이 빛나는 프리즈 볼트", "91300": "깔끔한 솜씨로 농락하는 물 수리검", "91400": "투지를 품은 깜짝 베기", "91500": "멋진 여행의 추억을 만드는 바늘 팔", "93800": "아름다운 나라를 세우는 하이드로 펌프", "93900": "진심으로 베어내는 깜짝 베기", "94000": "눈으로는 볼 수 없는 질풍의 물 수리검", "94100": "얼마든지 행복을 전하는 노말 임팩트", "94200": "사건을 해결하는 크로스 포이즌", "94400": "조사에 대한 열의가 불타는 파이어 레이", "94500": "찌릿찌릿 번뜩이는 일렉트릭 레이", "94600": "호기심이 녹아드는 워터 레이", "94700": "무한대로 눈부신 일렉트릭 레이", "94800": "시작의 길에서 지저귀는 플라잉 임팩트", "95200": "콩닥콩닥☆드림의 페어리 임팩트", "95300": "새해를 우아하게 맞이하는 고스트 레이", "95400": "늠름하게 뛰어다니는 하이드로 펌프", "95500": "널 위해 최강을 바라는 트리플 악셀", "95600": "검은색의 아름다움에 걸맞은 페어리 레이", "95700": "초목의 힘을 모아 발하는 버그 레이", "95800": "재료의 맛이 빛나는 최강의 드래곤 레이", "95900": "슈가 뷰티 플라잉 임팩트", "96000": "어떤 임무든지 해결하는 노말 임팩트", "96100": "보이지 않는 것이 보이는 고스트 레이", "96400": "빨라지는 시간의 잎날 가르기", "96500": "넓은 세계로 발을 내딛는 냉동 빔", "96600": "사건의 어둠을 밝히는 노말 임팩트", "96700": "모든 조각이 모인 스틸 레이", "96800": "승리를 받아 가는 다크 임팩트", "96900": "귀엽게 속이는 그라운드 임팩트", "97000": "태고의 로망을 느끼는 록 레이", "97400": "부술 수 없는 굳은 각오의 아이스 임팩트", "97500": "슈퍼 파워 록 임팩트", "97600": "포즈를 취하는 고스트 임팩트", "97700": "오랜 경험이 살아 있는 포이즌 임팩트", "97800": "어지간한 수비엔 끄떡없는 드래곤 레이", "97900": "어물쩍대지 않고 발하는 워터 레이", "99600": "좋아하는 파트너와 걷는 브이브이 브레이크", "99800": "반짝 빛나는 천재 해커의 차밍 보이스", "100400": "세피아색 기억이 되살아나는 옛 노래", "101900": "사이좋은 파트너와 달리는 피카피카 썬더", "102000": "상냥함으로 서로를 지탱하는 영혼의 플뢰르 캐논", "103300": "이성을 싹 날려주는 포이즌 레이", "103400": "뜨거운 소울로 외치는 스타의 드래곤 레이", "103500": "최고의 기술을 펼치는 포이즌 임팩트", "103600": "조용히 번성하는 심록의 그래스 레이", "103700": "더블 이브이의 노말 레이", "103800": "뜨거운 마음에 공명하는 드래곤 클로", "104000": "팔데아리그 면접관의 대지의 힘", "104100": "단단해서 강한 거대 해머", "104200": "도전자의 벽이 되고 싶은 찬바람 폭풍", "104300": "새로운 길을 향해 내딛는 성스러운 칼", "104400": "행복을 싣고 달리는 그래스 임팩트", "104500": "빙설에 흩날리는 환상적인 버그 레이", "104600": "딱딱하고 차갑고 날카롭고 강한 스틸 임팩트", "104700": "새해를 축하하며 춤추는 드래곤 레이", "104800": "타오르는 엘레강트한 파이어 레이", "104900": "짜릿한 승부를 바라는 일렉트릭 레이", "105000": "흰색의 아름다움에 지지 않는 페어리 레이", "105100": "비범한 샐러리맨의 하이퍼 드릴", "105200": "요리의 즐거움을 알려주는 노말 임팩트", "105300": "추억의 맛을 재현하는 아이스 임팩트", "105400": "힘이 솟는 노말 임팩트", "105500": "더블 피카츄의 일렉트릭 레이", "105600": "파동에 이끌린 파이팅 임팩트", "106200": "고요한 날갯짓의 플라잉 레이", "106300": "내 취향의 페어리 레이", "107200": "마법 나라를 지배하는 사이킥 임팩트", "107300": "세계를 악으로 물들이는 다크 레이", "107400": "마음가짐과 실력을 시험하는 그라운드 레이", "107500": "라이벌 의식을 불태우는 파이어 레이", "107700": "영원히 불타는 사나이의 파이어 임팩트", "107800": "이상으로 다가가기 위한 다크 레이", "107900": "대박 귀엽고 퍼펙트한 포이즌 레이", "108000": "엘레강스한 에스퍼의 사이킥 레이", "108100": "심기체를 마스터한 대장의 그래스 임팩트", "108200": "용기를 쥐어짜서 나아가는 고스트 레이", "108300": "보름달이 뜨는 밤에 바다로 유인하는 고스트 레이", "108500": "끝없는 욕망을 채우는 깨물어 부수기", "108600": "타올라 터지는 해결사의 아머 캐논", "108700": "오타쿠의 길을 가는 의상 담당의 더스트 슈트", "108800": "짜릿한 배틀의 일렉트릭 레이", "108900": "불꽃과 함께 위를 노리는 파이어 레이", "109000": "전력을 다할 수 있어서 기쁜 록 임팩트", "109100": "반드시 더 강해질 드래곤 임팩트", "109200": "모두 쓰러뜨릴 거야!! 플라잉 레이", "109300": "넓은 세계를 보여주는 아이스 임팩트", "109400": "계속 끈질기게 버티는 다크 임팩트", "110000": "너만의 이야기를 시작하는 포이즌 임팩트", "110200": "마구 승리하는 완벽한 사이킥 레이", "111300": "오렌지 무르익는 고대의 액셀 브레이크", "111400": "그레이프 무르익는 미래의 라이트닝 드라이브", "111500": "비구름을 걷는 대지의 화신의 단애의 칼", "111600": "폭풍을 부르는 바다의 화신의 근원의 파동", "112100": "변환자재의 신기 나이트 버스트", "113200": "천하무쌍의 신기 벌레의 야단법석", "113700": "미래를 짊어질 엘리트의 기합 구슬", "114100": "좋아요의 순간을 찍는 그라운드 임팩트", "114200": "완벽하게 끝내는 일렉트릭 임팩트", "114300": "꽃의 아름다움을 사랑하는 페어리 레이", "114400": "넓은 바다에 마음을 싣는 워터 레이", "114800": "실력을 파악해 꿰뚫는 워터 레이 ", "115100": "감사와 용기가 꽃피는 그래스 레이", "115200": "화사한 감사를 키우는 그래스 레이", "115300": "두근두근 콩닥콩닥한 승부의 페어리 레이", "115400": "마음은 흔들리지 않는 그라운드 임팩트", "115600": "아카데미를 짊어진 자의 그래스 임팩트", "115700": "반짝임을 영원히 새기는 록 임팩트", "115800": "정말 즐거운 아이스 임팩트", "115900": "활짝 갠 하늘을 나는 플라잉 레이", "116000": "꺾이지 않는 딱딱한 의지의 록 임팩트", "116100": "마음을 나누며 대공에서 춤추는 플라잉 임팩트", "116200": "설산이 베푸는 공포의 아이스 임팩트", "116300": "요정왕의 검이 발하는 스틸 임팩트", "116400": "불타는 하트의 파이어 임팩트", "116500": "굉장한 기세의 일렉트릭 레이", "116600": "단련하고 또 단련한 비장의 다크 레이", "116700": "단련된 강철 몸의 스틸 임팩트", "117600": "강함의 증명이 찬란히 빛나는 스틸 레이", "118400": "고생을 거듭한 강함을 원하는 순수의 버그 레이", "118500": "조용한 이미지를 바꾸는 일렉트릭 레이", "118600": "고대의 꿈이 날갯짓하는 록 임팩트", "118700": "꽃향기의 노말 임팩트", "118800": "분한 마음이 점점 부푸는 노말 임팩트", "118900": "화려하게 도약해 날리는 파이팅 임팩트", "119000": "뜨거운 머리로 상대를 알아내는 파이어 레이", "119100": "산꼭대기에서 외치는 황금빛 버그 임팩트" }, "zh": { "626": "泡影詠歎調", "840": "氣場 之翼", "844": "群魔 亂舞", "845": "秘劍 千重濤", "4041": "太晶爆發 黃玉", "4042": "太晶爆發 翠玉", "4043": "太晶爆發 天藍", "4044": "太晶爆發 金紅", "4045": "太晶爆發 紫晶", "4046": "太晶爆發 尖晶", "4047": "太晶爆發 紫黃", "4048": "太晶爆發 翠銅", "4049": "太晶爆發 青金", "4050": "太晶爆發 虹玉", "4051": "太晶爆發 碧玉", "6005": "電光一閃 自在", "6006": "影子分身 變幻", "6010": "怒火中燒 烈", "6011": "雷鳴蹴擊 轟", "6012": "冰冷視線 脅", "6013": "制縛之 瞪眼", "6016": "海神之 守住", "6017": "劍舞 剛", "6019": "飛葉快刀 銳刃", "6020": "冰凍光束 冰舞", "6022": "三旋擊 碎", "6023": "廣域破壞 斬", "6024": "電光雙擊 迅", "6028": "G 終極衝擊", "6031": "真打秘劍 千重濤", "6032": "三連箭 五月雨", "6033": "怨念之 重踏", "6034": "天星 吸取之吻", "6035": "狂熱 污泥波", "6036": "哀響 破音", "6038": "終極 瘋狂植物", "6040": "漆黑之 逆鱗", "6041": "凍蝶之 麻痺粉", "6044": "超光★ 電磁炮", "6045": "突圍 花朵加農炮", "6047": "鬥魂 冰柱墜擊", "6048": "催眠術 夢幻", "6051": "突飛猛撲 朦朧", "6052": "冤冤相報 幻妖", "6053": "妙技 揮指", "6054": "原型 輔助力量", "6055": "螺旋 超級角擊", "6056": "金屬 子彈拳", "6059": "詭怪演技 之假哭", "6061": "誘惑之 奇異之光", "6062": "黑風 枯葉風暴", "6063": "白光 聖劍", "6065": "烈火之 火焰輪", "6072": "重振旗鼓之 緊咬不放", "6075": "威勢猛烈之 嬉鬧", "6076": "地震 破天", "6077": "子彈拳 瞬天", "6078": "破壞光線 轟天", "6079": "千金 淘金潮", "6081": "全力 加農水炮", "6082": "完美仆斬", "6083": "水流裂破 森巴", "6084": "恐怖 暗影球", "6086": "昇焰之 禍不單行", "6087": "降雷之 瘋狂伏特", "6088": "冰凍之風 麗冰", "6089": "精神強念 曙光", "6091": "大字爆炎 神火", "6092": "星夜的 魅惑之聲", "6093": "蟲鳴之 吸血", "6094": "吞下 暴飲", "6095": "咬碎 暴食", "6096": "爆炎之 魔法火焰", "6097": "秘技 劇毒濁霧", "6098": "沙縛之 大蛇瞪眼", "6099": "金剛之 鐵頭", "6100": "豐饒之 棉孢子", "6101": "爆烈 火焰球", "6102": "亂擂 鼓擊", "6103": "高壓 狙擊", "6104": "S 全開猛撞", "6105": "V 閃電猛衝", "6106": "祝福之 種子閃光", "6107": "能量球 繚亂", "6108": "地裂之 突飛猛撲", "6109": "斷崖之劍 紅", "6110": "根源波動 藍", "6111": "暗黑爆破 暝天", "6112": "甜美 撒嬌", "6113": "巨獸斬 蒼牙", "6114": "神聖之火 虹焰", "6115": "愛的 魔法閃耀", "6116": "青嵐之 氣場 之翼", "6117": "春風之 鱗射", "6118": "群魔 亂舞 逢魔", "6119": "超硬 鐵蹄光線", "6121": "破壞光線 陽天", "6122": "蟲鳴 陽炎", "6124": "鳴雷風暴 召雷", "6125": "真氣彈 練氣", "6126": "日輪 流星閃衝", "6127": "月輪 暗影之光", "6128": "夏日晴空 羽毛舞", "6129": "魅惑的 甜甜香氣", "6131": "出奇一擊 正", "6132": "出奇一擊 反", "6133": "氣旋攻擊 聖海", "6134": "神聖之火 聖天", "6135": "盛夏的 濁流", "6136": "晴陽 日光束", "6137": "銀白 白霧", "6138": "巨岩 鐵壁", "6139": "果實熟紅的 大晴天", "6140": "涼風之 暴風雪", "6141": "破壞光線 Z", "6142": "輝爪之 龍爪", "6143": "寶鱗之 逆鱗", "6144": "流星之 電光一閃", "6145": "幻光之禍不單行", "6146": "絢麗之 破壞光線", "6147": "毀壞世界之 暗影潛襲", "6148": "枯葉風暴 嚴冬", "6149": "鳴雷風暴 盛夏", "6150": "熱沙風暴 深秋", "6151": "火焰纏繞之 碎岩", "6152": "沙礫之 岩崩", "6154": "厚厚的毛之 守住", "6156": "舞火之 閃焰衝鋒", "6157": "壓水之 水流尾", "6158": "暴風 聖嵐", "6159": "空氣斬 天刃", "6160": "無私奉獻之 鐵壁", "6161": "熱血沸騰之 十萬馬力", "6165": "辣到爆炸之 過熱", "6166": "硬質 木槌", "6170": "幽境之縫影", "6171": "王龍之劈開", "6172": "岩崩 天塊", "6173": "尖石攻擊 天穿", "6174": "泡沫光線 聖泡", "6175": "水炮 聖流", "6176": "蒼愛之 嬉鬧", "6177": "岩崖之 大地之力", "6178": "永遠的 十萬伏特", "6179": "起始之 打雷", "6180": "榮耀之 打雷", "6181": "惡鬼之 假跪真撞", "6182": "桃源之 冥想", "6183": "蒼翠萬頃之 棘藤棒", "6184": "極彩晶光 星群", "6185": "波導彈 神氣", "6186": "碎岩 天破", "6187": "幻象光線 神通", "6188": "精神強念 神識", "6189": "意念頭錘 慧眼", "6190": "鋼翼 黑鋼", "7000": "超極巨 資源再生", "7001": "超極巨 幻影幽魂", "7040": "超極巨 天譴雷誅", "7041": "超極巨 流水連擊", "7042": "超極巨 萬雷轟頂", "7043": "超極巨 炎石噴發", "7044": "超極巨 極光旋律", "7045": "超極巨 狂擂亂打", "7046": "超極巨 萬雷轟頂", "7047": "超極巨 地獄滅焰", "7048": "超極巨 臭氣沖天", "7049": "超極巨 鋼鐵陣法", "7050": "超極巨 破陣火球", "7051": "超極巨 異毒電場", "7052": "超極巨 百火焚野", "7053": "超極巨 百火焚野", "7054": "超極巨 睡魔降臨", "8201": "關都 的分析", "8202": "關都 的團結", "8203": "城都 的熱情", "8204": "城都 的分析", "8205": "城都 的團結", "8207": "豐緣 的分析", "8208": "豐緣 的團結", "8210": "神奧 的分析", "8211": "神奧 的團結", "8212": "合眾 的熱情", "8214": "合眾 的團結", "8219": "阿羅拉 的分析", "8220": "阿羅拉 的團結", "8221": "伽勒爾 的熱情", "8222": "伽勒爾 的分析", "8223": "伽勒爾 的團結", "8224": "帕底亞 的熱情", "8225": "帕底亞 的分析", "8226": "帕底亞 的團結", "8229": "帕希歐 的團結", "10071": "吼~我生氣了!", "10079": "我會贏的喔~!!", "10148": "我該做些什麼?", "10168": "起飛!", "10198": "在廣闊天空盡情飛翔吧!", "10215": "你是騙不了我的!", "10254": "要俐落地上囉!", "10341": "就像一幅畫呢!", "10380": "巨石!", "10897": "讓你看看我的愛吧!", "10981": "更加全力以赴!", "10989": "我要盡情享受囉~!", "11119": "剛正不阿之心!", "11129": "胸懷散發金光的心!", "11168": "準備要衝囉!", "11169": "超完美舞步!", "11191": "靈魂激昂……!", "11258": "楞在那裡幹嘛!", "11289": "我們絕對要贏!", "11309": "聯繫 明日的榮耀", "11390": "一起走吧!", "11508": "還能繼續飛!", "11581": "揭開序幕吧!", "11601": "拋竿時機!", "11628": "幫幫我吧!", "11800": "好咧!", "11870": "Au revoir! 再會!", "12154": "舞台就是我的擂台!", "12160": "我會繼續追求!", "12424": "首先是備料!", "12446": "能量百分百!", "12448": "我來試試你的實力!", "12453": "來對戰唄!", "12520": "點燃腦細胞!", "12578": "別小看人了!", "12730": "超、能、力!", "12790": "Let’s 前進!", "12840": "刻不容緩!", "12850": "顫抖吧!!", "12967": "快為我加油打打氣~!", "13000": "把能量交出來!", "13010": "惡之精髓!", "13020": "加把勁啊~!", "13030": "我是很厲害的喔!", "13034": "硬梆梆的～!", "13290": "吃我充滿小心機的一招!", "14999": "好,上吧!", "16550": "皮卡!皮~卡!", "17016": "鮮奶油舞步!", "19001": "迷你傷藥G", "19011": "力量強化G", "19021": "防禦強化G", "19023": "防禦強化G+", "19031": "特攻強化G", "19041": "特防強化G", "19043": "特防強化G+", "19051": "速度強化G", "19058": "EX 速度強化", "19061": "命中強化G", "19071": "閃避強化G", "19081": "要害攻擊G", "19083": "要害攻擊G＋", "19100": "氣槽回復", "19111": "慢性回復G", "19121": "要害直擊G", "19131": "原狀回復G", "19141": "必中鎖定G", "19151": "異常迴避G", "63700": "世界第一 美麗高貴之 鑽石風暴", "63900": "雪夜中的 指引之 電之光線", "88700": "信任搭檔之 爆炸頭突擊", "90600": "追求潛力之 齒輪飛盤", "90700": "朝勝利的所在 擊出之蟲鳴", "90800": "源源不絕的 鬥魂之V熱焰", "91000": "改變世界的 耀眼信念之 冰凍伏特", "91300": "俐落玩弄於 股掌之 飛水手裡劍", "91400": "深藏鬥志之 暗襲要害", "91500": "打造美好的 冒險回憶之 尖刺臂", "93900": "以真心誠意 劈斬之 暗襲要害", "94000": "一閃即逝的 疾風之 飛水手裡劍", "94100": "讓你 幸福個夠之 一般衝擊", "94400": "調查熱忱 熊熊燃燒之 火之光線", "94500": "靈光劈哩啪啦 閃之電之光線", "94600": "融入好奇心之 水之光線", "94700": "無限耀眼之 電之光線", "94800": "啟程路上 鳴啼之 飛行衝擊 ", "95200": "心跳不已☆ 美夢成真之 妖精衝擊", "95300": "高雅賀新年之 幽靈光線", "95600": "無愧黑之美 之妖精光線", "95700": "凝聚草木之力 釋放之 蟲之光線 ", "97600": "擺好姿勢之幽靈光擊", "98100": "工藝製作高手之秘劍･千重濤" } });
  const ROOT_ID = "brybry-enhancer-root";
  const ENHANCER_NAME = "Brybry Pokemas Enhancer";
  const ENHANCER_VERSION = "1.11.120";
  const TILE_LABEL_CLASS = "brybry-tile-label";
  const FILTER_RENDER_DELAY_MS = 500;
  const TRAINER_DATA_URL = "./data/proto/Trainer.json";
  const MOVE_DATA_URL = "./data/proto/Move.json";
  const SCHEDULE_DATA_URL = "./data/proto/Schedule.json";
  const MONSTER_DATA_URL = "./data/proto/Monster.json";
  const MONSTER_BASE_DATA_URL = "./data/proto/MonsterBase.json";
  const MONSTER_VARIATION_DATA_URL = "./data/proto/MonsterVariation.json";
  const TRAINER_BASE_DATA_URL = "./data/proto/TrainerBase.json";
  const TEAM_SKILL_DATA_URL = "./data/proto/TeamSkill.json";
  const TRAINER_EX_ROLE_DATA_URL = "./data/proto/TrainerExRole.json";
  const SUPERAWAKENING_DATA_URL = "./data/proto/TrainerSpecialAwaking.json";
  const ABILITY_PANEL_DATA_URL = "./data/proto/AbilityPanel.json";
  const ABILITY_DATA_URL = "./data/proto/Ability.json";
  const PASSIVE_SKILL_CHILD_DATA_URL = "./data/proto/PassiveSkillChild.json";
  const SKILL_TEMPLATE_PARAMETER_DATA_URL = "./data/proto/MoveAndPassiveSkillDigit.json";
  const TEAM_SKILL_TAG_URLS = {
    en: "./data/lsd/team_skill_tag_en.json",
    fr: "./data/lsd/team_skill_tag_fr.json",
    de: "./data/lsd/team_skill_tag_de.json",
    es: "./data/lsd/team_skill_tag_es.json",
    it: "./data/lsd/team_skill_tag_it.json",
    ja: "./data/lsd/team_skill_tag_ja.json",
    ko: "./data/lsd/team_skill_tag_ko.json",
    zh: "./data/lsd/team_skill_tag_zh-TW.json"
  };
  const MOVE_NAME_URLS = {
    en: "./data/lsd/move_name_en.json",
    fr: "./data/lsd/move_name_fr.json",
    de: "./data/lsd/move_name_de.json",
    es: "./data/lsd/move_name_es.json",
    it: "./data/lsd/move_name_it.json",
    ja: "./data/lsd/move_name_ja.json",
    ko: "./data/lsd/move_name_ko.json",
    zh: "./data/lsd/move_name_zh-TW.json"
  };
  const MOVE_DESCRIPTION_URLS = {
    en: {
      descriptions: "./data/lsd/move_description_en.json",
      descriptionParts: "./data/lsd/move_description_parts_en.json"
    },
    fr: {
      descriptions: "./data/lsd/move_description_fr.json",
      descriptionParts: "./data/lsd/move_description_parts_fr.json"
    },
    de: {
      descriptions: "./data/lsd/move_description_de.json",
      descriptionParts: "./data/lsd/move_description_parts_de.json"
    },
    es: {
      descriptions: "./data/lsd/move_description_es.json",
      descriptionParts: "./data/lsd/move_description_parts_es.json"
    },
    it: {
      descriptions: "./data/lsd/move_description_it.json",
      descriptionParts: "./data/lsd/move_description_parts_it.json"
    },
    ja: {
      descriptions: "./data/lsd/move_description_ja.json",
      descriptionParts: "./data/lsd/move_description_parts_ja.json"
    },
    ko: {
      descriptions: "./data/lsd/move_description_ko.json",
      descriptionParts: "./data/lsd/move_description_parts_ko.json"
    },
    zh: {
      descriptions: "./data/lsd/move_description_zh-TW.json",
      descriptionParts: "./data/lsd/move_description_parts_zh-TW.json"
    }
  };
  const SKILL_TEMPLATE_LOCALE_URLS = Object.fromEntries(Object.keys(MOVE_NAME_URLS).map((locale) => {
    const suffix = locale === "zh" ? "zh-TW" : locale;
    return [locale, {
      numbers: `./data/lsd/passive_skill_and_move_number_${suffix}.json`,
      referencedMessages: `./data/lsd/tag_name_with_prepositions_${suffix}.json`
    }];
  }));
  const PASSIVE_SKILL_SEARCH_URLS = {
    en: {
      names: "./data/lsd/passive_skill_name_en.json",
      nameParts: "./data/lsd/passive_skill_name_parts_en.json",
      descriptions: "./data/lsd/passive_skill_description_en.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_en.json"
    },
    fr: {
      names: "./data/lsd/passive_skill_name_fr.json",
      nameParts: "./data/lsd/passive_skill_name_parts_fr.json",
      descriptions: "./data/lsd/passive_skill_description_fr.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_fr.json"
    },
    de: {
      names: "./data/lsd/passive_skill_name_de.json",
      nameParts: "./data/lsd/passive_skill_name_parts_de.json",
      descriptions: "./data/lsd/passive_skill_description_de.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_de.json"
    },
    es: {
      names: "./data/lsd/passive_skill_name_es.json",
      nameParts: "./data/lsd/passive_skill_name_parts_es.json",
      descriptions: "./data/lsd/passive_skill_description_es.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_es.json"
    },
    it: {
      names: "./data/lsd/passive_skill_name_it.json",
      nameParts: "./data/lsd/passive_skill_name_parts_it.json",
      descriptions: "./data/lsd/passive_skill_description_it.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_it.json"
    },
    ja: {
      names: "./data/lsd/passive_skill_name_ja.json",
      nameParts: "./data/lsd/passive_skill_name_parts_ja.json",
      descriptions: "./data/lsd/passive_skill_description_ja.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_ja.json"
    },
    ko: {
      names: "./data/lsd/passive_skill_name_ko.json",
      nameParts: "./data/lsd/passive_skill_name_parts_ko.json",
      descriptions: "./data/lsd/passive_skill_description_ko.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_ko.json"
    },
    zh: {
      names: "./data/lsd/passive_skill_name_zh-TW.json",
      nameParts: "./data/lsd/passive_skill_name_parts_zh-TW.json",
      descriptions: "./data/lsd/passive_skill_description_zh-TW.json",
      descriptionParts: "./data/lsd/passive_skill_description_parts_zh-TW.json"
    }
  };
  const FILTER_ICON_BASE = "https://pomasters.github.io/SyncPairsTracker/images/";
  const MOVE_LEVEL_ICON_BASE = "https://pomasters.github.io/SyncPairsTracker/images/";
  const PROJECT_GITHUB_URL = "https://github.com/charlie5188/brybry-pokemas-enhancer";
  const MASTER_PASSIVE_ICON_URLS = {
    physical: "https://pomatools.github.io/assets/img/battle/STAT_002R.png",
    special: "https://pomatools.github.io/assets/img/battle/STAT_008R.png"
  };
  const FILTER_SECTION_ICON_URLS = {
    region: "https://www.pomatools.site/assets/images/icon_theme_region.png",
    trainerGroup: "https://www.pomatools.site/assets/images/icon_theme_trainergroup.png",
    fashion: "https://www.pomatools.site/assets/images/icon_theme_fashion.png",
    other: "https://www.pomatools.site/assets/images/icon_theme_other.png"
  };
  const PICKER_PREFERENCES_KEY = "brybry-enhancer-picker-preferences";
  const GRID_PREFERENCES_KEY = "brybry-enhancer-sync-grid-builds";
  const PREFERENCE_VERSION = 4;
  const SPOILER_REDIRECT_KEY = "brybry-enhancer-spoiler-redirect";
  const SETTINGS_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>';
  const SORT_DIRECTION_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7"/></svg>';
  const VIEW_ICONS = {
    list: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13"/></svg>',
    icons: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>'
  };
  const STATUS_INFLICT_PATTERNS = {
    poison: [["leaves", "target", "poisoned"], ["leaving", "target", "poisoned"], ["leaves", "opposing", "poisoned"], ["leaves", "opponent", "poisoned"]],
    burn: [["leaves", "target", "burned"], ["leaving", "target", "burned"], ["leaves", "opposing", "burned"], ["leaves", "opponent", "burned"]],
    paralysis: [["leaves", "target", "paralyzed"], ["leaving", "target", "paralyzed"], ["leaves", "opposing", "paralyzed"]],
    sleep: [["puts", "target", "sleep"], ["putting", "target", "sleep"], ["puts", "opposing", "sleep"]],
    freeze: [["leaves", "target", "frozen"], ["leaving", "target", "frozen"], ["leaves", "opposing", "frozen"]]
  };
  const INTERFERENCE_INFLICT_PATTERNS = {
    flinch: [["makes", "target", "flinch"], ["making", "target", "flinch"], ["leaves", "target", "flinch"], ["leaves", "opposing", "flinch"]],
    confusion: [["leaves", "target", "confused"], ["leaving", "target", "confused"], ["leaves", "opposing", "confused"]],
    trap: [["leaves", "target", "trapped"], ["leaving", "target", "trapped"], ["leaves", "opposing", "trapped"]]
  };
  const OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS = [
    ["returns", "target", "raised stats", "to normal"],
    ["returns", "raised stats", "opposing sync pairs", "to normal"]
  ];
  const IMMUNITY_FILTER_PATTERNS = {
    statusImmunity: [
      ["prevents", "getting", "status condition"],
      ["prevents", "status conditions", "being inflicted"],
      ["status conditions cannot be inflicted"]
    ],
    statReductionImmunity: [
      ["prevents", "stats", "being lowered"],
      ["stats cannot be lowered"],
      ["stats would be lowered", "same amount instead"]
    ],
    interferenceImmunity: [
      ["prevents", "flinching", "confused", "trapped"],
      ["prevents", "flinching", "becoming confused", "trapped"]
    ],
    criticalHitImmunity: [
      ["prevents", "critical hits"],
      ["protects", "against critical hits"],
      ["protected against critical hits"]
    ]
  };
  const STATUS_IMMUNITY_DETAIL_PATTERNS = {
    allStatusImmunity: IMMUNITY_FILTER_PATTERNS.statusImmunity,
    poisonImmunity: [["prevents", "getting poisoned"], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
    burnImmunity: [["prevents", "getting burned"], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
    paralysisImmunity: [["prevents", "getting paralyzed"], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
    sleepImmunity: [["prevents", "falling asleep"], ...IMMUNITY_FILTER_PATTERNS.statusImmunity],
    freezeImmunity: [["prevents", "getting frozen"], ...IMMUNITY_FILTER_PATTERNS.statusImmunity]
  };
  const INTERFERENCE_IMMUNITY_DETAIL_PATTERNS = {
    allInterferenceImmunity: IMMUNITY_FILTER_PATTERNS.interferenceImmunity,
    flinchImmunity: [["prevents", "flinching"], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity],
    confusionImmunity: [["prevents", "becoming confused"], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity],
    trapImmunity: [["prevents", "becoming trapped"], ...IMMUNITY_FILTER_PATTERNS.interferenceImmunity]
  };
  const STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS = {
    allStatReductionImmunity: IMMUNITY_FILTER_PATTERNS.statReductionImmunity,
    attackReductionImmunity: [["prevents", "attack", "being lowered"], ["attack", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    spAttackReductionImmunity: [["prevents", "sp. atk", "being lowered"], ["sp. atk", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    defenseReductionImmunity: [["prevents", "defense", "being lowered"], ["defense", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    spDefenseReductionImmunity: [["prevents", "sp. def", "being lowered"], ["sp. def", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    speedReductionImmunity: [["prevents", "speed", "being lowered"], ["speed", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    accuracyReductionImmunity: [["prevents", "accuracy", "being lowered"], ["accuracy", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity],
    evasionReductionImmunity: [["prevents", "evasiveness", "being lowered"], ["evasiveness", "protected", "stat rank reduction"], ...IMMUNITY_FILTER_PATTERNS.statReductionImmunity]
  };
  const STAT_DECREASE_ICON_URLS = {
    attack: "https://pomatools.github.io/assets/img/battle/STAT_002L.png",
    defense: "https://pomatools.github.io/assets/img/battle/STAT_004L.png",
    spAttack: "https://pomatools.github.io/assets/img/battle/STAT_008L.png",
    spDefense: "https://pomatools.github.io/assets/img/battle/STAT_016L.png",
    speed: "https://pomatools.github.io/assets/img/battle/STAT_032L.png",
    accuracy: "https://pomatools.github.io/assets/img/battle/STAT_064L.png",
    evasion: "https://pomatools.github.io/assets/img/battle/STAT_128L.png",
    critical: "https://pomatools.github.io/assets/img/battle/STAT_256L.png"
  };
  const STAT_INCREASE_ICON_URLS = {
    attack: "https://pomatools.github.io/assets/img/battle/STAT_002R.png",
    defense: "https://pomatools.github.io/assets/img/battle/STAT_004R.png",
    spAttack: "https://pomatools.github.io/assets/img/battle/STAT_008R.png",
    spDefense: "https://pomatools.github.io/assets/img/battle/STAT_016R.png",
    speed: "https://pomatools.github.io/assets/img/battle/STAT_032R.png",
    accuracy: "https://pomatools.github.io/assets/img/battle/STAT_064R.png",
    evasion: "https://pomatools.github.io/assets/img/battle/STAT_128R.png",
    critical: "https://pomatools.github.io/assets/img/battle/STAT_256R.png"
  };
  const CONDITION_FILTER_ICON_URLS = {
    poison: "https://pomatools.github.io/assets/img/battle/SCPM_001.png",
    burn: "https://pomatools.github.io/assets/img/battle/SCPM_004.png",
    paralysis: "https://pomatools.github.io/assets/img/battle/SCPM_008.png",
    freeze: "https://pomatools.github.io/assets/img/battle/SCPM_016.png",
    sleep: "https://pomatools.github.io/assets/img/battle/SCPM_032.png",
    confusion: "https://pomatools.github.io/assets/img/battle/SCTP_001.png",
    flinch: "https://pomatools.github.io/assets/img/battle/SCTP_002.png",
    trap: "https://pomatools.github.io/assets/img/battle/SCTP_004.png"
  };
  const IMMUNITY_DETAIL_ICON_KEYS = {
    poisonImmunity: "poison",
    burnImmunity: "burn",
    paralysisImmunity: "paralysis",
    sleepImmunity: "sleep",
    freezeImmunity: "freeze",
    flinchImmunity: "flinch",
    confusionImmunity: "confusion",
    trapImmunity: "trap",
    attackReductionImmunity: "attack",
    spAttackReductionImmunity: "spAttack",
    defenseReductionImmunity: "defense",
    spDefenseReductionImmunity: "spDefense",
    speedReductionImmunity: "speed",
    accuracyReductionImmunity: "accuracy",
    evasionReductionImmunity: "evasion"
  };
  const REBUFF_DETAIL_CONFIG = Object.fromEntries([
    ["normalRebuffDown", "normal", "normalZone"],
    ["fireRebuffDown", "fire", "fireType"],
    ["waterRebuffDown", "water", "waterType"],
    ["electricRebuffDown", "electric", "electricType"],
    ["grassRebuffDown", "grass", "grassType"],
    ["iceRebuffDown", "ice", "iceZone"],
    ["fightingRebuffDown", "fighting", "fightingZone"],
    ["poisonRebuffDown", "poison", "poisonZone"],
    ["groundRebuffDown", "ground", "groundZone"],
    ["flyingRebuffDown", "flying", "flyingZone"],
    ["psychicRebuffDown", "psychic", "psychicType"],
    ["bugRebuffDown", "bug", "bugZone"],
    ["rockRebuffDown", "rock", "rockZone"],
    ["ghostRebuffDown", "ghost", "ghostZone"],
    ["dragonRebuffDown", "dragon", "dragonZone"],
    ["darkRebuffDown", "dark", "darkZone"],
    ["steelRebuffDown", "steel", "steelZone"],
    ["fairyRebuffDown", "fairy", "fairyZone"],
    ["stellarRebuffDown", "stellar", "stellarType", "StellarIC_Masters.png"]
  ].map(([value, type, labelKey, iconFile]) => [value, {
    type,
    labelKey,
    iconSrc: `https://archives.bulbagarden.net/wiki/Special:Redirect/file/${iconFile || `${type[0].toUpperCase()}${type.slice(1)}_Rebuff_down_icon_Masters.png`}`,
    rebuffDirection: iconFile ? "↓" : ""
  }]));
  const REBUFF_UP_DETAIL_CONFIG = Object.fromEntries(Object.entries(REBUFF_DETAIL_CONFIG).map(([value, detail]) => [
    value.replace(/Down$/, "Up"),
    {
      ...detail,
      iconSrc: `https://archives.bulbagarden.net/wiki/Special:Redirect/file/${detail.type[0].toUpperCase()}${detail.type.slice(1)}IC_Masters.png`
    }
  ]));
  function rebuffDetailPatterns(direction, detail) {
    return [
      [[direction, `${detail.type} type rebuff`]],
      [[direction, "following type rebuffs", detail.type]]
    ].flat();
  }
  const FIELD_DETAIL_ICON_CONFIG = {
    sunnyWeather: { iconSrc: "https://pomatools.github.io/assets/img/battle/WTHR_002.png" },
    rainyWeather: { iconSrc: "https://pomatools.github.io/assets/img/battle/WTHR_001.png" },
    sandstormWeather: { iconSrc: "https://pomatools.github.io/assets/img/battle/WTHR_004.png" },
    hailWeather: { iconSrc: "https://pomatools.github.io/assets/img/battle/WTHR_008.png" },
    electricTerrain: { iconName: "type_electric" },
    grassyTerrain: { iconName: "type_grass" },
    psychicTerrain: { iconName: "type_psychic" },
    normalZone: { iconName: "type_normal" },
    iceZone: { iconName: "type_ice" },
    fightingZone: { iconName: "type_fighting" },
    poisonZone: { iconName: "type_poison" },
    groundZone: { iconName: "type_ground" },
    flyingZone: { iconName: "type_flying" },
    bugZone: { iconName: "type_bug" },
    rockZone: { iconName: "type_rock" },
    ghostZone: { iconName: "type_ghost" },
    dragonZone: { iconName: "type_dragon" },
    darkZone: { iconName: "type_dark" },
    steelZone: { iconName: "type_steel" },
    fairyZone: { iconName: "type_fairy" },
    circlePhysical: { iconSrc: "https://www.pomatools.site/assets/images/icon_stat_atk.png", iconOnly: false },
    circleSpecial: { iconSrc: "https://www.pomatools.site/assets/images/icon_stat_spa.png", iconOnly: false },
    circleDefensive: { iconSrc: "https://www.pomatools.site/assets/images/icon_stat_hp.png", iconOnly: false },
    moveGaugeAcceleration: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_001.png" },
    physicalDamageReduction: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_002.png" },
    specialDamageReduction: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_004.png" },
    criticalHitDefense: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_008.png" },
    statusConditionDefense: { iconSrc: STATUS_CONDITION_DEFENSE_ICON_SRC },
    statusMoveDefense: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_032.png" },
    statReductionDefense: { iconSrc: "https://pomatools.github.io/assets/img/battle/FILD_016.png" },
    noStatIncreases: { iconSrc: NO_STAT_INCREASES_ICON_SRC },
    fireDamageField: { iconSrc: "https://archives.bulbagarden.net/media/upload/f/fb/Fire_Damage_Field_icon_Masters.png" },
    poisonDamageField: { iconSrc: "https://archives.bulbagarden.net/media/upload/f/fc/Poison_Damage_Field_icon_Masters.png" },
    rockDamageField: { iconSrc: "https://archives.bulbagarden.net/media/upload/b/b7/Rock_Damage_Field_icon_Masters.png" },
    darkDamageField: { iconSrc: "https://archives.bulbagarden.net/media/upload/c/c6/Dark_Damage_Field_icon_Masters.png" },
    steelDamageField: { iconSrc: "https://archives.bulbagarden.net/media/upload/a/a7/Steel_Damage_Field_icon_Masters.png" }
  };
  const SKILL_FILTER_TRANSLATIONS = {
    weather: { en: "Weather", fr: "Météo", de: "Wetter", es: "Clima", it: "Meteo", ja: "天気", ko: "날씨", zh: "天氣" },
    terrain: { en: "Terrain", fr: "Champ", de: "Feld", es: "Campo", it: "Campo", ja: "フィールド", ko: "필드", zh: "場地" },
    zone: { en: "Zone", fr: "Zone", de: "Zone", es: "Zona", it: "Zona", ja: "ゾーン", ko: "존", zh: "領域" },
    weatherEx: { en: "EX Weather", fr: "Météo EX", de: "EX-Wetter", es: "Clima EX", it: "Meteo EX", ja: "EX天気", ko: "EX 날씨", zh: "EX天氣" },
    terrainEx: { en: "EX Terrain", fr: "Champ EX", de: "EX-Feld", es: "Campo EX", it: "Campo EX", ja: "EXフィールド", ko: "EX 필드", zh: "EX場地" },
    zoneEx: { en: "EX Zone", fr: "Zone EX", de: "EX-Zone", es: "Zona EX", it: "Zona EX", ja: "EXゾーン", ko: "EX 존", zh: "EX領域" },
    circle: { en: "Circle", fr: "Cercle", de: "Kreis", es: "Círculo", it: "Cerchio", ja: "サークル", ko: "서클", zh: "圓環" },
    alliedField: { en: "Allied Field", fr: "Terrain allié", de: "Mitstreiter-Feld", es: "Campo aliado", it: "Campo alleato", ja: "味方の場", ko: "아군 필드", zh: "我方場地" },
    opponentField: { en: "Opponent Field", fr: "Terrain adverse", de: "Gegner-Feld", es: "Campo rival", it: "Campo avversario", ja: "相手の場", ko: "상대 필드", zh: "對手場地" },
    statUp: { en: "Stat ↑", fr: "Stats ↑", de: "Werte ↑", es: "Características ↑", it: "Statistiche ↑", ja: "能力↑", ko: "능력↑", zh: "能力↑" },
    statDown: { en: "Opponent Stat ↓", fr: "Stats adverses ↓", de: "Gegner-Werte ↓", es: "Características del rival ↓", it: "Statistiche avversarie ↓", ja: "相手能力↓", ko: "상대 능력↓", zh: "對手能力↓" },
    opponentStatIncreaseRemoval: { en: "Opponent Stat ↑ Removal", fr: "Bonus de stats adverses annulés", de: "Gegner-Werte ↑ entfernen", es: "Eliminar mejoras del rival", it: "Rimozione aumenti avversari", ja: "能力↑解除", ko: "능력↑ 해제", zh: "能力↑解除" },
    status: { en: "Inflict Status", fr: "Infliger une altération", de: "Statusproblem zufügen", es: "Causar problema de estado", it: "Infliggi stato alterato", ja: "異常付与", ko: "상태 이상 부여", zh: "賦予異常狀態" },
    interference: { en: "Inflict Interference", fr: "Infliger une entrave", de: "Störung zufügen", es: "Causar interferencia", it: "Infliggi interferenza", ja: "妨害付与", ko: "방해 상태 부여", zh: "賦予妨害狀態" },
    immunity: { en: "Immunity", fr: "Immunité", de: "Immunität", es: "Inmunidad", it: "Immunità", ja: "無効", ko: "무효", zh: "免疫" },
    immunitySymbol: { en: "🚫", fr: "🚫", de: "🚫", es: "🚫", it: "🚫", ja: "🚫", ko: "🚫", zh: "🚫" },
    rebuff: { en: "Rebuff", fr: "Résilience au type ↓", de: "Typ-Widerstand ↓", es: "Resistencia de tipo ↓", it: "Resistenza al tipo ↓", ja: "タイプ抵抗↓", ko: "타입 저항↓", zh: "屬性抵抗↓" },
    rebuffUp: { en: "Type Rebuff ↑", fr: "Résilience au type ↑", de: "Typ-Widerstand ↑", es: "Resistencia de tipo ↑", it: "Resistenza al tipo ↑", ja: "タイプ抵抗↑", ko: "타입 저항↑", zh: "屬性抵抗↑" },
    masterPassive: { en: "Master Passive", fr: "Talent Maître", de: "Meister-Passivfähigkeit", es: "Habilidad maestra", it: "Abilità Master", ja: "マスターパッシブ", ko: "마스터 패시브", zh: "大師被動" },
    sunnyWeather: { en: "Sunny", fr: "Soleil", de: "Sonne", es: "Sol", it: "Sole", ja: "晴れ", ko: "쾌청", zh: "晴天" },
    rainyWeather: { en: "Rain", fr: "Pluie", de: "Regen", es: "Lluvia", it: "Pioggia", ja: "雨", ko: "비", zh: "下雨" },
    sandstormWeather: { en: "Sandstorm", fr: "Tempête de sable", de: "Sandsturm", es: "Tormenta de arena", it: "Tempesta di sabbia", ja: "すなあらし", ko: "모래바람", zh: "沙暴" },
    hailWeather: { en: "Hailstorm", fr: "Grêle", de: "Hagel", es: "Granizo", it: "Grandine", ja: "あられ", ko: "싸라기눈", zh: "冰雹" },
    electricTerrain: { en: "Electric", fr: "Électrik", de: "Elektro", es: "Eléctrico", it: "Elettro", ja: "エレキ", ko: "일렉트릭", zh: "電氣" },
    grassyTerrain: { en: "Grassy", fr: "Herbu", de: "Gras", es: "Hierba", it: "Erba", ja: "グラス", ko: "그래스", zh: "青草" },
    psychicTerrain: { en: "Psychic", fr: "Psychique", de: "Psycho", es: "Psíquico", it: "Psico", ja: "サイコ", ko: "사이코", zh: "精神" },
    fireType: { en: "Fire", fr: "Feu", de: "Feuer", es: "Fuego", it: "Fuoco", ja: "ほのお", ko: "불꽃", zh: "火" },
    waterType: { en: "Water", fr: "Eau", de: "Wasser", es: "Agua", it: "Acqua", ja: "みず", ko: "물", zh: "水" },
    electricType: { en: "Electric", fr: "Électrik", de: "Elektro", es: "Eléctrico", it: "Elettro", ja: "でんき", ko: "전기", zh: "電" },
    grassType: { en: "Grass", fr: "Plante", de: "Pflanze", es: "Planta", it: "Erba", ja: "くさ", ko: "풀", zh: "草" },
    psychicType: { en: "Psychic", fr: "Psy", de: "Psycho", es: "Psíquico", it: "Psico", ja: "エスパー", ko: "에스퍼", zh: "超能力" },
    stellarType: { en: "Stellar", fr: "Stellaire", de: "Stellar", es: "Astral", it: "Astrale", ja: "ステラ", ko: "스텔라", zh: "太晶" },
    normalZone: { en: "Normal", fr: "Normal", de: "Normal", es: "Normal", it: "Normale", ja: "ノーマル", ko: "노말", zh: "一般" },
    iceZone: { en: "Ice", fr: "Glace", de: "Eis", es: "Hielo", it: "Ghiaccio", ja: "こおり", ko: "얼음", zh: "冰" },
    fightingZone: { en: "Fighting", fr: "Combat", de: "Kampf", es: "Lucha", it: "Lotta", ja: "かくとう", ko: "격투", zh: "格鬥" },
    poisonZone: { en: "Poison", fr: "Poison", de: "Gift", es: "Veneno", it: "Veleno", ja: "どく", ko: "독", zh: "毒" },
    groundZone: { en: "Ground", fr: "Sol", de: "Boden", es: "Tierra", it: "Terra", ja: "じめん", ko: "땅", zh: "地面" },
    flyingZone: { en: "Flying", fr: "Vol", de: "Flug", es: "Volador", it: "Volante", ja: "ひこう", ko: "비행", zh: "飛行" },
    bugZone: { en: "Bug", fr: "Insecte", de: "Käfer", es: "Bicho", it: "Coleottero", ja: "むし", ko: "벌레", zh: "蟲" },
    rockZone: { en: "Rock", fr: "Roche", de: "Gestein", es: "Roca", it: "Roccia", ja: "いわ", ko: "바위", zh: "岩石" },
    ghostZone: { en: "Ghost", fr: "Spectre", de: "Geist", es: "Fantasma", it: "Spettro", ja: "ゴースト", ko: "고스트", zh: "幽靈" },
    dragonZone: { en: "Dragon", fr: "Dragon", de: "Drache", es: "Dragón", it: "Drago", ja: "ドラゴン", ko: "드래곤", zh: "龍" },
    darkZone: { en: "Dark", fr: "Ténèbres", de: "Unlicht", es: "Siniestro", it: "Buio", ja: "あく", ko: "악", zh: "惡" },
    steelZone: { en: "Steel", fr: "Acier", de: "Stahl", es: "Acero", it: "Acciaio", ja: "はがね", ko: "강철", zh: "鋼" },
    fairyZone: { en: "Fairy", fr: "Fée", de: "Fee", es: "Hada", it: "Folletto", ja: "フェアリー", ko: "페어리", zh: "妖精" },
    attack: { en: "Attack", fr: "Attaque", de: "Angriff", es: "Ataque", it: "Attacco", ja: "攻撃", ko: "공격", zh: "攻擊" },
    spAttack: { en: "Sp. Atk", fr: "Atq. Spé.", de: "Spezial-Angriff", es: "At. Esp.", it: "Att. Sp.", ja: "特攻", ko: "특수공격", zh: "特攻" },
    defense: { en: "Defense", fr: "Défense", de: "Verteidigung", es: "Defensa", it: "Difesa", ja: "防御", ko: "방어", zh: "防御" },
    spDefense: { en: "Sp. Def", fr: "Déf. Spé.", de: "Spezial-Verteidigung", es: "Def. Esp.", it: "Dif. Sp.", ja: "特防", ko: "특수방어", zh: "特防" },
    speed: { en: "Speed", fr: "Vitesse", de: "Initiative", es: "Velocidad", it: "Velocità", ja: "素早さ", ko: "스피드", zh: "速度" },
    accuracy: { en: "Accuracy", fr: "Précision", de: "Genauigkeit", es: "Precisión", it: "Precisione", ja: "命中率", ko: "명중률", zh: "命中率" },
    sureHitNext: { en: "Guaranteed Hit", fr: "Capacité immanquable", de: "Garantierter Treffer", es: "Golpe certero", it: "Colpo sicuro", ja: "必中", ko: "필중", zh: "必中" },
    evasion: { en: "Evasiveness", fr: "Esquive", de: "Fluchtwert", es: "Evasión", it: "Elusione", ja: "回避率", ko: "회피율", zh: "閃避率" },
    critical: { en: "Critical rate", fr: "Taux de critique", de: "Volltrefferquote", es: "Índice crítico", it: "Probabilità di brutto colpo", ja: "急所率", ko: "급소율", zh: "要害率" },
    circlePhysical: { en: "Physical", fr: "Physique", de: "Physisch", es: "Físico", it: "Fisico", ja: "物理", ko: "물리", zh: "物理" },
    circleSpecial: { en: "Special", fr: "Spécial", de: "Spezial", es: "Especial", it: "Speciale", ja: "特殊", ko: "특수", zh: "特殊" },
    circleDefensive: { en: "Defensive", fr: "Défensif", de: "Defensiv", es: "Defensivo", it: "Difensivo", ja: "防御", ko: "방어", zh: "防御" },
    physicalDamageReduction: { en: "Physical Damage ↓", fr: "Dégâts physiques ↓", de: "Physischer Schaden ↓", es: "Daño físico ↓", it: "Danni fisici ↓", ja: "物理ダメージ軽減", ko: "물리 데미지 감소", zh: "物理傷害減輕" },
    specialDamageReduction: { en: "Special Damage ↓", fr: "Dégâts spéciaux ↓", de: "Spezial-Schaden ↓", es: "Daño especial ↓", it: "Danni speciali ↓", ja: "特殊ダメージ軽減", ko: "특수 데미지 감소", zh: "特殊傷害減輕" },
    criticalHitDefense: { en: "Critical-Hit Defense", fr: "Défense anti-critique", de: "Volltrefferschutz", es: "Defensa contra críticos", it: "Difesa dai brutti colpi", ja: "急所防御", ko: "급소 방어", zh: "要害防禦" },
    statusConditionDefense: { en: "Status Defense", fr: "Défense contre les altérations", de: "Statusschutz", es: "Defensa contra problemas de estado", it: "Difesa dagli stati alterati", ja: "状態異常防御", ko: "상태 이상 방어", zh: "異常狀態防禦" },
    statusMoveDefense: { en: "Status Move Defense", fr: "Défense contre les capacités de statut", de: "Status-Attacken-Schutz", es: "Defensa contra movimientos de estado", it: "Difesa dalle mosse di stato", ja: "変化技防御", ko: "변화기술 방어", zh: "變化招式防禦" },
    statReductionDefense: { en: "Stat Reduction Defense", fr: "Défense contre les baisses de stats", de: "Wertesenkungsschutz", es: "Defensa contra reducción de características", it: "Difesa dalla riduzione delle statistiche", ja: "能力下降防御", ko: "능력치 하락 방어", zh: "能力下降防禦" },
    moveGaugeAcceleration: { en: "Move Gauge Acceleration", fr: "Accélération de la Jauge Capacité", de: "Attackenleiste beschleunigt", es: "Aceleración de la barra de movimientos", it: "Accelerazione barra mosse", ja: "わざゲージ加速", ko: "기술게이지 가속", zh: "招式計量槽加速" },
    fireDamageField: { en: "Fire Damage Field", fr: "Zone de dégâts Feu", de: "Feuer-Schadensfeld", es: "Campo de daño Fuego", it: "Campo danni Fuoco", ja: "ほのおダメージの場", ko: "불꽃 데미지 필드", zh: "火屬性傷害場地" },
    poisonDamageField: { en: "Poison Damage Field", fr: "Zone de dégâts Poison", de: "Gift-Schadensfeld", es: "Campo de daño Veneno", it: "Campo danni Veleno", ja: "どくダメージの場", ko: "독 데미지 필드", zh: "毒屬性傷害場地" },
    rockDamageField: { en: "Rock Damage Field", fr: "Zone de dégâts Roche", de: "Gestein-Schadensfeld", es: "Campo de daño Roca", it: "Campo danni Roccia", ja: "いわダメージの場", ko: "바위 데미지 필드", zh: "岩石屬性傷害場地" },
    darkDamageField: { en: "Dark Damage Field", fr: "Zone de dégâts Ténèbres", de: "Unlicht-Schadensfeld", es: "Campo de daño Siniestro", it: "Campo danni Buio", ja: "あくダメージの場", ko: "악 데미지 필드", zh: "惡屬性傷害場地" },
    steelDamageField: { en: "Steel Damage Field", fr: "Zone de dégâts Acier", de: "Stahl-Schadensfeld", es: "Campo de daño Acero", it: "Campo danni Acciaio", ja: "はがねダメージの場", ko: "강철 데미지 필드", zh: "鋼屬性傷害場地" },
    noStatIncreases: { en: "No Stat Increases", fr: "Hausse de stats impossible", de: "Keine Werterhöhungen", es: "Sin aumento de características", it: "Aumento statistiche impossibile", ja: "能力上昇不可", ko: "능력치 상승 불가", zh: "能力無法提升" },
    poison: { en: "Poison", fr: "Poison", de: "Vergiftung", es: "Envenenamiento", it: "Avvelenamento", ja: "どく", ko: "독", zh: "中毒" },
    burn: { en: "Burn", fr: "Brûlure", de: "Verbrennung", es: "Quemadura", it: "Scottatura", ja: "やけど", ko: "화상", zh: "灼傷" },
    paralysis: { en: "Paralysis", fr: "Paralysie", de: "Paralyse", es: "Parálisis", it: "Paralisi", ja: "まひ", ko: "마비", zh: "麻痺" },
    sleep: { en: "Sleep", fr: "Sommeil", de: "Schlaf", es: "Sueño", it: "Sonno", ja: "ねむり", ko: "잠듦", zh: "睡眠" },
    freeze: { en: "Freeze", fr: "Gel", de: "Einfrieren", es: "Congelación", it: "Congelamento", ja: "こおり", ko: "얼음", zh: "冰凍" },
    flinch: { en: "Flinch", fr: "Apeurement", de: "Zurückschrecken", es: "Retroceso", it: "Tentennamento", ja: "ひるみ", ko: "풀죽음", zh: "畏縮" },
    confusion: { en: "Confusion", fr: "Confusion", de: "Verwirrung", es: "Confusión", it: "Confusione", ja: "こんらん", ko: "혼란", zh: "混乱" },
    trap: { en: "Trap", fr: "Ligotage", de: "Fesselung", es: "Atadura", it: "Imprigionamento", ja: "バインド", ko: "바인드", zh: "束縛" },
    statusImmunity: { en: "Status Immunity", fr: "Immunité aux altérations", de: "Statusimmunität", es: "Inmunidad a problemas de estado", it: "Immunità agli stati alterati", ja: "異常無効", ko: "상태 이상 무효", zh: "異常狀態免疫" },
    statReductionImmunity: { en: "Stat ↓ Immunity", fr: "Immunité Stats ↓", de: "Werte ↓ Immunität", es: "Inmunidad Características ↓", it: "Immunità Statistiche ↓", ja: "能力↓無効", ko: "능력↓ 무효", zh: "能力↓免疫" },
    interferenceImmunity: { en: "Interference Immunity", fr: "Immunité aux entraves", de: "Störungsimmunität", es: "Inmunidad a interferencias", it: "Immunità alle interferenze", ja: "妨害無効", ko: "방해 무효", zh: "妨害免疫" },
    criticalHitImmunity: { en: "Critical-Hit Immunity", fr: "Immunité aux critiques", de: "Volltrefferimmunität", es: "Inmunidad a golpes críticos", it: "Immunità ai brutti colpi", ja: "急所無効", ko: "급소 무효", zh: "要害免疫" },
    allStatusImmunity: { en: "All Status Immunity", fr: "Immunité à toutes les altérations", de: "Immunität gegen alle Statusprobleme", es: "Inmunidad a todos los problemas de estado", it: "Immunità a tutti gli stati alterati", ja: "全状態異常無効", ko: "모든 상태 이상 무효", zh: "全異常狀態免疫" },
    allInterferenceImmunity: { en: "All Interference Immunity", fr: "Immunité à toutes les entraves", de: "Immunität gegen alle Störungen", es: "Inmunidad a todas las interferencias", it: "Immunità a tutte le interferenze", ja: "全妨害無効", ko: "모든 방해 무효", zh: "全妨害免疫" },
    allStatReductionImmunity: { en: "All Stats ↓ Immunity", fr: "Immunité Toutes stats ↓", de: "Alle Werte ↓ Immunität", es: "Inmunidad Todas las características ↓", it: "Immunità Tutte le statistiche ↓", ja: "全↓無効", ko: "모든 능력↓ 무효", zh: "全能力↓免疫" },
    poisonImmunity: { en: "Poison Immunity", fr: "Immunité au poison", de: "Giftimmunität", es: "Inmunidad al veneno", it: "Immunità al veleno", ja: "どく無効", ko: "독 무효", zh: "中毒免疫" },
    burnImmunity: { en: "Burn Immunity", fr: "Immunité aux brûlures", de: "Verbrennungsimmunität", es: "Inmunidad a quemaduras", it: "Immunità alle scottature", ja: "やけど無効", ko: "화상 무효", zh: "灼傷免疫" },
    paralysisImmunity: { en: "Paralysis Immunity", fr: "Immunité à la paralysie", de: "Paralyseimmunität", es: "Inmunidad a parálisis", it: "Immunità alla paralisi", ja: "まひ無効", ko: "마비 무효", zh: "麻痺免疫" },
    sleepImmunity: { en: "Sleep Immunity", fr: "Immunité au sommeil", de: "Schlafimmunität", es: "Inmunidad al sueño", it: "Immunità al sonno", ja: "ねむり無効", ko: "잠듦 무효", zh: "睡眠免疫" },
    freezeImmunity: { en: "Freeze Immunity", fr: "Immunité au gel", de: "Einfrierimmunität", es: "Inmunidad a congelación", it: "Immunità al congelamento", ja: "こおり無効", ko: "얼음 무효", zh: "冰凍免疫" },
    flinchImmunity: { en: "Flinch Immunity", fr: "Immunité à l’apeurement", de: "Zurückschreckimmunität", es: "Inmunidad al retroceso", it: "Immunità al tentennamento", ja: "ひるみ無効", ko: "풀죽음 무효", zh: "畏縮免疫" },
    confusionImmunity: { en: "Confusion Immunity", fr: "Immunité à la confusion", de: "Verwirrungsimmunität", es: "Inmunidad a confusión", it: "Immunità alla confusione", ja: "こんらん無効", ko: "혼란 무효", zh: "混亂免疫" },
    trapImmunity: { en: "Trap Immunity", fr: "Immunité au ligotage", de: "Fesselungsimmunität", es: "Inmunidad a ataduras", it: "Immunità all’imprigionamento", ja: "バインド無効", ko: "바인드 무효", zh: "束縛免疫" },
    attackReductionImmunity: { en: "Attack ↓ Immunity", fr: "Immunité Attaque ↓", de: "Angriff ↓ Immunität", es: "Inmunidad Ataque ↓", it: "Immunità Attacco ↓", ja: "攻撃↓無効", ko: "공격↓ 무효", zh: "攻擊↓免疫" },
    spAttackReductionImmunity: { en: "Sp. Atk ↓ Immunity", fr: "Immunité Atq. Spé. ↓", de: "Spezial-Angriff ↓ Immunität", es: "Inmunidad At. Esp. ↓", it: "Immunità Att. Sp. ↓", ja: "特攻↓無効", ko: "특수공격↓ 무효", zh: "特攻↓免疫" },
    defenseReductionImmunity: { en: "Defense ↓ Immunity", fr: "Immunité Défense ↓", de: "Verteidigung ↓ Immunität", es: "Inmunidad Defensa ↓", it: "Immunità Difesa ↓", ja: "防御↓無効", ko: "방어↓ 무효", zh: "防禦↓免疫" },
    spDefenseReductionImmunity: { en: "Sp. Def ↓ Immunity", fr: "Immunité Déf. Spé. ↓", de: "Spezial-Verteidigung ↓ Immunität", es: "Inmunidad Def. Esp. ↓", it: "Immunità Dif. Sp. ↓", ja: "特防↓無効", ko: "특수방어↓ 무효", zh: "特防↓免疫" },
    speedReductionImmunity: { en: "Speed ↓ Immunity", fr: "Immunité Vitesse ↓", de: "Initiative ↓ Immunität", es: "Inmunidad Velocidad ↓", it: "Immunità Velocità ↓", ja: "素早さ↓無効", ko: "스피드↓ 무효", zh: "速度↓免疫" },
    accuracyReductionImmunity: { en: "Accuracy ↓ Immunity", fr: "Immunité Précision ↓", de: "Genauigkeit ↓ Immunität", es: "Inmunidad Precisión ↓", it: "Immunità Precisione ↓", ja: "命中率↓無効", ko: "명중률↓ 무효", zh: "命中率↓免疫" },
    evasionReductionImmunity: { en: "Evasiveness ↓ Immunity", fr: "Immunité Esquive ↓", de: "Fluchtwert ↓ Immunität", es: "Inmunidad Evasión ↓", it: "Immunità Elusione ↓", ja: "回避率↓無効", ko: "회피율↓ 무효", zh: "閃避率↓免疫" },
    masterPhysical: { en: "Physical", fr: "Physique", de: "Physisch", es: "Físico", it: "Fisico", ja: "物理マスター", ko: "물리", zh: "物理" },
    masterSpecial: { en: "Special", fr: "Spécial", de: "Spezial", es: "Especial", it: "Speciale", ja: "特殊マスター", ko: "특수", zh: "特殊" },
    masterGeneral: { en: "General", fr: "Général", de: "Allgemein", es: "General", it: "Generale", ja: "汎用マスター", ko: "범용", zh: "泛用" }
  };
  const STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES = {
    en: "Also includes effects that turn stat reductions into equal stat increases.",
    fr: "Inclut aussi les effets qui transforment les baisses de stats en hausses équivalentes.",
    de: "Enthält auch Effekte, die Wertesenkungen in gleich hohe Erhöhungen umkehren.",
    es: "También incluye efectos que convierten las reducciones de características en aumentos equivalentes.",
    it: "Include anche gli effetti che trasformano le riduzioni delle statistiche in aumenti equivalenti.",
    ja: "能力がさがる代わりに同じ分だけあがる効果も含みます。",
    ko: "능력치 하락을 같은 수치의 상승으로 바꾸는 효과도 포함합니다.",
    zh: "也包含将能力下降转为等量提升的效果。"
  };
  const STAT_REDUCTION_REVERSAL_TOOLTIP_NOTES = {
    en: "Also includes all-stat effects that turn stat reductions into equal stat increases.",
    fr: "Inclut aussi les effets pour toutes les stats qui transforment les baisses en hausses équivalentes.",
    de: "Enthält auch Effekte für alle Werte, die Senkungen in gleich hohe Erhöhungen umkehren.",
    es: "También incluye efectos para todas las características que convierten reducciones en aumentos equivalentes.",
    it: "Include anche gli effetti per tutte le statistiche che trasformano le riduzioni in aumenti equivalenti.",
    ja: "能力がさがる代わりに同じ分だけあがる、全能力対象の効果も含みます。",
    ko: "모든 능력치 하락을 같은 수치의 상승으로 바꾸는 효과도 포함합니다.",
    zh: "也包含将任意能力下降转为等量提升的全能力效果。"
  };
  const SURE_HIT_TOOLTIP_NOTES = {
    en: "Includes Sure Hit Next, moves that never miss, and unconditional or conditional effects that make moves never miss.",
    fr: "Inclut Prochaine capacité immanquable, les capacités qui n’échouent jamais et les effets conditionnels ou non qui les rendent immanquables.",
    de: "Enthält Garantierter Treffer (Nächste), Attacken, die nie verfehlen, sowie bedingte oder unbedingte Effekte, durch die Attacken nie verfehlen.",
    es: "Incluye Golpe certero siguiente, movimientos que nunca fallan y efectos condicionales o incondicionales que hacen que los movimientos nunca fallen.",
    it: "Include Colpo sicuro prossimo, mosse che non falliscono mai ed effetti condizionati o incondizionati che rendono le mosse infallibili.",
    ja: "必中状態の付与・必ず命中する技・無条件または特定条件で技が必ず命中する効果を含みます。",
    ko: "필중 차례 효과, 반드시 명중하는 기술, 조건부 또는 무조건으로 기술이 반드시 명중하는 효과를 포함합니다.",
    zh: "包含赋予必中状态、招式自身必定命中，以及无条件或特定条件下招式必定命中的效果。"
  };
  const CIRCLE_DETAIL_TOOLTIP_LABELS = {
    circlePhysical: { en: "Physical Circle", fr: "Cercle physique", de: "Physischer Kreis", es: "Círculo físico", it: "Cerchio fisico", ja: "物理サークル", ko: "물리 서클", zh: "物理圓環" },
    circleSpecial: { en: "Special Circle", fr: "Cercle spécial", de: "Spezial-Kreis", es: "Círculo especial", it: "Cerchio speciale", ja: "特殊サークル", ko: "특수 서클", zh: "特殊圓環" },
    circleDefensive: { en: "Defensive Circle", fr: "Cercle défensif", de: "Defensiver Kreis", es: "Círculo defensivo", it: "Cerchio difensivo", ja: "防御サークル", ko: "방어 서클", zh: "防禦圓環" }
  };
  const CIRCLE_REGION_ANCHOR_TRANSLATIONS = {
    en: { label: "→ Region", tooltip: "Filter Circles further by region" },
    fr: { label: "→ Région", tooltip: "Affiner les Cercles par région" },
    de: { label: "→ Region", tooltip: "Kreise weiter nach Region filtern" },
    es: { label: "→ Región", tooltip: "Filtrar más los Círculos por región" },
    it: { label: "→ Regione", tooltip: "Filtra ulteriormente i Cerchi per regione" },
    ja: { label: "→ 地方", tooltip: "地方でサークルを絞り込む" },
    ko: { label: "→ 지방", tooltip: "지방으로 서클을 더 필터링" },
    zh: { label: "→ 地區", tooltip: "按地區進一步篩選圓環" }
  };
  const OPPONENT_STAT_INCREASE_REMOVAL_TOOLTIP_NOTES = {
    en: "Includes effects that reset, reverse, or steal the opponent’s raised stats.",
    fr: "Inclut les effets qui annulent, inversent ou volent les hausses de stats adverses.",
    de: "Enthält Effekte, die erhöhte gegnerische Werte zurücksetzen, umkehren oder stehlen.",
    es: "Incluye efectos que restablecen, invierten o roban las mejoras de características del rival.",
    it: "Include effetti che azzerano, invertono o sottraggono gli aumenti delle statistiche avversarie.",
    ja: "相手のあがった能力をもとに戻す・反転する・奪う効果を含みます。",
    ko: "상대의 상승한 능력치를 되돌리거나 반전하거나 빼앗는 효과를 포함합니다.",
    zh: "包含重置、反转或夺取对手能力提升的效果。"
  };
  function skillFilterLabels(value) {
    const directLabels = SKILL_FILTER_TRANSLATIONS[value];
    if (directLabels) return directLabels;
    const rebuff = REBUFF_DETAIL_CONFIG[value] || REBUFF_UP_DETAIL_CONFIG[value];
    if (rebuff) {
      const typeLabels = SKILL_FILTER_TRANSLATIONS[rebuff.labelKey];
      const rebuffLabels = SKILL_FILTER_TRANSLATIONS[REBUFF_UP_DETAIL_CONFIG[value] ? "rebuffUp" : "rebuff"];
      return Object.fromEntries(Object.keys(typeLabels).map((locale) => [
        locale,
        `${typeLabels[locale]}${locale === "ja" || locale === "zh" ? "" : " "}${rebuffLabels[locale]}`
      ]));
    }
    let translationKey = value;
    let prefix = "";
    let suffix = "";
    if (value.startsWith("ex")) {
      translationKey = `${value[2].toLowerCase()}${value.slice(3)}`;
      prefix = "EX ";
    } else if (value.endsWith("Up") || value.endsWith("Down")) {
      suffix = value.endsWith("Up") ? " ↑" : " ↓";
      translationKey = value.replace(/(?:Up|Down)$/, "");
    }
    const labels = SKILL_FILTER_TRANSLATIONS[translationKey];
    return Object.fromEntries(Object.entries(labels).map(([locale, label]) => [locale, `${prefix}${label}${suffix}`]));
  }
  const SKILL_FILTER_CATEGORIES = [
    {
      value: "weather",
      group: "field",
      labels: skillFilterLabels("weather"),
      patterns: {
        en: [["makes", "weather"], ["causes", "sandstorm"], ["causes", "hailstorm"], ["causes", "snow"]],
        ja: [["天気を", "にする"]],
        zh: [["天氣", "變成"], ["天气", "变成"], ["使天氣"], ["使天气"]]
      }
    },
    {
      value: "terrain",
      group: "field",
      labels: skillFilterLabels("terrain"),
      patterns: {
        en: [["turns", "terrain", "into"]],
        ja: [["フィールドを", "にする"]],
        zh: [["場地", "變成"], ["场地", "变成"]]
      }
    },
    {
      value: "zone",
      group: "field",
      labels: skillFilterLabels("zone"),
      patterns: {
        en: [["turns", "zone", "into"]],
        ja: [["ゾーンを", "にする"]],
        zh: [["領域", "變成"], ["领域", "变成"]]
      }
    },
    {
      value: "weatherEx",
      group: "field",
      labels: skillFilterLabels("weatherEx"),
      patterns: { en: [["ex sunny"], ["ex rainy"], ["ex sandstorm"], ["ex hailstorm"], ["ex snow"]] }
    },
    {
      value: "terrainEx",
      group: "field",
      labels: skillFilterLabels("terrainEx"),
      patterns: { en: [["ex electric terrain"], ["ex grassy terrain"], ["ex psychic terrain"]] }
    },
    {
      value: "zoneEx",
      group: "field",
      labels: skillFilterLabels("zoneEx"),
      patterns: { en: [
        ["ex normal zone"],
        ["ex ice zone"],
        ["ex fighting zone"],
        ["ex poison zone"],
        ["ex ground zone"],
        ["ex flying zone"],
        ["ex bug zone"],
        ["ex rock zone"],
        ["ex ghost zone"],
        ["ex dragon zone"],
        ["ex dark zone"],
        ["ex steel zone"],
        ["ex fairy zone"]
      ] }
    },
    {
      value: "circle",
      group: "field",
      labels: skillFilterLabels("circle"),
      patterns: {
        en: [["applies", "circle", "allied field"]],
        ja: [["味方全体の場を", "サークル", "にする"]],
        zh: [["我方全體的場地", "圓環"], ["我方全体的场地", "圆环"]]
      }
    },
    {
      value: "alliedField",
      group: "field",
      labels: skillFilterLabels("alliedField"),
      patterns: { en: [
        ["physical damage reduction effect"],
        ["special damage reduction effect"],
        ["critical-hit defense effect"],
        ["status condition defense effect"],
        ["status move defense effect"],
        ["stat reduction defense effect"],
        ["move gauge acceleration effect"]
      ] }
    },
    {
      value: "opponentField",
      group: "field",
      labels: skillFilterLabels("opponentField"),
      patterns: { en: [
        ["fire damage field"],
        ["poison damage field"],
        ["rock damage field"],
        ["dark damage field"],
        ["steel damage field"],
        ["no stat increases effect"]
      ] }
    },
    {
      value: "statUp",
      group: "utility",
      labels: skillFilterLabels("statUp"),
      patterns: { en: [["raises", "stat rank"]], ja: [["段階あげる"], ["段階上げる"]], zh: [["提高", "階"], ["提高", "级"]] }
    },
    {
      value: "statDown",
      group: "utility",
      labels: skillFilterLabels("statDown"),
      patterns: { en: [["lowers", "stat rank"], ...OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS], ja: [["段階さげる"], ["段階下げる"]], zh: [["降低", "階"], ["降低", "级"]] }
    },
    {
      value: "status",
      group: "utility",
      labels: skillFilterLabels("status"),
      patterns: { en: Object.values(STATUS_INFLICT_PATTERNS).flat() }
    },
    {
      value: "interference",
      group: "utility",
      labels: skillFilterLabels("interference"),
      patterns: { en: Object.values(INTERFERENCE_INFLICT_PATTERNS).flat() }
    },
    {
      value: "sureHitNext",
      group: "utility",
      labels: skillFilterLabels("sureHitNext"),
      tooltipNotes: SURE_HIT_TOOLTIP_NOTES,
      patterns: { en: [["sure hit next effect"], ["never miss"]] }
    },
    { value: "statusImmunity", group: "utility", labels: skillFilterLabels("statusImmunity"), patterns: { en: Object.values(STATUS_IMMUNITY_DETAIL_PATTERNS).flat() } },
    { value: "interferenceImmunity", group: "utility", labels: skillFilterLabels("interferenceImmunity"), patterns: { en: Object.values(INTERFERENCE_IMMUNITY_DETAIL_PATTERNS).flat() } },
    { value: "statReductionImmunity", group: "utility", labels: skillFilterLabels("statReductionImmunity"), tooltipNotes: STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES, patterns: { en: Object.values(STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS).flat() } },
    { value: "criticalHitImmunity", group: "utility", labels: skillFilterLabels("criticalHitImmunity"), patterns: { en: IMMUNITY_FILTER_PATTERNS.criticalHitImmunity } },
    {
      value: "rebuff",
      group: "utility",
      labels: skillFilterLabels("rebuff"),
      patterns: { en: Object.values(REBUFF_DETAIL_CONFIG).flatMap((detail) => rebuffDetailPatterns("lowers", detail)) }
    },
    {
      value: "rebuffUp",
      group: "utility",
      labels: skillFilterLabels("rebuffUp"),
      patterns: { en: Object.values(REBUFF_UP_DETAIL_CONFIG).flatMap((detail) => rebuffDetailPatterns("raises", detail)) }
    },
    {
      value: "masterPassive",
      group: "utility",
      iconName: "icon_master",
      masterPassiveType: "all",
      labels: skillFilterLabels("masterPassive")
    }
  ];
  const SKILL_FILTER_DETAILS = [
    ["sunnyWeather", "weather", [["makes the weather sunny"]]],
    ["rainyWeather", "weather", [["makes the weather rainy"]]],
    ["sandstormWeather", "weather", [["causes a sandstorm"]]],
    ["hailWeather", "weather", [["causes a hailstorm"]]],
    ["electricTerrain", "terrain", [["terrain into electric terrain"]]],
    ["grassyTerrain", "terrain", [["terrain into grassy terrain"]]],
    ["psychicTerrain", "terrain", [["terrain into psychic terrain"]]],
    ["normalZone", "zone", [["zone into a normal zone"], ["zone into an normal zone"]]],
    ["iceZone", "zone", [["zone into an ice zone"], ["zone into a ice zone"]]],
    ["fightingZone", "zone", [["zone into a fighting zone"]]],
    ["poisonZone", "zone", [["zone into a poison zone"]]],
    ["groundZone", "zone", [["zone into a ground zone"]]],
    ["flyingZone", "zone", [["zone into a flying zone"]]],
    ["bugZone", "zone", [["zone into a bug zone"]]],
    ["rockZone", "zone", [["zone into a rock zone"]]],
    ["ghostZone", "zone", [["zone into a ghost zone"]]],
    ["dragonZone", "zone", [["zone into a dragon zone"]]],
    ["darkZone", "zone", [["zone into a dark zone"]]],
    ["steelZone", "zone", [["zone into a steel zone"]]],
    ["fairyZone", "zone", [["zone into a fairy zone"]]],
    ["exSunnyWeather", "weatherEx", [["ex sunny"]]],
    ["exRainyWeather", "weatherEx", [["ex rainy"]]],
    ["exSandstormWeather", "weatherEx", [["ex sandstorm"]]],
    ["exHailWeather", "weatherEx", [["ex hailstorm"]]],
    ["exElectricTerrain", "terrainEx", [["ex electric terrain"]]],
    ["exGrassyTerrain", "terrainEx", [["ex grassy terrain"]]],
    ["exPsychicTerrain", "terrainEx", [["ex psychic terrain"]]],
    ["exNormalZone", "zoneEx", [["ex normal zone"]]],
    ["exIceZone", "zoneEx", [["ex ice zone"]]],
    ["exFightingZone", "zoneEx", [["ex fighting zone"]]],
    ["exPoisonZone", "zoneEx", [["ex poison zone"]]],
    ["exGroundZone", "zoneEx", [["ex ground zone"]]],
    ["exFlyingZone", "zoneEx", [["ex flying zone"]]],
    ["exBugZone", "zoneEx", [["ex bug zone"]]],
    ["exRockZone", "zoneEx", [["ex rock zone"]]],
    ["exGhostZone", "zoneEx", [["ex ghost zone"]]],
    ["exDragonZone", "zoneEx", [["ex dragon zone"]]],
    ["exDarkZone", "zoneEx", [["ex dark zone"]]],
    ["exSteelZone", "zoneEx", [["ex steel zone"]]],
    ["exFairyZone", "zoneEx", [["ex fairy zone"]]],
    ["circlePhysical", "circle", [["circle (physical)"]]],
    ["circleSpecial", "circle", [["circle (special)"]]],
    ["circleDefensive", "circle", [["circle (defensive)"]]],
    ["physicalDamageReduction", "alliedField", [["physical damage reduction effect"]]],
    ["specialDamageReduction", "alliedField", [["special damage reduction effect"]]],
    ["criticalHitDefense", "alliedField", [["critical-hit defense effect"]]],
    ["statusConditionDefense", "alliedField", [["status condition defense effect"]]],
    ["statusMoveDefense", "alliedField", [["status move defense effect"]]],
    ["statReductionDefense", "alliedField", [["stat reduction defense effect"]]],
    ["moveGaugeAcceleration", "alliedField", [["move gauge acceleration effect"]]],
    ["fireDamageField", "opponentField", [["fire damage field"]]],
    ["poisonDamageField", "opponentField", [["poison damage field"]]],
    ["rockDamageField", "opponentField", [["rock damage field"]]],
    ["darkDamageField", "opponentField", [["dark damage field"]]],
    ["steelDamageField", "opponentField", [["steel damage field"]]],
    ["noStatIncreases", "opponentField", [["no stat increases effect"]]],
    ["attackUp", "statUp", [["raises", "attack", "stat rank"]]],
    ["spAttackUp", "statUp", [["raises", "sp. atk", "stat rank"]]],
    ["defenseUp", "statUp", [["raises", "defense", "stat rank"]]],
    ["spDefenseUp", "statUp", [["raises", "sp. def", "stat rank"]]],
    ["speedUp", "statUp", [["raises", "speed", "stat rank"]]],
    ["accuracyUp", "statUp", [["raises", "accuracy", "stat rank"]]],
    ["evasionUp", "statUp", [["raises", "evasiveness", "stat rank"]]],
    ["criticalUp", "statUp", [["raises", "critical-hit rate"]]],
    ["attackDown", "statDown", [["lowers", "attack", "stat rank"]]],
    ["spAttackDown", "statDown", [["lowers", "sp. atk", "stat rank"]]],
    ["defenseDown", "statDown", [["lowers", "defense", "stat rank"]]],
    ["spDefenseDown", "statDown", [["lowers", "sp. def", "stat rank"]]],
    ["speedDown", "statDown", [["lowers", "speed", "stat rank"]]],
    ["accuracyDown", "statDown", [["lowers", "accuracy", "stat rank"]]],
    ["evasionDown", "statDown", [["lowers", "evasiveness", "stat rank"]]],
    ["opponentStatIncreaseRemoval", "statDown", OPPONENT_STAT_INCREASE_REMOVAL_PATTERNS],
    ["poison", "status", STATUS_INFLICT_PATTERNS.poison],
    ["burn", "status", STATUS_INFLICT_PATTERNS.burn],
    ["paralysis", "status", STATUS_INFLICT_PATTERNS.paralysis],
    ["sleep", "status", STATUS_INFLICT_PATTERNS.sleep],
    ["freeze", "status", STATUS_INFLICT_PATTERNS.freeze],
    ["flinch", "interference", INTERFERENCE_INFLICT_PATTERNS.flinch],
    ["confusion", "interference", INTERFERENCE_INFLICT_PATTERNS.confusion],
    ["trap", "interference", INTERFERENCE_INFLICT_PATTERNS.trap],
    ...Object.entries(STATUS_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, "statusImmunity", patterns]),
    ...Object.entries(INTERFERENCE_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, "interferenceImmunity", patterns]),
    ...Object.entries(STAT_REDUCTION_IMMUNITY_DETAIL_PATTERNS).map(([value, patterns]) => [value, "statReductionImmunity", patterns]),
    ...Object.entries(REBUFF_DETAIL_CONFIG).map(([value, detail]) => [value, "rebuff", rebuffDetailPatterns("lowers", detail)]),
    ...Object.entries(REBUFF_UP_DETAIL_CONFIG).map(([value, detail]) => [value, "rebuffUp", rebuffDetailPatterns("raises", detail)]),
    ["masterPhysical", "masterPassive", [], "physical"],
    ["masterSpecial", "masterPassive", [], "special"],
    ["masterGeneral", "masterPassive", [], "general"]
  ].map(([value, detailOf, patterns, masterPassiveType]) => ({
    value,
    detailOf,
    group: SKILL_FILTER_CATEGORIES.find((category) => category.value === detailOf)?.group || "utility",
    labels: skillFilterLabels(value),
    ...CIRCLE_DETAIL_TOOLTIP_LABELS[value] ? { tooltipLabels: CIRCLE_DETAIL_TOOLTIP_LABELS[value] } : {},
    patterns: { en: patterns },
    ...value === "allStatReductionImmunity" ? { tooltipNotes: STAT_REDUCTION_IMMUNITY_TOOLTIP_NOTES } : {},
    ...["attackReductionImmunity", "spAttackReductionImmunity", "defenseReductionImmunity", "spDefenseReductionImmunity", "speedReductionImmunity", "accuracyReductionImmunity", "evasionReductionImmunity"].includes(value) ? { tooltipNotes: STAT_REDUCTION_REVERSAL_TOOLTIP_NOTES } : {},
    ...value === "opponentStatIncreaseRemoval" ? {
      tooltipNotes: OPPONENT_STAT_INCREASE_REMOVAL_TOOLTIP_NOTES,
      suppressStatDirection: true
    } : {},
    ...(() => {
      const baseValue = value.startsWith("ex") ? `${value[2].toLowerCase()}${value.slice(3)}` : value;
      const icon = FIELD_DETAIL_ICON_CONFIG[baseValue];
      return icon ? { ...icon, iconOnly: icon.iconOnly !== false, exVariant: value.startsWith("ex") } : {};
    })(),
    ...REBUFF_DETAIL_CONFIG[value] ? {
      iconSrc: REBUFF_DETAIL_CONFIG[value].iconSrc,
      iconOnly: true,
      rebuffDirection: REBUFF_DETAIL_CONFIG[value].rebuffDirection
    } : {},
    ...REBUFF_UP_DETAIL_CONFIG[value] ? { iconSrc: REBUFF_UP_DETAIL_CONFIG[value].iconSrc, iconOnly: true, rebuffDirection: "↑" } : {},
    ...STAT_DECREASE_ICON_URLS[value.replace(/(?:Up|Down)$/, "")] || CONDITION_FILTER_ICON_URLS[value] ? {
      iconSrc: (value.endsWith("Up") ? STAT_INCREASE_ICON_URLS : STAT_DECREASE_ICON_URLS)[value.replace(/(?:Up|Down)$/, "")] || CONDITION_FILTER_ICON_URLS[value],
      iconOnly: true
    } : {},
    ...(() => {
      const iconKey = IMMUNITY_DETAIL_ICON_KEYS[value];
      const iconSrc = STAT_DECREASE_ICON_URLS[iconKey] || CONDITION_FILTER_ICON_URLS[iconKey];
      return iconSrc ? {
        iconSrc,
        compactLabels: skillFilterLabels("immunitySymbol"),
        attributeDirection: STAT_DECREASE_ICON_URLS[iconKey] ? "↓" : ""
      } : {};
    })(),
    ...masterPassiveType ? { masterPassiveType, compactLabels: { ja: "マスター" } } : {},
    ...value === "masterPhysical" ? {
      iconSrcs: [MASTER_PASSIVE_ICON_URLS.physical]
    } : value === "masterSpecial" ? {
      iconSrcs: [MASTER_PASSIVE_ICON_URLS.special]
    } : value === "masterGeneral" ? {
      iconSrcs: [MASTER_PASSIVE_ICON_URLS.physical, MASTER_PASSIVE_ICON_URLS.special]
    } : {}
  }));
  SKILL_FILTER_CATEGORIES.push(...SKILL_FILTER_DETAILS);
  const COPY = {
    en: {
      filter: "Filter",
      filters: "Filters",
      clear: "Clear",
      close: "Close",
      include: "Include",
      exclude: "Exclude",
      filterMatch: "Match",
      filterMatchAll: "All (&)",
      filterMatchAny: "Any (|)",
      nameSearch: "Name",
      nameSearchPlaceholder: "Search names…",
      skillSearch: "Passive skill search",
      skillSearchPlaceholder: "Search passive names and effects…",
      skillFieldEffects: "Field effects",
      skillBattleUtility: "Battle utility",
      skillStatChanges: "Stat changes",
      skillConditions: "Status effects",
      skillSpecialAbilities: "Special abilities",
      damagingMoveType: "Damaging move type",
      loading: "Updating results…",
      multiplier: "Multiplier: +{value}%",
      multiplierCap: "Multiplier cap: +{value}%",
      fieldDurationBase: "Field effect duration: about {value} sec (normal speed)",
      fieldDurationExtension: "Extension from this skill: about +{value} sec",
      requiredMoveLevel: "Required move level: {value}/5",
      relatedMove: "Related move: {name}",
      movePower: "Power {value}",
      moveAccuracy: "Accuracy {value}%",
      skillNoResults: "No matching skills",
      removeSkill: "Remove",
      type: "Type",
      role: "Role",
      weakness: "Weakness",
      rarity: "Initial stars",
      acquisition: "Acquisition",
      exclusivity: "Scout type",
      region: "Region",
      exRole: "EX role",
      roleCombination: "Role combination",
      trainerGroup: "Trainer group",
      fashion: "Fashion",
      other: "Other tags",
      superawakening: "Superawakening",
      sort: "Sort",
      sortUpdated: "Last updated",
      sortRelease: "Release date",
      sortSyncDex: "Sync pair Dex #",
      sortPokemonDex: "Pokémon #",
      sortName: "Name",
      sortRarity: "Initial stars",
      sortSyncCountdownReduction: "Maximum Guaranteed Sync CD Reduction (Beta)",
      ascending: "Ascending",
      descending: "Descending",
      listView: "List view",
      iconView: "Icon view",
      settings: "Settings",
      version: "Version",
      spoilerProtection: "Spoiler protection",
      spoilerDescription: "Hide sync pairs that are not released yet.",
      contributeOnGitHub: "View source and contribute on GitHub ↗",
      spoilerBanner: "Spoiler protection redirected you from an unreleased sync pair.",
      results: (count) => `${count} sync pairs`,
      empty: "No sync pairs match these filters."
    },
    fr: {
      filter: "Filtrer",
      filters: "Filtres",
      clear: "Réinitialiser",
      close: "Fermer",
      include: "Inclure",
      exclude: "Exclure",
      filterMatch: "Correspondance",
      filterMatchAll: "Tous (&)",
      filterMatchAny: "Un au moins (|)",
      nameSearch: "Nom",
      nameSearchPlaceholder: "Rechercher un nom…",
      skillSearch: "Recherche de talents passifs",
      skillSearchPlaceholder: "Rechercher par nom ou effet…",
      skillFieldEffects: "Effets de terrain",
      skillBattleUtility: "Utilité en combat",
      skillStatChanges: "Stats",
      skillConditions: "Altérations",
      skillSpecialAbilities: "Capacités spéciales",
      damagingMoveType: "Type des capacités offensives",
      loading: "Mise à jour des résultats…",
      multiplier: "Multiplicateur : +{value} %",
      multiplierCap: "Multiplicateur maximal : +{value} %",
      fieldDurationBase: "Durée de l’effet de terrain : environ {value} s (vitesse normale)",
      fieldDurationExtension: "Prolongation par ce talent : environ +{value} s",
      requiredMoveLevel: "Niveau de capacité requis : {value}/5",
      relatedMove: "Capacité liée : {name}",
      movePower: "Puissance {value}",
      moveAccuracy: "Précision {value} %",
      skillNoResults: "Aucun talent correspondant",
      removeSkill: "Retirer",
      type: "Type",
      role: "Rôle",
      weakness: "Faiblesse",
      rarity: "Étoiles initiales",
      acquisition: "Obtention",
      exclusivity: "Type de recrutement",
      region: "Région",
      exRole: "Rôle EX",
      roleCombination: "Combinaison de rôles",
      trainerGroup: "Groupe de Dresseurs",
      fashion: "Tenue",
      other: "Autres tags",
      superawakening: "Super-éveil",
      sort: "Trier",
      sortUpdated: "Dernière mise à jour",
      sortRelease: "Date de sortie",
      sortSyncDex: "Duo-Dex nº",
      sortPokemonDex: "Pokédex nº",
      sortName: "Nom",
      sortRarity: "Étoiles initiales",
      sortSyncCountdownReduction: "Réduction maximale garantie du compte Duo (Beta)",
      ascending: "Croissant",
      descending: "Décroissant",
      listView: "Vue liste",
      iconView: "Vue icônes",
      settings: "Paramètres",
      version: "Version",
      spoilerProtection: "Protection anti-spoiler",
      spoilerDescription: "Masquer les Duos qui ne sont pas encore sortis.",
      contributeOnGitHub: "Voir le code et contribuer sur GitHub ↗",
      spoilerBanner: "La protection anti-spoiler vous a redirigé depuis un Duo inédit.",
      results: (count) => `${count} Duos`,
      empty: "Aucun Duo ne correspond à ces filtres."
    },
    de: {
      filter: "Filter",
      filters: "Filter",
      clear: "Zurücksetzen",
      close: "Schließen",
      include: "Einschließen",
      exclude: "Ausschließen",
      filterMatch: "Treffer",
      filterMatchAll: "Alle (&)",
      filterMatchAny: "Beliebige (|)",
      nameSearch: "Name",
      nameSearchPlaceholder: "Namen suchen…",
      skillSearch: "Passivfähigkeitssuche",
      skillSearchPlaceholder: "Name oder Effekt suchen…",
      skillFieldEffects: "Feldeffekte",
      skillBattleUtility: "Kampffunktionen",
      skillStatChanges: "Werteänderungen",
      skillConditions: "Zustände",
      skillSpecialAbilities: "Spezialfähigkeiten",
      damagingMoveType: "Typ der Schadensattacken",
      loading: "Ergebnisse werden aktualisiert…",
      multiplier: "Multiplikator: +{value} %",
      multiplierCap: "Maximaler Multiplikator: +{value} %",
      fieldDurationBase: "Dauer des Feldeffekts: ca. {value} Sek. (normales Tempo)",
      fieldDurationExtension: "Verlängerung durch diese Fähigkeit: ca. +{value} Sek.",
      requiredMoveLevel: "Benötigtes Attackenlevel: {value}/5",
      relatedMove: "Zugehörige Attacke: {name}",
      movePower: "Stärke {value}",
      moveAccuracy: "Genauigkeit {value} %",
      skillNoResults: "Keine passenden Fähigkeiten",
      removeSkill: "Entfernen",
      type: "Typ",
      role: "Rolle",
      weakness: "Schwäche",
      rarity: "Anfangssterne",
      acquisition: "Erhalt",
      exclusivity: "Gefährtensuche",
      region: "Region",
      exRole: "EX-Rolle",
      roleCombination: "Rollenkombination",
      trainerGroup: "Trainergruppe",
      fashion: "Outfit",
      other: "Sonstige Tags",
      superawakening: "Super-Erwachen",
      sort: "Sortieren",
      sortUpdated: "Zuletzt aktualisiert",
      sortRelease: "Veröffentlichung",
      sortSyncDex: "Gefährten-Dex-Nr.",
      sortPokemonDex: "Pokédex-Nr.",
      sortName: "Name",
      sortRarity: "Anfangssterne",
      sortSyncCountdownReduction: "Max. garantierte Sync-Countdown-Reduktion (Beta)",
      ascending: "Aufsteigend",
      descending: "Absteigend",
      listView: "Listenansicht",
      iconView: "Symbolansicht",
      settings: "Einstellungen",
      version: "Version",
      spoilerProtection: "Spoilerschutz",
      spoilerDescription: "Noch nicht veröffentlichte Gefährten ausblenden.",
      contributeOnGitHub: "Quellcode ansehen und auf GitHub mitwirken ↗",
      spoilerBanner: "Der Spoilerschutz hat dich von einem unveröffentlichten Gefährten weitergeleitet.",
      results: (count) => `${count} Gefährten`,
      empty: "Keine Gefährten entsprechen diesen Filtern."
    },
    es: {
      filter: "Filtrar",
      filters: "Filtros",
      clear: "Restablecer",
      close: "Cerrar",
      include: "Incluir",
      exclude: "Excluir",
      filterMatch: "Coincidir",
      filterMatchAll: "Todas (&)",
      filterMatchAny: "Cualquiera (|)",
      nameSearch: "Nombre",
      nameSearchPlaceholder: "Buscar nombres…",
      skillSearch: "Buscar habilidades pasivas",
      skillSearchPlaceholder: "Buscar por nombre o efecto…",
      skillFieldEffects: "Efectos de campo",
      skillBattleUtility: "Funciones de combate",
      skillStatChanges: "Cambios de características",
      skillConditions: "Estados",
      skillSpecialAbilities: "Habilidades especiales",
      damagingMoveType: "Tipo de movimientos de ataque",
      loading: "Actualizando resultados…",
      multiplier: "Multiplicador: +{value} %",
      multiplierCap: "Multiplicador máximo: +{value} %",
      fieldDurationBase: "Duración del efecto de campo: unos {value} s (velocidad normal)",
      fieldDurationExtension: "Extensión de esta habilidad: unos +{value} s",
      requiredMoveLevel: "Nivel de movimiento requerido: {value}/5",
      relatedMove: "Movimiento relacionado: {name}",
      movePower: "Potencia {value}",
      moveAccuracy: "Precisión {value} %",
      skillNoResults: "No hay habilidades coincidentes",
      removeSkill: "Quitar",
      type: "Tipo",
      role: "Función",
      weakness: "Debilidad",
      rarity: "Estrellas iniciales",
      acquisition: "Obtención",
      exclusivity: "Tipo de reclutamiento",
      region: "Región",
      exRole: "Función EX",
      roleCombination: "Combinación de funciones",
      trainerGroup: "Grupo de Entrenadores",
      fashion: "Vestimenta",
      other: "Otras etiquetas",
      superawakening: "Superdespertar",
      sort: "Ordenar",
      sortUpdated: "Última actualización",
      sortRelease: "Fecha de lanzamiento",
      sortSyncDex: "Dex de compis n.º",
      sortPokemonDex: "Pokédex n.º",
      sortName: "Nombre",
      sortRarity: "Estrellas iniciales",
      sortSyncCountdownReduction: "Reducción máxima garantizada del contador compi (Beta)",
      ascending: "Ascendente",
      descending: "Descendente",
      listView: "Vista de lista",
      iconView: "Vista de iconos",
      settings: "Ajustes",
      version: "Versión",
      spoilerProtection: "Protección contra spoilers",
      spoilerDescription: "Oculta las parejas de compis aún no disponibles.",
      contributeOnGitHub: "Ver el código y colaborar en GitHub ↗",
      spoilerBanner: "La protección contra spoilers te ha redirigido desde una pareja aún no disponible.",
      results: (count) => `${count} parejas`,
      empty: "Ninguna pareja coincide con estos filtros."
    },
    it: {
      filter: "Filtra",
      filters: "Filtri",
      clear: "Reimposta",
      close: "Chiudi",
      include: "Includi",
      exclude: "Escludi",
      filterMatch: "Corrispondenza",
      filterMatchAll: "Tutti (&)",
      filterMatchAny: "Uno qualsiasi (|)",
      nameSearch: "Nome",
      nameSearchPlaceholder: "Cerca nomi…",
      skillSearch: "Cerca abilità passive",
      skillSearchPlaceholder: "Cerca per nome o effetto…",
      skillFieldEffects: "Effetti sul campo",
      skillBattleUtility: "Funzioni di lotta",
      skillStatChanges: "Modifiche statistiche",
      skillConditions: "Stati",
      skillSpecialAbilities: "Abilità speciali",
      damagingMoveType: "Tipo delle mosse d’attacco",
      loading: "Aggiornamento dei risultati…",
      multiplier: "Moltiplicatore: +{value}%",
      multiplierCap: "Moltiplicatore massimo: +{value}%",
      fieldDurationBase: "Durata effetto campo: circa {value} s (velocità normale)",
      fieldDurationExtension: "Estensione da questa abilità: circa +{value} s",
      requiredMoveLevel: "Livello mossa richiesto: {value}/5",
      relatedMove: "Mossa correlata: {name}",
      movePower: "Potenza {value}",
      moveAccuracy: "Precisione {value}%",
      skillNoResults: "Nessuna abilità corrispondente",
      removeSkill: "Rimuovi",
      type: "Tipo",
      role: "Ruolo",
      weakness: "Debolezza",
      rarity: "Stelle iniziali",
      acquisition: "Ottenimento",
      exclusivity: "Tipo di ricerca",
      region: "Regione",
      exRole: "Ruolo EX",
      roleCombination: "Combinazione di ruoli",
      trainerGroup: "Gruppo Allenatori",
      fashion: "Abbigliamento",
      other: "Altri tag",
      superawakening: "Superrisveglio",
      sort: "Ordina",
      sortUpdated: "Ultimo aggiornamento",
      sortRelease: "Data di uscita",
      sortSyncDex: "Dex Unità n.",
      sortPokemonDex: "Pokédex n.",
      sortName: "Nome",
      sortRarity: "Stelle iniziali",
      sortSyncCountdownReduction: "Riduzione massima garantita conto Unimossa (Beta)",
      ascending: "Crescente",
      descending: "Decrescente",
      listView: "Vista elenco",
      iconView: "Vista icone",
      settings: "Impostazioni",
      version: "Versione",
      spoilerProtection: "Protezione spoiler",
      spoilerDescription: "Nasconde le Unità non ancora disponibili.",
      contributeOnGitHub: "Vedi il codice e contribuisci su GitHub ↗",
      spoilerBanner: "La protezione spoiler ti ha reindirizzato da un’Unità non ancora disponibile.",
      results: (count) => `${count} Unità`,
      empty: "Nessuna Unità corrisponde a questi filtri."
    },
    ja: {
      filter: "フィルタ",
      filters: "フィルタ",
      clear: "リセット",
      close: "閉じる",
      include: "含む",
      exclude: "除外",
      filterMatch: "一致条件",
      filterMatchAll: "すべて (&)",
      filterMatchAny: "いずれか (|)",
      nameSearch: "名前",
      nameSearchPlaceholder: "名前を検索…",
      skillSearch: "パッシブスキル検索",
      skillSearchPlaceholder: "パッシブ名・効果を検索…",
      skillFieldEffects: "場の効果",
      skillBattleUtility: "バトル機能",
      skillStatChanges: "能力変化",
      skillConditions: "状態効果",
      skillSpecialAbilities: "特殊能力",
      damagingMoveType: "攻撃技タイプ",
      loading: "結果を更新中…",
      multiplier: "倍率: +{value}%",
      multiplierCap: "倍率上限: +{value}%",
      fieldDurationBase: "場の効果時間: 約{value}秒（通常速度）",
      fieldDurationExtension: "このスキルによる延長: 約+{value}秒",
      requiredMoveLevel: "必要わざレベル: {value}/5",
      relatedMove: "対象わざ: {name}",
      movePower: "威力 {value}",
      moveAccuracy: "命中率 {value}%",
      skillNoResults: "一致するスキルがありません",
      removeSkill: "削除",
      type: "タイプ",
      role: "ロール",
      weakness: "弱点",
      rarity: "初期★",
      acquisition: "入手方法",
      exclusivity: "スカウト種別",
      region: "地方",
      exRole: "EXロール",
      roleCombination: "ロール組み合わせ",
      trainerGroup: "トレーナーグループ",
      fashion: "ファッション",
      other: "その他タグ",
      superawakening: "超覚醒",
      sort: "並び替え",
      sortUpdated: "最終更新日",
      sortRelease: "実装日",
      sortSyncDex: "バディーズ図鑑 #",
      sortPokemonDex: "ポケモン図鑑 #",
      sortName: "名前",
      sortRarity: "初期★",
      sortSyncCountdownReduction: "確定の最大BC加速数（Beta）",
      ascending: "昇順",
      descending: "降順",
      listView: "リスト表示",
      iconView: "アイコン表示",
      settings: "設定",
      version: "バージョン",
      spoilerProtection: "ネタバレ防止",
      spoilerDescription: "未実装のバディーズを非表示にします。",
      contributeOnGitHub: "ソースを見る・GitHubで貢献 ↗",
      spoilerBanner: "ネタバレ防止のため、未実装のバディーズから自動的に移動しました。",
      results: (count) => `${count} 組`,
      empty: "条件に合うバディーズがいません。"
    },
    ko: {
      filter: "필터",
      filters: "필터",
      clear: "초기화",
      close: "닫기",
      include: "포함",
      exclude: "제외",
      filterMatch: "일치 조건",
      filterMatchAll: "모두 (&)",
      filterMatchAny: "하나 이상 (|)",
      nameSearch: "이름",
      nameSearchPlaceholder: "이름 검색…",
      skillSearch: "패시브 스킬 검색",
      skillSearchPlaceholder: "패시브 이름·효과 검색…",
      skillFieldEffects: "필드 효과",
      skillBattleUtility: "배틀 기능",
      skillStatChanges: "능력 변화",
      skillConditions: "상태 효과",
      skillSpecialAbilities: "특수 능력",
      damagingMoveType: "공격 기술 타입",
      loading: "결과 업데이트 중…",
      multiplier: "배율: +{value}%",
      multiplierCap: "최대 배율: +{value}%",
      fieldDurationBase: "필드 효과 시간: 약 {value}초 (보통 속도)",
      fieldDurationExtension: "이 스킬의 연장 시간: 약 +{value}초",
      requiredMoveLevel: "필요 기술 레벨: {value}/5",
      relatedMove: "대상 기술: {name}",
      movePower: "위력 {value}",
      moveAccuracy: "명중률 {value}%",
      skillNoResults: "일치하는 스킬이 없습니다",
      removeSkill: "삭제",
      type: "타입",
      role: "롤",
      weakness: "약점",
      rarity: "초기 ★",
      acquisition: "획득 방법",
      exclusivity: "버디즈서치 종류",
      region: "지방",
      exRole: "EX롤",
      roleCombination: "롤 조합",
      trainerGroup: "트레이너 그룹",
      fashion: "패션",
      other: "기타 태그",
      superawakening: "초각성",
      sort: "정렬",
      sortUpdated: "최근 업데이트",
      sortRelease: "출시일",
      sortSyncDex: "버디즈 도감 #",
      sortPokemonDex: "포켓몬 도감 #",
      sortName: "이름",
      sortRarity: "초기 ★",
      sortSyncCountdownReduction: "확정 최대 싱크 카운트 감소량 (Beta)",
      ascending: "오름차순",
      descending: "내림차순",
      listView: "목록 보기",
      iconView: "아이콘 보기",
      settings: "설정",
      version: "버전",
      spoilerProtection: "스포일러 방지",
      spoilerDescription: "아직 출시되지 않은 버디즈를 숨깁니다.",
      contributeOnGitHub: "소스 보기 및 GitHub에서 기여하기 ↗",
      spoilerBanner: "스포일러 방지를 위해 아직 출시되지 않은 버디즈에서 이동했습니다.",
      results: (count) => `${count} 버디즈`,
      empty: "조건에 맞는 버디즈가 없습니다."
    },
    zh: {
      filter: "篩選",
      filters: "篩選",
      clear: "清除",
      close: "關閉",
      include: "包含",
      exclude: "排除",
      filterMatch: "符合條件",
      filterMatchAll: "全部（&）",
      filterMatchAny: "任一（|）",
      nameSearch: "名稱",
      nameSearchPlaceholder: "搜尋名稱…",
      skillSearch: "被動技能搜尋",
      skillSearchPlaceholder: "搜尋被動名稱或效果…",
      skillFieldEffects: "場地效果",
      skillBattleUtility: "戰鬥功能",
      skillStatChanges: "能力變化",
      skillConditions: "狀態效果",
      skillSpecialAbilities: "特殊能力",
      damagingMoveType: "攻擊招式屬性",
      loading: "正在更新結果…",
      multiplier: "倍率：+{value}%",
      multiplierCap: "倍率上限：+{value}%",
      fieldDurationBase: "場地效果時間：約 {value} 秒（一般速度）",
      fieldDurationExtension: "此技能延長：約 +{value} 秒",
      requiredMoveLevel: "所需招式等級：{value}/5",
      relatedMove: "相關招式：{name}",
      movePower: "威力 {value}",
      moveAccuracy: "命中率 {value}%",
      skillNoResults: "沒有符合的技能",
      removeSkill: "移除",
      type: "屬性",
      role: "定位",
      weakness: "弱點",
      rarity: "初始星級",
      acquisition: "獲得方式",
      exclusivity: "限定類型",
      region: "地區",
      exRole: "EX 定位",
      roleCombination: "定位組合",
      trainerGroup: "訓練家分組",
      fashion: "服裝",
      other: "其他標籤",
      superawakening: "超級覺醒",
      sort: "排序",
      sortUpdated: "更新時間",
      sortRelease: "實裝時間",
      sortSyncDex: "拍組圖鑑 #",
      sortPokemonDex: "寶可夢圖鑑 #",
      sortName: "名稱",
      sortRarity: "初始星級",
      sortSyncCountdownReduction: "確定的最大拍招倒數減少數（Beta）",
      ascending: "升冪",
      descending: "降冪",
      listView: "列表檢視",
      iconView: "圖示檢視",
      settings: "設定",
      version: "版本",
      spoilerProtection: "防雷",
      spoilerDescription: "隱藏尚未實裝的拍組。",
      contributeOnGitHub: "查看原始碼並在 GitHub 參與貢獻 ↗",
      spoilerBanner: "為了防止劇透，已從尚未實裝的拍組自動跳轉。",
      results: (count) => `${count} 組拍組`,
      empty: "沒有符合條件的拍組。"
    }
  };
  const TYPE_NAMES = {
    en: ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"],
    fr: ["Normal", "Feu", "Eau", "Électrik", "Plante", "Glace", "Combat", "Poison", "Sol", "Vol", "Psy", "Insecte", "Roche", "Spectre", "Dragon", "Ténèbres", "Acier", "Fée"],
    de: ["Normal", "Feuer", "Wasser", "Elektro", "Pflanze", "Eis", "Kampf", "Gift", "Boden", "Flug", "Psycho", "Käfer", "Gestein", "Geist", "Drache", "Unlicht", "Stahl", "Fee"],
    es: ["Normal", "Fuego", "Agua", "Eléctrico", "Planta", "Hielo", "Lucha", "Veneno", "Tierra", "Volador", "Psíquico", "Bicho", "Roca", "Fantasma", "Dragón", "Siniestro", "Acero", "Hada"],
    it: ["Normale", "Fuoco", "Acqua", "Elettro", "Erba", "Ghiaccio", "Lotta", "Veleno", "Terra", "Volante", "Psico", "Coleottero", "Roccia", "Spettro", "Drago", "Buio", "Acciaio", "Folletto"],
    ja: ["ノーマル", "ほのお", "みず", "でんき", "くさ", "こおり", "かくとう", "どく", "じめん", "ひこう", "エスパー", "むし", "いわ", "ゴースト", "ドラゴン", "あく", "はがね", "フェアリー"],
    ko: ["노말", "불꽃", "물", "전기", "풀", "얼음", "격투", "독", "땅", "비행", "에스퍼", "벌레", "바위", "고스트", "드래곤", "악", "강철", "페어리"],
    zh: ["一般", "火", "水", "電", "草", "冰", "格鬥", "毒", "地面", "飛行", "超能力", "蟲", "岩石", "幽靈", "龍", "惡", "鋼", "妖精"]
  };
  const ROLE_NAMES = {
    en: ["Strike (Physical)", "Strike (Special)", "Support", "Tech", "Sprint", "Field", "Multi"],
    fr: ["Attaquant (physique)", "Attaquant (spécial)", "Soutien", "Tacticien", "Accélérateur", "Environnement", "Multi"],
    de: ["Angreifer (physisch)", "Angreifer (spezial)", "Helfer", "Taktiker", "Sprint", "Feld", "Multi"],
    es: ["Atacante (físico)", "Atacante (especial)", "Apoyo", "Técnico", "Velocidad", "Campo", "Multi"],
    it: ["Attaccante (fisico)", "Attaccante (speciale)", "Supporto", "Tecnico", "Sprint", "Campo", "Multi"],
    ja: ["アタッカー（物理）", "アタッカー（特殊）", "サポート", "テクニカル", "スピード", "フィールド", "マルチ"],
    ko: ["어태커(물리)", "어태커(특수)", "서포트", "테크니컬", "스피드", "필드", "멀티"],
    zh: ["攻擊（物理）", "攻擊（特殊）", "輔助", "技術", "速度", "場地", "全能"]
  };
  const ROLE_FAMILIES = [
    { value: "strike", icon: "strike", roles: [0, 1], labels: { en: "Strike", fr: "Attaquant", de: "Angreifer", es: "Atacante", it: "Attaccante", ja: "アタッカー", ko: "어태커", zh: "攻擊" } },
    { value: "support", icon: "support", roles: [2], labels: { en: "Support", fr: "Soutien", de: "Helfer", es: "Apoyo", it: "Supporto", ja: "サポート", ko: "서포트", zh: "輔助" } },
    { value: "tech", icon: "tech", roles: [3], labels: { en: "Tech", fr: "Tacticien", de: "Taktiker", es: "Técnico", it: "Tecnico", ja: "テクニカル", ko: "테크니컬", zh: "技術" } },
    { value: "sprint", icon: "sprint", roles: [4], labels: { en: "Sprint", fr: "Accélérateur", de: "Sprint", es: "Velocidad", it: "Sprint", ja: "スピード", ko: "스피드", zh: "速度" } },
    { value: "field", icon: "field", roles: [5], labels: { en: "Field", fr: "Environnement", de: "Feld", es: "Campo", it: "Campo", ja: "フィールド", ko: "필드", zh: "場地" } },
    { value: "multi", icon: "multi", roles: [6], labels: { en: "Multi", fr: "Multi", de: "Multi", es: "Multi", it: "Multi", ja: "マルチ", ko: "멀티", zh: "全能" } }
  ];
  const REGION_OPTIONS = [
    { value: "20020001", iconUrl: "https://archives.bulbagarden.net/media/upload/9/97/Let%27s_Go_icon_HOME.png", labels: { en: "Kanto", fr: "Kanto", de: "Kanto", es: "Kanto", it: "Kanto", ja: "カントー", ko: "관동", zh: "關都" } },
    { value: "20020002", labels: { en: "Johto", fr: "Johto", de: "Johto", es: "Johto", it: "Johto", ja: "ジョウト", ko: "성도", zh: "城都" } },
    { value: "20020003", labels: { en: "Hoenn", fr: "Hoenn", de: "Hoenn", es: "Hoenn", it: "Hoenn", ja: "ホウエン", ko: "호연", zh: "豐緣" } },
    { value: "20020004", iconUrl: "https://archives.bulbagarden.net/media/upload/0/0a/BDSP_icon_HOME.png", labels: { en: "Sinnoh", fr: "Sinnoh", de: "Sinnoh", es: "Sinnoh", it: "Sinnoh", ja: "シンオウ", ko: "신오", zh: "神奧" } },
    { value: "20020005", iconText: "◑", labels: { en: "Unova", fr: "Unys", de: "Einall", es: "Teselia", it: "Unima", ja: "イッシュ", ko: "하나", zh: "合眾" } },
    { value: "20020006", iconUrl: "https://archives.bulbagarden.net/media/upload/d/d2/Blue_pentagon_HOME.png", labels: { en: "Kalos", fr: "Kalos", de: "Kalos", es: "Kalos", it: "Kalos", ja: "カロス", ko: "칼로스", zh: "卡洛斯" } },
    { value: "20020007", iconUrl: "https://archives.bulbagarden.net/media/upload/0/04/Black_clover_HOME.png", labels: { en: "Alola", fr: "Alola", de: "Alola", es: "Alola", it: "Alola", ja: "アローラ", ko: "알로라", zh: "阿羅拉" } },
    { value: "20020008", iconUrl: "https://archives.bulbagarden.net/media/upload/6/6e/Galar_symbol_HOME.png", labels: { en: "Galar", fr: "Galar", de: "Galar", es: "Galar", it: "Galar", ja: "ガラル", ko: "가라르", zh: "伽勒爾" } },
    { value: "20020009", iconUrl: "https://archives.bulbagarden.net/media/upload/f/fe/Paldea_icon_HOME.png", labels: { en: "Paldea", fr: "Paldea", de: "Paldea", es: "Paldea", it: "Paldea", ja: "パルデア", ko: "팔데아", zh: "帕底亞" } },
    { value: "20020020", labels: { en: "Pasio", fr: "Passio", de: "Passio", es: "Passio", it: "Pasio", ja: "パシオ", ko: "파시오", zh: "帕希歐" } }
  ];
  const TYPE_COLORS = ["#9ca3af", "#ef5350", "#42a5f5", "#f6c447", "#66bb6a", "#8fd6e8", "#e57373", "#a871cc", "#bc9368", "#7399e8", "#ec78ad", "#9fbe45", "#b9a47b", "#876b9b", "#577dcc", "#735a7b", "#8590a5", "#ea8fb7"];
  const TYPE_ICON_NAMES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
  const ROLE_ICON_NAMES = ["strike", "strike", "support", "tech", "sprint", "field", "multi"];
  const ACQUISITION_OPTIONS = [
    { value: "1", icon: "icon_gem", labels: { en: "Scout", fr: "Appel Duo", de: "Gefährtensuche", es: "Reclutamiento", it: "Ricerca Unità", ja: "スカウト", ko: "버디즈서치", zh: "卡池" } },
    { value: "2", icon: "icon_event", labels: { en: "Free / Exchange", fr: "Gratuit / Échange", de: "Gratis / Tausch", es: "Gratis / Canje", it: "Gratis / Scambio", ja: "配布・交換", ko: "무료 / 교환", zh: "免費／兌換" } },
    { value: "4", icon: "icon_gymscout", labels: { en: "Gym Scout", fr: "Appel Arène", de: "Arenasuche", es: "Reclutamiento de Gimnasio", it: "Ricerca Palestra", ja: "ジムスカウト", ko: "체육관서치", zh: "道館精選" } },
    { value: "5", icon: "icon_academy", labels: { en: "Academy", fr: "Académie", de: "Akademie", es: "Academia", it: "Accademia", ja: "アカデミー", ko: "아카데미", zh: "學院" } }
  ];
  const EXCLUSIVITY_OPTIONS = [
    { value: "1", icon: "icon_genpool", labels: { en: "General Pool", fr: "Permanent", de: "Standard", es: "Permanente", it: "Standard", ja: "恒常", ko: "통상", zh: "常駐" } },
    { value: "2", icon: "icon_pokefair", labels: { en: "Fair", fr: "Festival", de: "Festival", es: "Festival", it: "Festival", ja: "フェス", ko: "페스티벌", zh: "慶典" } },
    { value: "3", icon: "icon_seasonal", labels: { en: "Seasonal", fr: "Saisonnier", de: "Saisonal", es: "Temporada", it: "Stagionale", ja: "季節限定", ko: "시즌 한정", zh: "季節限定" } },
    { value: "4", icon: "icon_alt", labels: { en: "Special Costume", fr: "Costume spécial", de: "Spezialkostüm", es: "Traje especial", it: "Costume speciale", ja: "スペシャルコス", ko: "스페셜 코스튬", zh: "特別服裝" } },
    { value: "5", icon: "icon_gem", labels: { en: "Variety", fr: "Variété", de: "Variety", es: "Variedad", it: "Varietà", ja: "バラエティ", ko: "버라이어티", zh: "多樣" } },
    { value: "6", icon: "icon_rotate", labels: { en: "Mix", fr: "Mix", de: "Mix", es: "Mix", it: "Mix", ja: "ミックス", ko: "믹스", zh: "混合" } },
    { value: "7", icon: "icon_masterex", labels: { en: "EX Fair", fr: "Festival EX", de: "EX-Festival", es: "Festival EX", it: "Festival EX", ja: "EXフェス", ko: "EX페스티벌", zh: "EX慶典" } }
  ];
  const TRAINER_MOVE_LABELS = {
    en: "Trainer move",
    fr: "Capacité Dresseur",
    de: "Trainer-Attacke",
    es: "Movimiento Entrenador",
    it: "Mossa Allenatore",
    ja: "T技",
    ko: "트레이너 기술",
    zh: "訓練家招式"
  };
  const SYNC_POWER_TILE_LABELS = {
    en: "Sync: Power +{value}",
    fr: "Capacité Duo : Puissance +{value}",
    de: "GA: Stärke +{value}",
    es: "Mov. comp.: Potencia +{value}",
    it: "Unimossa: Potenza +{value}",
    ja: "B技: 威力+{value}",
    ko: "버디즈 기술: 위력 +{value}",
    zh: "拍組招式：威力+{value}"
  };
  function language() {
    const normalizeLocale = (value) => {
      const normalized = String(value || "").toLowerCase();
      if (normalized.startsWith("zh")) return "zh";
      const primary = normalized.split(/[-_]/)[0];
      return COPY[primary] ? primary : "";
    };
    const urlLocale = normalizeLocale(new URL(location.href).searchParams.get("lang"));
    if (urlLocale) return urlLocale;
    const localeCookie = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith("locale="))?.slice("locale=".length);
    const cookieLocale = normalizeLocale(decodeURIComponent(localeCookie || ""));
    if (cookieLocale) return cookieLocale;
    const siteContent = [
      document.querySelector("g[data-cell-id]")?.dataset.tileName,
      document.querySelector("#syncPairDiv h1")?.textContent,
      document.querySelector("#pairSearchResults .pair-name")?.textContent
    ].filter(Boolean).join(" ");
    if (/[\u3040-\u30ff]/.test(siteContent)) return "ja";
    if (/[\uac00-\ud7af]/.test(siteContent)) return "ko";
    if (/[\u4e00-\u9fff]/.test(siteContent)) return "zh";
    return normalizeLocale(navigator.language) || "en";
  }
  function text() {
    return COPY[language()];
  }
  let trainerById = /* @__PURE__ */ new Map();
  let releaseDateByScheduleId = /* @__PURE__ */ new Map();
  let monsterById = /* @__PURE__ */ new Map();
  let monsterBaseById = /* @__PURE__ */ new Map();
  let trainerBaseById = /* @__PURE__ */ new Map();
  let pokemonNumberByBaseId = /* @__PURE__ */ new Map();
  let teamSkillTagById = /* @__PURE__ */ new Map();
  let teamSkillNameByLocale = { en: /* @__PURE__ */ new Map(), ja: /* @__PURE__ */ new Map(), zh: /* @__PURE__ */ new Map() };
  let moveNameByLocale = { en: /* @__PURE__ */ new Map(), ja: /* @__PURE__ */ new Map(), zh: /* @__PURE__ */ new Map() };
  let moveById = /* @__PURE__ */ new Map();
  let moveInfoByCellId = /* @__PURE__ */ new Map();
  let tileAbbreviationByCellId = /* @__PURE__ */ new Map();
  let skillEntriesByTrainerId = /* @__PURE__ */ new Map();
  let syncCountdownSkillEntriesByTrainerId = /* @__PURE__ */ new Map();
  let moveIdsByTrainerId = /* @__PURE__ */ new Map();
  let moveEntriesByTrainerId = /* @__PURE__ */ new Map();
  let theoreticalMoveIdsByTrainerId = /* @__PURE__ */ new Map();
  let passiveSkillChildrenById = /* @__PURE__ */ new Map();
  let passiveSkillTextDataByLocale = /* @__PURE__ */ new Map();
  let moveTextDataByLocale = /* @__PURE__ */ new Map();
  let skillTemplateParametersById = /* @__PURE__ */ new Map();
  let skillTemplateResolverByLocale = /* @__PURE__ */ new Map();
  let skillTemplateParameterLoadPromise = null;
  let passiveSkillSearchCache = /* @__PURE__ */ new Map();
  let pairSkillSearchCache = /* @__PURE__ */ new Map();
  let pairMoveSearchCache = /* @__PURE__ */ new Map();
  let pairSkillSearchDocumentsCache = /* @__PURE__ */ new Map();
  let pairMoveSearchDocumentsCache = /* @__PURE__ */ new Map();
  let passiveSkillDetailCache = /* @__PURE__ */ new Map();
  let pairSkillIdCache = /* @__PURE__ */ new Map();
  let pairSkillCategoryMatchCache = /* @__PURE__ */ new Map();
  let pairSyncCountdownReductionCache = /* @__PURE__ */ new Map();
  let gridUpdateDatesByTrainerId = /* @__PURE__ */ new Map();
  let exRoleByTrainerId = /* @__PURE__ */ new Map();
  let superawakeningTrainerIds = /* @__PURE__ */ new Set();
  let pairImageById = /* @__PURE__ */ new Map();
  let pairListCache = [];
  let pairListCacheKey = "";
  let pairRenderQueued = false;
  let pairRenderTimer = 0;
  let pickerAvatarObserver = null;
  let selectedTypes = /* @__PURE__ */ new Set();
  let selectedMoveTypes = /* @__PURE__ */ new Set();
  let selectedRoles = /* @__PURE__ */ new Set();
  let selectedWeaknesses = /* @__PURE__ */ new Set();
  let selectedRarities = /* @__PURE__ */ new Set();
  let selectedAcquisitions = /* @__PURE__ */ new Set();
  let selectedExclusivities = /* @__PURE__ */ new Set();
  let selectedRegions = /* @__PURE__ */ new Set();
  let selectedExRoles = /* @__PURE__ */ new Set();
  let selectedRoleCombinations = /* @__PURE__ */ new Set();
  let selectedSuperawakening = /* @__PURE__ */ new Set();
  let selectedTrainerGroups = /* @__PURE__ */ new Set();
  let selectedFashion = /* @__PURE__ */ new Set();
  let selectedOther = /* @__PURE__ */ new Set();
  let filterIsOpen = false;
  let filterMatchMode = "and";
  let skillSearchQuery = "";
  let selectedSkillIds = /* @__PURE__ */ new Set();
  let selectedSkillCategories = /* @__PURE__ */ new Set();
  let excludedFilters = /* @__PURE__ */ new Map();
  let excludedSkillCategories = /* @__PURE__ */ new Set();
  let sortCriterion = "updated";
  let sortDirection = "desc";
  let viewMode = "icons";
  let spoilerProtectionEnabled = false;
  let lastSafePairId = "";
  let openFilterAccordions = /* @__PURE__ */ new Set();
  let closedFilterAccordions = /* @__PURE__ */ new Set();
  let refreshQueued = false;
  let responsiveGrid = null;
  let gridResizeObserver = null;
  let windowResizeBound = false;
  let retainedSyncGridSection = null;
  let gridMemoryObserver = null;
  let observedMemoryGrid = null;
  let restoringGridBuild = false;
  let gridSaveQueued = false;
  try {
    const preferences = JSON.parse(localStorage.getItem(PICKER_PREFERENCES_KEY) || "{}");
    const legacySort = typeof preferences.sort === "string" ? preferences.sort.match(/^(release|name|rarity)-(asc|desc)$/) : null;
    const savedCriterion = ["updated", "release", "sync-dex", "pokemon-dex", "name", "rarity", "sync-countdown-reduction"].includes(preferences.sortCriterion) ? preferences.sortCriterion : legacySort?.[1];
    const migratingReleaseDefault = preferences.version < PREFERENCE_VERSION && (!savedCriterion || savedCriterion === "release");
    if (!migratingReleaseDefault && savedCriterion) sortCriterion = savedCriterion;
    if (migratingReleaseDefault) sortDirection = "desc";
    else if (["asc", "desc"].includes(preferences.sortDirection)) sortDirection = preferences.sortDirection;
    else if (legacySort) sortDirection = legacySort[2];
    if (preferences.version >= 2 && ["list", "icons"].includes(preferences.view)) viewMode = preferences.view;
    spoilerProtectionEnabled = preferences.spoilerProtection === true;
    if (typeof preferences.lastSafePairId === "string") lastSafePairId = preferences.lastSafePairId;
    if (Array.isArray(preferences.openFilterAccordions)) {
      openFilterAccordions = new Set(preferences.openFilterAccordions.filter((group) => typeof group === "string"));
    }
    if (Array.isArray(preferences.closedFilterAccordions)) {
      closedFilterAccordions = new Set(preferences.closedFilterAccordions.filter((group) => typeof group === "string"));
    }
    if (["and", "or"].includes(preferences.filterMatchMode)) filterMatchMode = preferences.filterMatchMode;
  } catch (_) {
  }
  function savePickerPreferences() {
    try {
      localStorage.setItem(PICKER_PREFERENCES_KEY, JSON.stringify({
        version: PREFERENCE_VERSION,
        sortCriterion,
        sortDirection,
        view: viewMode,
        spoilerProtection: spoilerProtectionEnabled,
        lastSafePairId,
        filterMatchMode,
        openFilterAccordions: [...openFilterAccordions],
        closedFilterAccordions: [...closedFilterAccordions]
      }));
    } catch (_) {
    }
  }
  function readSavedGridBuilds() {
    try {
      const saved = JSON.parse(localStorage.getItem(GRID_PREFERENCES_KEY) || "{}");
      return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    } catch (_) {
      return {};
    }
  }
  function currentPairId() {
    return String(document.getElementById("syncPairSelect")?.value || new URL(location.href).searchParams.get("pair") || "");
  }
  function normalizedGridBuild(value) {
    const defaults = { moveLevel: 5, maxEnergyCap: 60 };
    if (Array.isArray(value)) return { selectedCellIds: value.map(String), ...defaults };
    if (!value || typeof value !== "object") return { selectedCellIds: [], ...defaults };
    return {
      selectedCellIds: Array.isArray(value.selectedCellIds) ? value.selectedCellIds.map(String) : [],
      moveLevel: Number(value.moveLevel) || defaults.moveLevel,
      maxEnergyCap: Number(value.maxEnergyCap) || defaults.maxEnergyCap
    };
  }
  function currentMaxEnergyCap() {
    const selected = document.querySelector('input[name="energy-radio"]:checked');
    return Number(selected?.id.match(/^energy-(\d+)$/)?.[1]) || 0;
  }
  function saveCurrentGridBuild(grid = observedMemoryGrid) {
    if (restoringGridBuild || !grid?.isConnected) return;
    const pairId = currentPairId();
    if (!pairId) return;
    const builds = readSavedGridBuilds();
    const selectedCellIds = Array.from(grid.querySelectorAll("g[data-cell-id][selected]"), (cell) => cell.dataset.cellId);
    builds[pairId] = {
      selectedCellIds,
      moveLevel: currentMoveLevel(),
      maxEnergyCap: currentMaxEnergyCap()
    };
    try {
      localStorage.setItem(GRID_PREFERENCES_KEY, JSON.stringify(builds));
    } catch (_) {
    }
  }
  function queueGridBuildSave() {
    if (gridSaveQueued || restoringGridBuild) return;
    gridSaveQueued = true;
    requestAnimationFrame(() => {
      gridSaveQueued = false;
      saveCurrentGridBuild();
    });
  }
  function selectRememberedGridCell(cell, grid) {
    const transform = cell.getAttribute("transform");
    const polygon = Array.from(grid.querySelectorAll("polygon:not(.be-move-level-shade)")).find((candidate) => candidate.parentElement?.getAttribute("transform") === transform);
    polygon?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
  function restoreGridControls(remembered) {
    if (remembered.moveLevel) {
      document.querySelector(`[data-sync-level="${Math.min(5, remembered.moveLevel)}"]`)?.click();
    }
    if (remembered.maxEnergyCap) {
      const energy = document.getElementById(`energy-${remembered.maxEnergyCap}`);
      if (energy && !energy.checked) energy.click();
    }
  }
  function setupGridBuildMemory() {
    const grid = document.getElementById("grid");
    if (!grid || grid === observedMemoryGrid || !grid.querySelector("g[data-cell-id]")) return;
    gridMemoryObserver?.disconnect();
    observedMemoryGrid = grid;
    const pairId = currentPairId();
    const sharedBuild = new URL(location.href).searchParams.has("build");
    const remembered = normalizedGridBuild(readSavedGridBuilds()[pairId]);
    if (!sharedBuild) {
      restoringGridBuild = true;
      restoreGridControls(remembered);
      const rememberedIds = new Set(remembered.selectedCellIds);
      grid.querySelectorAll("g[data-cell-id]").forEach((cell) => {
        if (rememberedIds.has(String(cell.dataset.cellId)) && !cell.hasAttribute("selected")) {
          selectRememberedGridCell(cell, grid);
        }
      });
      restoringGridBuild = false;
    }
    if (!document.documentElement.dataset.beGridControlMemory) {
      document.documentElement.dataset.beGridControlMemory = "true";
      document.addEventListener("click", (event) => {
        if (!event.target.closest?.("[data-sync-level]")) return;
        queueGridBuildSave();
      }, true);
      document.addEventListener("change", (event) => {
        if (!event.target.matches?.('input[name="energy-radio"]')) return;
        queueGridBuildSave();
      }, true);
    }
    gridMemoryObserver = new MutationObserver(queueGridBuildSave);
    gridMemoryObserver.observe(grid, { subtree: true, attributes: true, attributeFilter: ["selected"] });
    saveCurrentGridBuild(grid);
  }
  function isSelectableTrainer(trainer) {
    return trainer && trainer.scheduleId !== "NEVER_CHECK_DICTIONARY" && trainer.scheduleId !== "NEVER" && trainer.scoutMethod !== 3;
  }
  function isReleasedTrainer(trainer, now = Date.now() / 1e3) {
    return (releaseDateByScheduleId.get(String(trainer?.scheduleId)) || 0) <= now;
  }
  function rememberSafePair(pairId) {
    const trainer = trainerById.get(String(pairId));
    if (!isSelectableTrainer(trainer) || !isReleasedTrainer(trainer)) return;
    lastSafePairId = String(pairId);
    savePickerPreferences();
  }
  async function preflightSpoilerProtection() {
    if (!spoilerProtectionEnabled) return true;
    const requestedPairId = new URL(location.href).searchParams.get("pair");
    if (!requestedPairId) return true;
    const root = document.documentElement;
    if (root) root.style.visibility = "hidden";
    let redirecting = false;
    try {
      await loadCoreData();
      const requestedTrainer = trainerById.get(String(requestedPairId));
      if (isSelectableTrainer(requestedTrainer) && !isReleasedTrainer(requestedTrainer)) {
        const releasedTrainers = [...trainerById.values()].filter((trainer) => isSelectableTrainer(trainer) && isReleasedTrainer(trainer)).sort((first, second) => {
          const firstDate = releaseDateByScheduleId.get(String(first.scheduleId)) || 0;
          const secondDate = releaseDateByScheduleId.get(String(second.scheduleId)) || 0;
          return firstDate - secondDate;
        });
        const rememberedTrainer = trainerById.get(String(lastSafePairId));
        const fallback = isSelectableTrainer(rememberedTrainer) && isReleasedTrainer(rememberedTrainer) ? rememberedTrainer : releasedTrainers[0];
        if (fallback) {
          const safeUrl = new URL(location.href);
          safeUrl.searchParams.set("pair", String(fallback.trainerId));
          ["monsterId", "baseId", "formId", "build"].forEach((parameter) => safeUrl.searchParams.delete(parameter));
          sessionStorage.setItem(SPOILER_REDIRECT_KEY, "true");
          redirecting = true;
          location.replace(safeUrl.toString());
          return false;
        }
      }
      rememberSafePair(requestedPairId);
    } catch (error) {
      console.warn("[Brybry Enhancer] Spoiler protection could not verify this Sync Pair.", error);
    } finally {
      if (root && !redirecting) root.style.visibility = "";
    }
    return true;
  }
  function showSpoilerBanner() {
    if (sessionStorage.getItem(SPOILER_REDIRECT_KEY) !== "true" || document.querySelector(".be-spoiler-banner")) return;
    sessionStorage.removeItem(SPOILER_REDIRECT_KEY);
    const banner = document.createElement("div");
    banner.className = "be-spoiler-banner";
    banner.setAttribute("role", "status");
    const message = document.createElement("span");
    message.textContent = text().spoilerBanner;
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", text().close);
    close.textContent = "×";
    close.addEventListener("click", () => banner.remove());
    banner.append(message, close);
    document.body.append(banner);
  }
  function updateSpoilerSensitiveSections() {
    document.documentElement?.toggleAttribute("data-be-spoiler-protection", spoilerProtectionEnabled);
    const lastUpdateSection = document.getElementById("lastReleasedPairs");
    if (lastUpdateSection) lastUpdateSection.hidden = spoilerProtectionEnabled;
  }
  function ensureSettingsControl() {
    const header = document.getElementById("headerBody");
    if (!header || document.getElementById("brybry-enhancer-settings")) return;
    const copy = text();
    const wrapper = document.createElement("div");
    wrapper.id = "brybry-enhancer-settings";
    wrapper.className = "be-settings";
    const button = document.createElement("button");
    button.className = "be-settings-button";
    button.type = "button";
    button.innerHTML = SETTINGS_ICON;
    button.setAttribute("aria-label", copy.settings);
    button.setAttribute("aria-expanded", "false");
    button.title = copy.settings;
    const popover = document.createElement("div");
    popover.id = "brybry-enhancer-settings-popover";
    popover.className = "be-settings-popover";
    popover.hidden = true;
    button.setAttribute("aria-controls", popover.id);
    const heading = document.createElement("h2");
    heading.className = "be-settings-heading";
    heading.textContent = ENHANCER_NAME;
    const toggleRow = document.createElement("label");
    toggleRow.className = "be-toggle-row";
    const toggleCopy = document.createElement("span");
    toggleCopy.className = "be-toggle-copy";
    const toggleTitle = document.createElement("strong");
    toggleTitle.textContent = copy.spoilerProtection;
    const toggleDescription = document.createElement("small");
    toggleDescription.textContent = copy.spoilerDescription;
    toggleCopy.append(toggleTitle, toggleDescription);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = spoilerProtectionEnabled;
    const switchVisual = document.createElement("span");
    switchVisual.className = "be-switch";
    switchVisual.setAttribute("aria-hidden", "true");
    toggleRow.append(toggleCopy, checkbox, switchVisual);
    const contributeLink = document.createElement("a");
    contributeLink.className = "be-settings-item";
    contributeLink.href = PROJECT_GITHUB_URL;
    contributeLink.target = "_blank";
    contributeLink.rel = "noopener noreferrer";
    contributeLink.textContent = copy.contributeOnGitHub;
    const version = document.createElement("div");
    version.className = "be-settings-item be-settings-version";
    const versionLabel = document.createElement("span");
    versionLabel.textContent = copy.version;
    const versionValue = document.createElement("strong");
    versionValue.textContent = `v${ENHANCER_VERSION}`;
    version.append(versionLabel, versionValue);
    popover.append(heading, toggleRow, contributeLink, version);
    wrapper.append(button, popover);
    header.append(wrapper);
    const setOpen = (open) => {
      popover.hidden = !open;
      button.setAttribute("aria-expanded", String(open));
    };
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(popover.hidden);
    });
    popover.addEventListener("click", (event) => event.stopPropagation());
    document.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
    checkbox.addEventListener("change", async () => {
      spoilerProtectionEnabled = checkbox.checked;
      savePickerPreferences();
      updateSpoilerSensitiveSections();
      if (spoilerProtectionEnabled && !await preflightSpoilerProtection()) return;
      refreshPicker();
    });
  }
  function addStyles() {
    if (document.getElementById(ROOT_ID)) return;
    const style = document.createElement("style");
    style.id = ROOT_ID;
    style.textContent = BRYBRY_ENHANCER_CSS;
    document.head.append(style);
  }
  function normalizeGridLabel(value) {
    return String(value || "").replace(/\u3000/g, " ").replace(/[\uff01-\uff5e]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 65248));
  }
  function conciseTileName(name) {
    const compact = normalizeGridLabel(name).replace(/\s+/g, " ").trim();
    if (!compact) return "";
    const isCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(compact);
    const limit = isCjk ? 24 : 44;
    if (Array.from(compact).length <= limit) return compact;
    const colon = compact.search(/[：:]/);
    if (colon > 0) {
      const head = Array.from(compact.slice(0, colon + 1));
      const tail = Array.from(compact.slice(colon + 1));
      if (tail.length <= (isCjk ? 13 : 24)) {
        return `${head.slice(0, isCjk ? 10 : 18).join("")}…${tail.join("")}`;
      }
    }
    const characters = Array.from(compact);
    const headLength = isCjk ? 12 : 21;
    const tailLength = isCjk ? 11 : 22;
    return `${characters.slice(0, headLength).join("")}…${characters.slice(-tailLength).join("")}`;
  }
  function wrapTileName(name) {
    const compact = conciseTileName(name);
    if (!compact) return [];
    const isCjk = /[\u3040-\u30ff\u3400-\u9fff]/.test(compact);
    const maxChars = isCjk ? 6 : 12;
    const characters = Array.from(compact);
    const lines = [];
    if (isCjk) {
      for (let index = 0; index < characters.length; index += maxChars) {
        lines.push(characters.slice(index, index + maxChars).join(""));
      }
    } else {
      let line = "";
      for (const word of compact.split(" ")) {
        const next = line ? `${line} ${word}` : word;
        if (next.length > maxChars && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      }
      if (line) lines.push(line);
    }
    if (lines.length > 4) {
      lines.length = 4;
      const last = Array.from(lines[3]);
      lines[3] = `${last.slice(0, Math.max(1, maxChars - 1)).join("")}…`;
    }
    return lines;
  }
  function pomaTemplateValue(template, passiveId) {
    const value = Math.abs(Number(passiveId)) % 10;
    return String(template || "").replace(/{{value}}/g, String(value)).replace(/{{plus}}/g, String(value + 1));
  }
  function pomaTileAbbreviation(ability, locale = language()) {
    const passiveId = Number(ability?.passiveId);
    if (!passiveId) return "";
    const skillTemplate = POMATOOLS_SKILL_ABBR[locale]?.[String(Math.floor(passiveId / 10))];
    if (!skillTemplate) return "";
    const skill = pomaTemplateValue(skillTemplate, passiveId);
    const moveId = Number(ability.moveId);
    if (Number(ability.type) !== 8 || moveId <= 0 || moveId > 3e4) return skill;
    if (moveId > 9999 && moveId < 18500) return `${TRAINER_MOVE_LABELS[locale]}: ${skill}`;
    const move = POMATOOLS_MOVE_ABBR[locale]?.[String(moveId)] || moveNameByLocale[locale]?.get(String(moveId));
    return move ? `${move}: ${skill}` : skill;
  }
  function syncPowerTileLabel(moveInfo, locale = language()) {
    if (!moveInfo?.isSyncPowerBoost || !Number.isFinite(moveInfo.abilityValue)) return "";
    const template = SYNC_POWER_TILE_LABELS[locale] || SYNC_POWER_TILE_LABELS.en;
    return normalizeGridLabel(template.replace("{value}", String(moveInfo.abilityValue)));
  }
  function displayTileName(tile, fullName) {
    const normalizedFullName = normalizeGridLabel(fullName);
    const syncPowerLabel = syncPowerTileLabel(moveInfoByCellId.get(String(tile.dataset.cellId)));
    if (syncPowerLabel) return syncPowerLabel;
    const abbreviated = normalizeGridLabel(tileAbbreviationByCellId.get(String(tile.dataset.cellId)));
    if (!abbreviated || abbreviated === normalizedFullName) return normalizedFullName;
    const normalized = normalizedFullName.replace(/\s+/g, " ").trim();
    const fullLines = wrapTileName(normalizedFullName);
    const abbreviatedLines = wrapTileName(abbreviated);
    const originalWasTruncated = conciseTileName(normalizedFullName) !== normalized;
    const materiallyImprovesLayout = fullLines.length >= 3 && abbreviatedLines.length < fullLines.length;
    return originalWasTruncated || fullLines.length >= 4 || materiallyImprovesLayout ? abbreviated : normalizedFullName;
  }
  const LINE_LAYOUTS = {
    1: { baseFontSize: 11.5, widths: [58] },
    2: { baseFontSize: 10, widths: [56, 52] },
    3: { baseFontSize: 9, widths: [50, 60, 48] },
    4: { baseFontSize: 9, widths: [44, 56, 56, 44] }
  };
  const TILE_LINE_HEIGHT = 1.15;
  function fitSpanToWidth(span, maxWidth) {
    requestAnimationFrame(() => {
      const measured = span.getComputedTextLength();
      if (measured > maxWidth) {
        span.setAttribute("textLength", String(maxWidth));
        span.setAttribute("lengthAdjust", "spacingAndGlyphs");
      }
    });
  }
  function addTileLabels() {
    document.querySelectorAll("g[data-cell-id]").forEach((tile) => {
      if (tile.querySelector(`.${TILE_LABEL_CLASS}`)) return;
      const fullName = normalizeGridLabel(tile.dataset.tileName);
      const lines = wrapTileName(displayTileName(tile, fullName));
      if (!lines.length) return;
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      const layout = LINE_LAYOUTS[lines.length];
      label.classList.add(TILE_LABEL_CLASS);
      label.setAttribute("x", "34.5");
      label.setAttribute("text-anchor", "middle");
      label.dataset.lineCount = String(lines.length);
      label.setAttribute("font-size", String(layout.baseFontSize));
      label.setAttribute("aria-label", fullName);
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = fullName;
      label.append(title);
      lines.forEach((line, index) => {
        const span = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        span.setAttribute("x", "34.5");
        span.setAttribute("y", "32");
        span.textContent = line;
        label.append(span);
        fitSpanToWidth(span, layout.widths[index]);
      });
      tile.append(label);
    });
  }
  function repositionGridTooltip(tooltip, tile) {
    const tileRect = tile.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    let left = tileRect.left + tileRect.width / 2 - tooltipRect.width / 2 + window.scrollX;
    let top = tileRect.top - tooltipRect.height - 10 + window.scrollY;
    if (top < window.scrollY) top = tileRect.bottom + 10 + window.scrollY;
    left = Math.max(window.scrollX + 8, Math.min(left, window.scrollX + window.innerWidth - tooltipRect.width - 8));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }
  function visibleGridTooltip() {
    return [...document.querySelectorAll("body > .tooltip")].reverse().find((candidate) => getComputedStyle(candidate).display !== "none");
  }
  function appendPowerMultiplier(tooltip, multiplier) {
    if (!tooltip || !multiplier || tooltip.querySelector(".be-power-multiplier")) return;
    const template = multiplier.kind === "cap" ? text().multiplierCap : text().multiplier;
    if (!template) return;
    const line = document.createElement("span");
    line.className = "be-power-multiplier";
    line.textContent = template.replace("{value}", String(multiplier.value));
    const effect = tooltip.children[1];
    if (effect) effect.append(line);
    else tooltip.append(line);
  }
  function fieldDurationInfo(passiveId, englishDescription) {
    const description = String(englishDescription || "").normalize("NFKC");
    const extendsDuration = /extends the duration/i.test(description);
    const createsTimedField = [
      /makes the weather (?:sunny|rainy)/i,
      /causes (?:a sandstorm|a hailstorm|snow)/i,
      /turns the field of play(?:’s|'s) (?:terrain|zone) into/i,
      /applies [^.]*circle[^.]* to the allied field of play/i,
      /applies (?:the )?(?:physical damage reduction|special damage reduction|critical-hit defense|status condition defense|status move defense|stat reduction defense|move gauge acceleration|no stat increases) effect/i,
      /applies (?:the )?(?:fire|poison|rock|dark|steel) damage field/i
    ].some((pattern) => pattern.test(description));
    if (!extendsDuration && !createsTimedField) return null;
    const level = Math.abs(Number(passiveId)) % 10;
    return {
      baseSeconds: 45,
      extensionSeconds: extendsDuration && level > 0 ? level * 10 : null
    };
  }
  function appendFieldDuration(tooltip, moveInfo) {
    if (!tooltip || !moveInfo?.passiveId || tooltip.querySelector(".be-field-duration")) return;
    const englishDescription = passiveSkillDetails(moveInfo.passiveId, "en")?.description;
    const duration = fieldDurationInfo(moveInfo.passiveId, englishDescription);
    if (!duration) return;
    const copy = text();
    const details = [copy.fieldDurationBase.replace("{value}", String(duration.baseSeconds))];
    if (duration.extensionSeconds) {
      details.push(copy.fieldDurationExtension.replace("{value}", String(duration.extensionSeconds)));
    }
    const line = document.createElement("span");
    line.className = "be-field-duration";
    line.textContent = details.join(" · ");
    tooltip.append(line);
  }
  function requiredMoveLevel(tile) {
    return Math.max(1, Number(tile?.dataset.level) || 1);
  }
  function moveLevelIconUrl(level) {
    return `${MOVE_LEVEL_ICON_BASE}${Math.min(5, Math.max(1, Number(level) || 1))}.png`;
  }
  function appendRequiredMoveLevel(tooltip, tile) {
    if (!tooltip || tooltip.querySelector(".be-required-move-level")) return;
    const level = requiredMoveLevel(tile);
    const accessibleLabel = text().requiredMoveLevel.replace("{value}", String(level));
    const line = document.createElement("span");
    line.className = "be-required-move-level";
    line.setAttribute("aria-label", accessibleLabel);
    line.title = accessibleLabel;
    const icon = document.createElement("img");
    icon.className = "be-required-move-level-icon";
    icon.src = moveLevelIconUrl(level);
    icon.alt = accessibleLabel;
    line.append(icon);
    const title = tooltip.firstElementChild;
    const titleText = title?.querySelector("b") || title?.firstChild;
    if (title && titleText) title.insertBefore(line, titleText);
    else tooltip.prepend(line);
  }
  function appendRelatedMoveDescription(tooltip, moveInfo) {
    if (!tooltip || !moveInfo?.moveId || moveInfo.abilityType === 11 || tooltip.querySelector(".be-related-move")) return;
    const moveDescriptionResolver = typeof window.getMoveDescr === "function" ? window.getMoveDescr : typeof getMoveDescr === "function" ? getMoveDescr : null;
    const description = moveDescriptionResolver?.(Number(moveInfo.moveId));
    const moveName = moveNameByLocale[language()].get(moveInfo.moveId) || moveInfo.moveId;
    const copy = text();
    const stats = [
      moveInfo.movePower > 0 ? copy.movePower.replace("{value}", String(moveInfo.movePower)) : "",
      moveInfo.moveAccuracy > 0 ? copy.moveAccuracy.replace("{value}", String(moveInfo.moveAccuracy)) : ""
    ].filter(Boolean);
    const block = document.createElement("p");
    block.className = "be-related-move";
    const name = document.createElement("strong");
    name.textContent = copy.relatedMove.replace("{name}", moveName);
    if (description && description !== "undefined") {
      const detail = document.createElement("span");
      detail.textContent = description;
      block.append(name, detail);
    } else {
      block.append(name);
    }
    if (stats.length) {
      const statLine = document.createElement("span");
      statLine.className = "be-related-move-stats";
      statLine.textContent = stats.join(" · ");
      block.append(statLine);
    }
    tooltip.append(block);
  }
  function appendGridTooltipDetails(tile, moveInfo) {
    const tooltip = visibleGridTooltip();
    if (!tooltip) return;
    appendRequiredMoveLevel(tooltip, tile);
    appendPowerMultiplier(tooltip, moveInfo?.powerMultiplier);
    appendFieldDuration(tooltip, moveInfo);
    appendRelatedMoveDescription(tooltip, moveInfo);
    repositionGridTooltip(tooltip, tile);
  }
  function setupMoveTooltips() {
    const grid = document.getElementById("grid");
    if (!grid) return;
    const polygons = Array.from(grid.querySelectorAll("polygon"));
    grid.querySelectorAll("g[data-cell-id]").forEach((tile) => {
      const moveInfo = moveInfoByCellId.get(String(tile.dataset.cellId));
      const transform = tile.getAttribute("transform");
      const polygon = polygons.find((candidate) => candidate.parentElement?.getAttribute("transform") === transform);
      if (!polygon || polygon.dataset.beMoveTooltipBound === "true") return;
      polygon.dataset.beMoveTooltipBound = "true";
      polygon.addEventListener("mouseenter", () => {
        tile.classList.add("be-move-level-hovered");
        appendGridTooltipDetails(tile, moveInfo);
      });
      polygon.addEventListener("mouseleave", () => tile.classList.remove("be-move-level-hovered"));
    });
  }
  function currentMoveLevel() {
    const activeLevels = [...document.querySelectorAll("[data-sync-level]")].filter((control) => !getComputedStyle(control).backgroundImage.includes("level-off")).map((control) => Number(control.dataset.syncLevel)).filter(Number.isFinite);
    return activeLevels.length ? Math.max(...activeLevels) : 1;
  }
  function maxEnergyCapForMoveLevel(level) {
    return 60 + Math.min(5, Math.max(1, Number(level) || 1)) * 2;
  }
  function updateMaxEnergyCapAvailability(level = currentMoveLevel()) {
    const maximum = maxEnergyCapForMoveLevel(level);
    const energyControls = [...document.querySelectorAll('input[name="energy-radio"]')];
    energyControls.forEach((control) => {
      const cap = Number(control.id.match(/^energy-(\d+)$/)?.[1]);
      control.disabled = Number.isFinite(cap) && cap > maximum;
    });
    const selected = energyControls.find((control) => control.checked);
    const selectedCap = Number(selected?.id.match(/^energy-(\d+)$/)?.[1]);
    if (selected && Number.isFinite(selectedCap) && selectedCap <= maximum) return;
    const fallback = document.getElementById(`energy-${maximum}`);
    if (fallback && !fallback.disabled && !fallback.checked) fallback.click();
  }
  function updateMoveLevelAvailability() {
    const level = currentMoveLevel();
    updateMaxEnergyCapAvailability(level);
    document.querySelectorAll("#grid g[data-cell-id]").forEach((tile) => {
      let shade = tile.querySelector(".be-move-level-shade");
      if (!shade) {
        shade = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shade.classList.add("be-move-level-shade");
        shade.setAttribute("points", "17.25,0 51.75,0 69,30 51.75,60 17.25,60 0,30");
        tile.append(shade);
      }
      const unavailable = requiredMoveLevel(tile) > level;
      tile.classList.toggle("be-move-level-disabled", unavailable);
      tile.setAttribute("aria-disabled", String(unavailable));
    });
  }
  function setupMoveLevelAvailability() {
    if (!document.documentElement.dataset.beMoveLevelAvailability) {
      document.documentElement.dataset.beMoveLevelAvailability = "true";
      document.addEventListener("click", (event) => {
        if (!event.target.closest?.("[data-sync-level]")) return;
        requestAnimationFrame(updateMoveLevelAvailability);
      }, true);
    }
    updateMoveLevelAvailability();
  }
  function resizeGrid() {
    const svg = document.querySelector("#gridDiv > svg");
    const gridDiv = svg?.parentElement;
    const wrapper = gridDiv?.parentElement;
    if (!svg || !gridDiv || !wrapper) return;
    const naturalWidth = Number.parseFloat(svg.getAttribute("width")) || svg.viewBox.baseVal.width;
    const naturalHeight = Number.parseFloat(svg.getAttribute("height")) || svg.viewBox.baseVal.height;
    const availableWidth = Math.max(0, wrapper.clientWidth - 8);
    if (!naturalWidth || !naturalHeight || !availableWidth) return;
    const roomyViewport = window.innerWidth >= 700;
    const remainingHeight = Math.max(
      360,
      window.innerHeight - wrapper.getBoundingClientRect().top - 20,
      window.innerHeight - 40
    );
    const widthScale = availableWidth / naturalWidth;
    const heightScale = remainingHeight / naturalHeight;
    const scale = roomyViewport ? Math.max(1, Math.min(widthScale, heightScale, 2.25)) : Math.min(1, widthScale);
    svg.style.setProperty("transform", `scale(${scale})`, "important");
    svg.style.transformOrigin = "top left";
    gridDiv.style.width = `${naturalWidth * scale}px`;
    gridDiv.style.height = `${naturalHeight * scale}px`;
    resizeTileLabels(scale);
  }
  function resizeTileLabels(gridScale) {
    document.querySelectorAll(`.${TILE_LABEL_CLASS}`).forEach((label) => {
      const lineCount = Number(label.dataset.lineCount) || 1;
      const layout = LINE_LAYOUTS[lineCount];
      const screenFontSize = Math.max(9, Math.min(16, layout.baseFontSize * gridScale));
      label.setAttribute("font-size", String(screenFontSize / gridScale));
      label.style.setProperty("stroke-width", `${2.1 / gridScale}px`);
      label.querySelectorAll("tspan").forEach((span, index) => {
        const offset = index - (lineCount - 1) / 2;
        const lineHeight = screenFontSize * TILE_LINE_HEIGHT;
        span.setAttribute("y", String(32 + offset * (lineHeight / gridScale)));
        span.removeAttribute("textLength");
        span.removeAttribute("lengthAdjust");
        fitSpanToWidth(span, layout.widths[index]);
      });
    });
  }
  function setupResponsiveGrid() {
    const gridDiv = document.getElementById("gridDiv");
    const wrapper = gridDiv?.parentElement;
    const picker = wrapper?.parentElement;
    if (!gridDiv || !wrapper || !picker) return;
    wrapper.classList.add("be-grid-wrapper");
    picker.classList.add("be-grid-picker");
    if (responsiveGrid !== wrapper) {
      gridResizeObserver?.disconnect();
      responsiveGrid = wrapper;
      gridResizeObserver = new ResizeObserver(() => requestAnimationFrame(resizeGrid));
      gridResizeObserver.observe(wrapper);
    }
    if (!windowResizeBound) {
      windowResizeBound = true;
      window.addEventListener("resize", () => requestAnimationFrame(resizeGrid), { passive: true });
    }
    requestAnimationFrame(resizeGrid);
  }
  function moveSyncGridBeforeStats() {
    const documentGrid = document.getElementById("syncGridDiv");
    if (documentGrid) retainedSyncGridSection = documentGrid;
    const gridSection = documentGrid || retainedSyncGridSection;
    const activePairContent = [...document.querySelectorAll(".tabContent")].find((section) => getComputedStyle(section).display !== "none");
    if (!gridSection || !activePairContent) return;
    const statsHeading = [...activePairContent.children].find((child) => child.tagName === "H2");
    if (!statsHeading || gridSection.nextElementSibling === statsHeading) return;
    activePairContent.insertBefore(gridSection, statsHeading);
  }
  function restoreSyncGridHome() {
    const documentGrid = document.getElementById("syncGridDiv");
    if (documentGrid) retainedSyncGridSection = documentGrid;
    const gridSection = documentGrid || retainedSyncGridSection;
    const content = document.getElementById("contentDiv");
    if (!gridSection || !content || gridSection.parentElement === content) return;
    content.append(gridSection);
  }
  function setupSectionOrdering() {
    if (!document.documentElement.dataset.beSectionOrdering) {
      document.documentElement.dataset.beSectionOrdering = "true";
      document.addEventListener("change", (event) => {
        if (event.target.id === "syncPairSelect") restoreSyncGridHome();
      }, true);
      document.addEventListener("click", (event) => {
        if (!event.target.closest(".tabLinks")) return;
        requestAnimationFrame(moveSyncGridBeforeStats);
      }, true);
    }
    moveSyncGridBeforeStats();
  }
  function brybryParameterValues(entry) {
    if (!entry) return [];
    const values = [];
    for (let index = 1; index < 50; index += 2) {
      values.push(Number(entry[`param${index}`]) >= 0 ? entry[`param${index + 1}`] : null);
    }
    return values;
  }
  function brybryTemplateAttributes(source) {
    const attributes = { Idx: "0", Ref: "0" };
    String(source || "").replace(/(\w+)="([^"]*)"/g, (match, name, value) => {
      attributes[name] = value;
      return match;
    });
    return attributes;
  }
  function brybryDocumentsMatchPatterns(documents, patterns) {
    const normalize = (value) => String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
    return documents.some((documentText) => {
      const protectedText = String(documentText || "").replace(/\bSp\./gi, (value) => value.replace(".", "․"));
      const segments = protectedText.split(/(?:[.!?。！？]\s+|\r?\n+)(?=[A-Z0-9\[(])/).map((segment) => normalize(segment.replace(/\u2024/g, "."))).filter(Boolean);
      return segments.some((segment) => patterns.some((requiredTerms) => requiredTerms.every((term) => segment.includes(normalize(term)))));
    });
  }
  function brybryMasterPassiveKind(passiveId, resolvedEnglishName = "") {
    const numericId = Number(passiveId);
    if (!Number.isFinite(numericId) || numericId < 28e6 || numericId >= 29e6) return "";
    const normalizedName = String(resolvedEnglishName).normalize("NFKC").toLocaleLowerCase();
    if (normalizedName.includes("pride")) return "physical";
    if (normalizedName.includes("spirit")) return "special";
    return "general";
  }
  function expandBrybryParts(template, partTag, parts, onPart, maxPasses = 16) {
    let result = String(template ?? "");
    if (!partTag || !parts) return result;
    const pattern = new RegExp(`\\[Name:${partTag}\\s+Idx="([^"]+)"\\s*\\]`, "gi");
    for (let pass = 0; pass < maxPasses; pass += 1) {
      let changed = false;
      result = result.replace(pattern, (placeholder, id) => {
        if (parts[String(id)] === void 0) return placeholder;
        changed = true;
        return onPart ? onPart(String(parts[String(id)]), String(id)) : String(parts[String(id)]);
      });
      if (!changed) break;
    }
    return result;
  }
  function createBrybryTemplateResolver({
    parametersById,
    numbers,
    referencedMessages,
    moveNames,
    passiveNames,
    passiveNameParts,
    moveDescriptions,
    moveDescriptionParts,
    passiveDescriptions,
    passiveDescriptionParts
  }) {
    const passiveNameCache = /* @__PURE__ */ new Map();
    const resolvingPassiveNames = /* @__PURE__ */ new Set();
    const parameterValues = (id) => brybryParameterValues(parametersById.get(String(id)));
    const localizedValue = (table, key) => table instanceof Map ? table.get(String(key)) : table?.[String(key)];
    function resolvePlaceholders(id, template) {
      const params = parameterValues(id);
      return String(template ?? "").replace(/\[([A-Z]{2}|Digit|Name):([^\s\]]+)([^\]]*)\]/g, (placeholder, type, subtype, rawAttributes) => {
        const attributes = brybryTemplateAttributes(rawAttributes);
        if (type === "Digit") {
          return localizedValue(numbers, params[Number(attributes.Idx) || 0]) ?? placeholder;
        }
        if (type === "Name" && subtype === "ReferencedMessageTag") {
          return localizedValue(referencedMessages, params[Number(attributes.Idx) || 0]) ?? placeholder;
        }
        if (type === "Name" && subtype === "MoveId") {
          return localizedValue(moveNames, attributes.Idx) ?? placeholder;
        }
        if (type === "Name" && subtype === "PassiveSkillId") {
          return resolvePassiveName(attributes.Idx) || placeholder;
        }
        if (["DE", "EN", "ES", "FR", "IT"].includes(type) && subtype === "Qty") {
          const quantity = Number(params[Number(attributes.Ref) || 0]);
          return quantity > 1 ? attributes.P ?? placeholder : attributes.S ?? placeholder;
        }
        return placeholder;
      });
    }
    function resolvePassiveName(id) {
      const key = String(id);
      if (passiveNameCache.has(key)) return passiveNameCache.get(key);
      if (resolvingPassiveNames.has(key)) return String(passiveNames?.[key] || "");
      resolvingPassiveNames.add(key);
      const expanded = expandBrybryParts(passiveNames?.[key], "PassiveSkillNameParts", passiveNameParts, (part, partId) => part.replace(/\[Name:PassiveSkillNameDigit \]/gi, String(Math.max(0, Number(key) - Number(partId)))));
      const resolved = resolvePlaceholders(key, expanded);
      resolvingPassiveNames.delete(key);
      passiveNameCache.set(key, resolved);
      return resolved;
    }
    function resolvePassiveDescription(id) {
      const key = String(id);
      const expanded = expandBrybryParts(passiveDescriptions?.[key], "PassiveSkillDescriptionPartsIdTag", passiveDescriptionParts);
      return resolvePlaceholders(key, expanded);
    }
    function resolveMoveDescription(id) {
      const key = String(id);
      const expanded = expandBrybryParts(moveDescriptions?.[key], "MoveDescriptionPartsIdTag", moveDescriptionParts);
      return resolvePlaceholders(key, expanded);
    }
    return { resolveMoveDescription, resolvePassiveDescription, resolvePassiveName, resolvePlaceholders };
  }
  const FIXED_POWER_MULTIPLIER_FAMILIES = /* @__PURE__ */ new Set([
    130101,
    130102,
    130103,
    130104,
    130106,
    130107,
    130109,
    130111,
    130112,
    130113,
    130114,
    130115,
    130116,
    130117,
    130121,
    130125,
    130126,
    130143,
    130144,
    130151,
    130154,
    130171,
    130118,
    130122,
    130127,
    130128,
    130137,
    130148,
    130158,
    130160,
    130161,
    130162,
    130163,
    130164,
    130165,
    130168,
    130169,
    130170,
    130173,
    130174,
    130175,
    130177,
    130178,
    130180,
    130181,
    130182,
    130183,
    130184,
    130185,
    130188,
    130194,
    130197,
    130198,
    130199,
    130801,
    130802,
    130803,
    130804,
    130806,
    130807,
    130808,
    130809,
    130810,
    130814,
    130815,
    130819,
    130820,
    130822,
    130824,
    130828,
    130835,
    130837,
    130842,
    130843,
    130845,
    130848,
    130849,
    130852,
    130856,
    160103,
    160104,
    160108,
    160109,
    160110,
    160111,
    160112,
    160117,
    160118,
    160120,
    160121,
    160123,
    160126,
    160129,
    160130,
    160131,
    160132,
    160133,
    160134,
    160135,
    160140,
    160141,
    160143,
    160145,
    160146,
    160147,
    160148,
    160149,
    160150,
    160152,
    160154,
    160155,
    160156,
    160157,
    160158,
    160159,
    160160,
    160161,
    160162,
    160163,
    160164,
    160165,
    160167,
    160168,
    160169,
    160170,
    160171,
    160173,
    160174,
    160175,
    160176,
    160177,
    160178,
    160179,
    160180,
    160181,
    160182,
    160183,
    160186,
    160187,
    160193,
    160194,
    160197,
    160198,
    160199,
    160302,
    160305,
    160307,
    160308,
    160313,
    160315,
    160316,
    160318
  ]);
  const HIGH_HP_POWER_MULTIPLIER_FAMILIES = /* @__PURE__ */ new Set([130110]);
  const LOW_HP_POWER_MULTIPLIER_FAMILIES = /* @__PURE__ */ new Set([130136]);
  const MOVE_GAUGE_POWER_MULTIPLIER_FAMILIES = /* @__PURE__ */ new Set([130105]);
  const EXACT_POWER_MULTIPLIERS = /* @__PURE__ */ new Map([
    [13085301, { kind: "fixed", value: 100 }],
    [13085001, { kind: "cap", value: 30 }],
    [16013701, { kind: "cap", value: 100 }]
  ]);
  const SINGLE_STAT_SYNC_MULTIPLIERS = /* @__PURE__ */ new Set([
    16010501,
    16010601,
    16010701,
    16011301,
    16011501,
    16011601,
    16012201,
    16012501,
    16012801,
    16013601,
    16013801,
    16013901,
    16014401
  ]);
  const MULTI_STAT_SYNC_MULTIPLIERS = /* @__PURE__ */ new Set([16012401, 16014201]);
  const SINGLE_STAT_MOVE_MULTIPLIERS = /* @__PURE__ */ new Set([
    13011901,
    13012301,
    13012401,
    13013001,
    13013101,
    13013201,
    13013301,
    13013401,
    13013501,
    13013801,
    13013901,
    13014001,
    13014101,
    13014901
  ]);
  const TWO_STAT_MOVE_MULTIPLIERS = /* @__PURE__ */ new Set([13016701]);
  const MULTI_STAT_MOVE_MULTIPLIERS = /* @__PURE__ */ new Set([13014201, 13015701]);
  function powerMultiplierForPassiveId(passiveId) {
    const id = Number(passiveId);
    if (!Number.isFinite(id) || id <= 0) return null;
    const exact = EXACT_POWER_MULTIPLIERS.get(id);
    if (exact) return { ...exact };
    const family = Math.floor(id / 100);
    if (FIXED_POWER_MULTIPLIER_FAMILIES.has(family)) {
      const level = id % 10;
      return level > 0 ? { kind: "fixed", value: level * 10 } : null;
    }
    if (HIGH_HP_POWER_MULTIPLIER_FAMILIES.has(family)) {
      const level = id % 10;
      return level > 0 ? { kind: "cap", value: level * 10 } : null;
    }
    if (LOW_HP_POWER_MULTIPLIER_FAMILIES.has(family)) {
      const level = id % 10;
      return level > 0 ? { kind: "cap", value: level * 5 } : null;
    }
    if (MOVE_GAUGE_POWER_MULTIPLIER_FAMILIES.has(family)) {
      const level = id % 10;
      return level > 0 ? { kind: "cap", value: level * 6 } : null;
    }
    if (SINGLE_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: "cap", value: 100 };
    if (MULTI_STAT_SYNC_MULTIPLIERS.has(id)) return { kind: "cap", value: 120 };
    if (SINGLE_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: "cap", value: 30 };
    if (TWO_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: "cap", value: 60 };
    if (MULTI_STAT_MOVE_MULTIPLIERS.has(id)) return { kind: "cap", value: 110 };
    return null;
  }
  async function loadCoreData() {
    if (trainerById.size) return;
    const [trainerResponse, scheduleResponse] = await Promise.all([
      fetch(TRAINER_DATA_URL),
      fetch(SCHEDULE_DATA_URL)
    ]);
    if (!trainerResponse.ok) throw new Error(`Unable to load ${TRAINER_DATA_URL} (${trainerResponse.status})`);
    if (!scheduleResponse.ok) throw new Error(`Unable to load ${SCHEDULE_DATA_URL} (${scheduleResponse.status})`);
    const [trainers, schedules] = await Promise.all([trainerResponse.json(), scheduleResponse.json()]);
    trainerById = new Map((trainers.entries || []).map((trainer) => [String(trainer.trainerId), trainer]));
    releaseDateByScheduleId = new Map((schedules.entries || []).map((schedule) => [
      String(schedule.scheduleId),
      Number(schedule.startDate) || 0
    ]));
  }
  function addSkillEntry(index, trainerId, passiveId, availableDate = 0) {
    const id = Number(passiveId);
    if (!trainerId || !id) return;
    const pairSkills = index.get(String(trainerId)) || /* @__PURE__ */ new Map();
    const existingDate = pairSkills.get(String(id));
    const date = Number(availableDate) || 0;
    if (existingDate === void 0 || date < existingDate) pairSkills.set(String(id), date);
    index.set(String(trainerId), pairSkills);
  }
  function addMoveEntry(index, trainerId, moveId, availableDate = 0) {
    const id = Number(moveId);
    if (!trainerId || id <= 0) return;
    const pairMoves = index.get(String(trainerId)) || /* @__PURE__ */ new Map();
    const existingDate = pairMoves.get(String(id));
    const date = Number(availableDate) || 0;
    if (existingDate === void 0 || date < existingDate) pairMoves.set(String(id), date);
    index.set(String(trainerId), pairMoves);
  }
  function buildPairSkillIndex(trainers, monsterVariations, abilityPanels, abilityById, superawakenings) {
    const index = /* @__PURE__ */ new Map();
    const syncCountdownIndex = /* @__PURE__ */ new Map();
    const moveIndex = /* @__PURE__ */ new Map();
    const theoreticalMoveIndex = /* @__PURE__ */ new Map();
    const moveEntryIndex = /* @__PURE__ */ new Map();
    const variationsByMonsterId = /* @__PURE__ */ new Map();
    (monsterVariations.entries || []).forEach((variation) => {
      const variations = variationsByMonsterId.get(String(variation.monsterId)) || [];
      variations.push(variation);
      variationsByMonsterId.set(String(variation.monsterId), variations);
    });
    (trainers.entries || []).forEach((trainer) => {
      const trainerMoves = new Set([1, 2, 3, 4].map((slot) => Number(trainer[`move${slot}Id`])).filter((id) => id > 0));
      trainerMoves.forEach((moveId) => addMoveEntry(moveEntryIndex, trainer.trainerId, moveId));
      [1, 2, 3, 4, 5].forEach((slot) => {
        addSkillEntry(index, trainer.trainerId, trainer[`passive${slot}Id`]);
        addSkillEntry(syncCountdownIndex, trainer.trainerId, trainer[`passive${slot}Id`]);
      });
      const monster = monsterById.get(String(trainer.monsterId));
      [monster?.syncMoveId, monster?.move1ChangeId, monster?.move2ChangeId, monster?.move3ChangeId, monster?.move4ChangeId].map(Number).filter((id) => id > 0).forEach((id) => {
        trainerMoves.add(id);
        addMoveEntry(moveEntryIndex, trainer.trainerId, id);
      });
      const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
      addSkillEntry(index, trainer.trainerId, monsterBase?.formPassiveId);
      addSkillEntry(syncCountdownIndex, trainer.trainerId, monsterBase?.formPassiveId);
      theoreticalMoveIndex.set(String(trainer.trainerId), new Set([...trainerMoves].filter((id) => id > 0).map(String)));
      (variationsByMonsterId.get(String(trainer.monsterId)) || []).forEach((variation) => {
        const availableDate = releaseDateByScheduleId.get(String(variation.scheduleId)) || 0;
        [1, 2, 3, 4, 5].forEach((slot) => {
          addSkillEntry(index, trainer.trainerId, variation[`passive${slot}Id`], availableDate);
          addSkillEntry(syncCountdownIndex, trainer.trainerId, variation[`passive${slot}Id`], availableDate);
        });
        [1, 2, 3, 4].forEach((slot) => {
          const moveId = Number(variation[`move${slot}Id`]);
          trainerMoves.add(moveId);
          addMoveEntry(moveEntryIndex, trainer.trainerId, moveId, availableDate);
          if (moveId > 0) theoreticalMoveIndex.get(String(trainer.trainerId))?.add(String(moveId));
        });
        [
          variation.syncMoveId,
          variation.moveDynamax1Id,
          variation.moveDynamax2Id,
          variation.moveDynamax3Id,
          variation.moveDynamax4Id,
          variation.terastalMoveId
        ].map(Number).filter((id) => id > 0).forEach((id) => {
          trainerMoves.add(id);
          addMoveEntry(moveEntryIndex, trainer.trainerId, id, availableDate);
          theoreticalMoveIndex.get(String(trainer.trainerId))?.add(String(id));
        });
      });
      moveIndex.set(String(trainer.trainerId), new Set([...trainerMoves].filter((id) => id > 0).map(String)));
    });
    (abilityPanels.entries || []).forEach((panel) => {
      const ability = abilityById.get(String(panel.abilityId));
      const availableDate = releaseDateByScheduleId.get(String(panel.scheduleId)) || 0;
      addSkillEntry(index, panel.trainerId, ability?.passiveId, availableDate);
      addSkillEntry(syncCountdownIndex, panel.trainerId, ability?.passiveId, availableDate);
    });
    (superawakenings.entries || []).forEach((entry) => {
      const availableDate = releaseDateByScheduleId.get(String(entry.scheduleId)) || 0;
      addSkillEntry(index, entry.trainerId, entry.passiveSkillId, availableDate);
      addSkillEntry(syncCountdownIndex, entry.trainerId, entry.passiveSkillId, availableDate);
    });
    skillEntriesByTrainerId = index;
    syncCountdownSkillEntriesByTrainerId = syncCountdownIndex;
    moveIdsByTrainerId = moveIndex;
    moveEntriesByTrainerId = moveEntryIndex;
    theoreticalMoveIdsByTrainerId = theoreticalMoveIndex;
    passiveSkillSearchCache.clear();
    pairSkillSearchCache.clear();
    pairMoveSearchCache.clear();
    pairSkillSearchDocumentsCache.clear();
    pairMoveSearchDocumentsCache.clear();
    passiveSkillDetailCache.clear();
    pairSkillIdCache.clear();
    pairSkillCategoryMatchCache.clear();
    pairSyncCountdownReductionCache.clear();
    pairListCacheKey = "";
  }
  function pairDamagingMoveTypes(pairId) {
    const result = /* @__PURE__ */ new Set();
    const now = Date.now() / 1e3;
    moveEntriesByTrainerId.get(String(pairId))?.forEach((availableDate, moveId) => {
      if (spoilerProtectionEnabled && availableDate > now) return;
      const move = moveById.get(String(moveId));
      if (!move || move.group === "Sync" || !["Physical", "Special"].includes(move.category) || Number(move.power) <= 0) return;
      if (Number(move.type) > 0) result.add(String(move.type));
    });
    return result;
  }
  async function loadLocalizedSkillSearchData(resolvedLocale) {
    if (passiveSkillTextDataByLocale.has(resolvedLocale) && moveTextDataByLocale.has(resolvedLocale)) return;
    if (!skillTemplateParameterLoadPromise) {
      skillTemplateParameterLoadPromise = fetch(SKILL_TEMPLATE_PARAMETER_DATA_URL).then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${SKILL_TEMPLATE_PARAMETER_DATA_URL} (${response.status})`);
        return response.json();
      }).then((data) => {
        skillTemplateParametersById = new Map((data.entries || []).map((entry) => [String(entry.id), entry]));
      });
    }
    await skillTemplateParameterLoadPromise;
    const sources = PASSIVE_SKILL_SEARCH_URLS[resolvedLocale];
    const keys = ["names", "nameParts", "descriptions", "descriptionParts"];
    const responses = await Promise.all(keys.map((key) => fetch(sources[key])));
    responses.forEach((response, index) => {
      if (!response.ok) throw new Error(`Unable to load ${sources[keys[index]]} (${response.status})`);
    });
    const values = await Promise.all(responses.map((response) => response.json()));
    const passiveData = Object.fromEntries(keys.map((key, index) => [key, values[index]]));
    const moveSources = MOVE_DESCRIPTION_URLS[resolvedLocale];
    const moveKeys = ["descriptions", "descriptionParts"];
    const moveResponses = await Promise.all(moveKeys.map((key) => fetch(moveSources[key])));
    moveResponses.forEach((response, index) => {
      if (!response.ok) throw new Error(`Unable to load ${moveSources[moveKeys[index]]} (${response.status})`);
    });
    const moveValues = await Promise.all(moveResponses.map((response) => response.json()));
    const moveData = Object.fromEntries(moveKeys.map((key, index) => [key, moveValues[index]]));
    const templateSources = SKILL_TEMPLATE_LOCALE_URLS[resolvedLocale];
    const [numbersResponse, referencedMessagesResponse] = await Promise.all([
      fetch(templateSources.numbers),
      fetch(templateSources.referencedMessages)
    ]);
    if (!numbersResponse.ok) throw new Error(`Unable to load ${templateSources.numbers} (${numbersResponse.status})`);
    if (!referencedMessagesResponse.ok) throw new Error(`Unable to load ${templateSources.referencedMessages} (${referencedMessagesResponse.status})`);
    const [numbers, referencedMessages] = await Promise.all([numbersResponse.json(), referencedMessagesResponse.json()]);
    const resolver = createBrybryTemplateResolver({
      parametersById: skillTemplateParametersById,
      numbers,
      referencedMessages,
      moveNames: moveNameByLocale[resolvedLocale],
      passiveNames: passiveData.names,
      passiveNameParts: passiveData.nameParts,
      moveDescriptions: moveData.descriptions,
      moveDescriptionParts: moveData.descriptionParts,
      passiveDescriptions: passiveData.descriptions,
      passiveDescriptionParts: passiveData.descriptionParts
    });
    passiveData.resolver = resolver;
    moveData.resolver = resolver;
    passiveSkillTextDataByLocale.set(resolvedLocale, passiveData);
    moveTextDataByLocale.set(resolvedLocale, moveData);
    skillTemplateResolverByLocale.set(resolvedLocale, resolver);
    passiveSkillSearchCache.clear();
    pairSkillSearchCache.clear();
    pairMoveSearchCache.clear();
    pairSkillSearchDocumentsCache.clear();
    pairMoveSearchDocumentsCache.clear();
    passiveSkillDetailCache.clear();
    pairSkillCategoryMatchCache.clear();
    pairSyncCountdownReductionCache.clear();
  }
  async function loadPassiveSkillSearchData(locale) {
    const resolvedLocale = PASSIVE_SKILL_SEARCH_URLS[locale] ? locale : "en";
    await Promise.all([
      loadLocalizedSkillSearchData(resolvedLocale),
      resolvedLocale === "en" ? Promise.resolve() : loadLocalizedSkillSearchData("en")
    ]);
  }
  async function loadTrainerData() {
    await loadCoreData();
    if (monsterById.size) return;
    const activeLocale = language();
    const localeKeys = activeLocale === "en" ? ["en"] : [activeLocale, "en"];
    const responses = await Promise.all([
      fetch(MONSTER_DATA_URL),
      fetch(MOVE_DATA_URL),
      fetch(MONSTER_BASE_DATA_URL),
      fetch(MONSTER_VARIATION_DATA_URL),
      fetch(TRAINER_BASE_DATA_URL),
      fetch(TEAM_SKILL_DATA_URL),
      fetch(TRAINER_EX_ROLE_DATA_URL),
      fetch(SUPERAWAKENING_DATA_URL),
      fetch(ABILITY_PANEL_DATA_URL),
      fetch(ABILITY_DATA_URL),
      fetch(PASSIVE_SKILL_CHILD_DATA_URL),
      ...localeKeys.map((locale) => fetch(TEAM_SKILL_TAG_URLS[locale])),
      ...localeKeys.map((locale) => fetch(MOVE_NAME_URLS[locale]))
    ]);
    const urls = [
      MONSTER_DATA_URL,
      MOVE_DATA_URL,
      MONSTER_BASE_DATA_URL,
      MONSTER_VARIATION_DATA_URL,
      TRAINER_BASE_DATA_URL,
      TEAM_SKILL_DATA_URL,
      TRAINER_EX_ROLE_DATA_URL,
      SUPERAWAKENING_DATA_URL,
      ABILITY_PANEL_DATA_URL,
      ABILITY_DATA_URL,
      PASSIVE_SKILL_CHILD_DATA_URL,
      ...localeKeys.map((locale) => TEAM_SKILL_TAG_URLS[locale]),
      ...localeKeys.map((locale) => MOVE_NAME_URLS[locale])
    ];
    responses.forEach((response, index) => {
      if (!response.ok) throw new Error(`Unable to load ${urls[index]} (${response.status})`);
    });
    const values = await Promise.all(responses.map((response) => response.json()));
    const [
      monsters,
      moves,
      monsterBases,
      monsterVariations,
      trainerBases,
      teamSkills,
      exRoles,
      superawakenings,
      abilityPanels,
      abilities,
      passiveSkillChildren
    ] = values;
    const localizedTags = values.slice(11, 11 + localeKeys.length);
    const localizedMoveNames = values.slice(11 + localeKeys.length, 11 + localeKeys.length * 2);
    monsterById = new Map((monsters.entries || []).map((monster) => [String(monster.monsterId), monster]));
    moveById = new Map((moves.entries || []).map((move) => [String(move.moveId), move]));
    monsterBaseById = new Map((monsterBases.entries || []).map((monster) => [String(monster.monsterBaseId), monster]));
    trainerBaseById = new Map((trainerBases.entries || []).map((trainer) => [String(trainer.id), trainer]));
    pokemonNumberByBaseId = new Map((monsterBases.entries || []).map((monster) => [String(monster.monsterBaseId), Number(monster.dexNumber) || Number(monster.actorNumber) || 0]));
    teamSkillTagById = new Map((teamSkills.entries || []).filter((skill) => skill.teamSkillPropNum === 1).map((skill) => [String(skill.teamSkillId), String(skill.teamSkillPropValue)]));
    teamSkillNameByLocale = Object.fromEntries(localeKeys.map((locale, index) => [
      locale,
      new Map(Object.entries(localizedTags[index] || {}).map(([id, name]) => [String(id), name]))
    ]));
    moveNameByLocale = Object.fromEntries(localeKeys.map((locale, index) => [
      locale,
      new Map(Object.entries(localizedMoveNames[index] || {}).map(([id, name]) => [String(id), name]))
    ]));
    const abilityById = new Map((abilities.entries || []).map((ability) => [String(ability.abilityId), ability]));
    passiveSkillChildrenById = new Map((passiveSkillChildren.entries || []).map((entry) => [
      String(entry.passiveSkillId),
      (entry.passiveSkillChildIds || []).map(String)
    ]));
    buildPairSkillIndex({ entries: [...trainerById.values()] }, monsterVariations, abilityPanels, abilityById, superawakenings);
    tileAbbreviationByCellId = new Map((abilityPanels.entries || []).flatMap((panel) => {
      const abbreviated = pomaTileAbbreviation(abilityById.get(String(panel.abilityId)), language());
      return abbreviated ? [[String(panel.cellId), abbreviated]] : [];
    }));
    moveInfoByCellId = new Map((abilityPanels.entries || []).flatMap((panel) => {
      const ability = abilityById.get(String(panel.abilityId));
      const moveId = String(ability?.moveId || "");
      const move = moveById.get(moveId);
      if (!ability) return [];
      return [[String(panel.cellId), {
        moveId,
        passiveId: Number(ability.passiveId),
        abilityType: Number(ability.type),
        abilityValue: Number(ability.value),
        movePower: Number(move?.power),
        moveAccuracy: Number(move?.accuracy),
        isSyncPowerBoost: Number(ability.type) === 9 && move?.group === "Sync",
        powerMultiplier: powerMultiplierForPassiveId(ability.passiveId)
      }]];
    }));
    gridUpdateDatesByTrainerId = /* @__PURE__ */ new Map();
    (abilityPanels.entries || []).forEach((panel) => {
      const updateDate = releaseDateByScheduleId.get(String(panel.scheduleId)) || 0;
      if (!updateDate) return;
      const trainerId = String(panel.trainerId);
      const dates = gridUpdateDatesByTrainerId.get(trainerId) || /* @__PURE__ */ new Set();
      dates.add(updateDate);
      gridUpdateDatesByTrainerId.set(trainerId, dates);
    });
    exRoleByTrainerId = new Map((exRoles.entries || []).map((entry) => [String(entry.trainerId), Number(entry.role)]));
    superawakeningTrainerIds = new Set((superawakenings.entries || []).map((entry) => String(entry.trainerId)));
    loadPassiveSkillSearchData(language()).then(() => {
      refreshSkillSearchSuggestions();
      if (document.getElementById("pairSearchModal") && (selectedSkillIds.size || selectedSkillCategories.size || sortCriterion === "sync-countdown-reduction")) queuePairRender();
    }).catch((error) => console.warn("[Brybry Enhancer] Skill search data could not be loaded.", error));
  }
  function normalizeSearchText(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, " ").trim();
  }
  function replaceSkillTemplateParts(value, parts, tagName) {
    let result = String(value || "");
    const pattern = new RegExp(`\\[Name:${tagName} Idx="([^"]+)" \\]`, "gi");
    for (let pass = 0; pass < 8; pass += 1) {
      let changed = false;
      result = result.replace(pattern, (match, id) => {
        if (parts[id] === void 0) return match;
        changed = true;
        return parts[id];
      });
      if (!changed) break;
    }
    return result;
  }
  function resolvedPassiveSkillName(passiveId, data) {
    if (data?.resolver) return data.resolver.resolvePassiveName(passiveId);
    let name = String(data?.names?.[String(passiveId)] || "");
    const partPattern = /\[Name:PassiveSkillNameParts Idx="([^"]+)" \]/i;
    for (let pass = 0; pass < 8; pass += 1) {
      const match = name.match(partPattern);
      if (!match || data.nameParts?.[match[1]] === void 0) break;
      const digit = Math.max(0, Number(passiveId) - Number(match[1]));
      name = name.replace(match[0], data.nameParts[match[1]]).replace(/\[Name:PassiveSkillNameDigit \]/gi, String(digit));
    }
    return name;
  }
  function searchableSkillTemplateText(value, locale, data) {
    let result = replaceSkillTemplateParts(value, data?.descriptionParts || {}, "PassiveSkillDescriptionPartsIdTag");
    result = replaceSkillTemplateParts(result, data?.nameParts || {}, "PassiveSkillNameParts");
    result = result.replace(/\[Name:MoveId Idx="([^"]+)" \]/gi, (match, id) => moveNameByLocale[locale]?.get(String(id)) || "");
    result = result.replace(/\[(?:DE|EN|ES|FR|IT):[^\]]*?\bS="([^"]*)"[^\]]*?\bP="([^"]*)"[^\]]*\]/gi, " $1 $2 ");
    return result.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\[[^\]]+\]/g, " ");
  }
  function passiveSkillSearchText(passiveId, locale) {
    const cacheKey = `${locale}:${passiveId}`;
    if (passiveSkillSearchCache.has(cacheKey)) return passiveSkillSearchCache.get(cacheKey);
    const data = passiveSkillTextDataByLocale.get(locale);
    if (!data) return "";
    const name = resolvedPassiveSkillName(passiveId, data);
    const description = data.resolver?.resolvePassiveDescription(passiveId) || replaceSkillTemplateParts(
      data.descriptions?.[String(passiveId)] || "",
      data.descriptionParts || {},
      "PassiveSkillDescriptionPartsIdTag"
    );
    const pomaAbbreviation = pomaTemplateValue(
      POMATOOLS_SKILL_ABBR[locale]?.[String(Math.floor(Number(passiveId) / 10))],
      passiveId
    );
    const searchText = normalizeSearchText(searchableSkillTemplateText(`${name} ${description} ${pomaAbbreviation}`, locale, data));
    passiveSkillSearchCache.set(cacheKey, searchText);
    return searchText;
  }
  function passiveSkillDetails(passiveId, locale) {
    const cacheKey = `${locale}:${passiveId}`;
    if (passiveSkillDetailCache.has(cacheKey)) return passiveSkillDetailCache.get(cacheKey);
    const data = passiveSkillTextDataByLocale.get(locale);
    if (!data) return null;
    const name = searchableSkillTemplateText(resolvedPassiveSkillName(passiveId, data), locale, data).replace(/\s+/g, " ").trim();
    const descriptionTemplate = data.resolver?.resolvePassiveDescription(passiveId) || replaceSkillTemplateParts(
      data.descriptions?.[String(passiveId)] || "",
      data.descriptionParts || {},
      "PassiveSkillDescriptionPartsIdTag"
    );
    const description = searchableSkillTemplateText(descriptionTemplate, locale, data).replace(/\s+/g, " ").trim();
    const details = name ? {
      id: String(passiveId),
      name,
      description,
      searchText: passiveSkillSearchText(passiveId, locale)
    } : null;
    passiveSkillDetailCache.set(cacheKey, details);
    return details;
  }
  function passiveSkillIdsIncludingChildren(passiveId) {
    const pending = [String(passiveId)];
    const result = [];
    const seen = /* @__PURE__ */ new Set();
    while (pending.length) {
      const id = pending.shift();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push(id);
      pending.push(...passiveSkillChildrenById.get(id) || []);
    }
    return result;
  }
  function pairSkillSearchDocuments(pair, locale, includeChildren = true) {
    const cacheKey = `${locale}:${spoilerProtectionEnabled ? "safe" : "all"}:${includeChildren ? "expanded" : "direct"}:${pair.id}`;
    if (pairSkillSearchDocumentsCache.has(cacheKey)) return pairSkillSearchDocumentsCache.get(cacheKey);
    const entries = skillEntriesByTrainerId.get(pair.id);
    if (!entries) return [];
    const now = Date.now() / 1e3;
    const texts = [];
    entries.forEach((availableDate, passiveId) => {
      if (spoilerProtectionEnabled && availableDate > now) return;
      const searchableIds = includeChildren ? passiveSkillIdsIncludingChildren(passiveId) : [String(passiveId)];
      searchableIds.forEach((id) => {
        const textValue = passiveSkillSearchText(id, locale);
        if (textValue) texts.push(textValue);
      });
    });
    pairSkillSearchDocumentsCache.set(cacheKey, texts);
    return texts;
  }
  function pairSkillSearchText(pair, locale) {
    const cacheKey = `${locale}:${spoilerProtectionEnabled ? "safe" : "all"}:${pair.id}`;
    if (pairSkillSearchCache.has(cacheKey)) return pairSkillSearchCache.get(cacheKey);
    const combined = pairSkillSearchDocuments(pair, locale).join(" ");
    pairSkillSearchCache.set(cacheKey, combined);
    return combined;
  }
  function pairMoveSearchDocuments(pair, locale) {
    const cacheKey = `${locale}:${pair.id}`;
    if (pairMoveSearchDocumentsCache.has(cacheKey)) return pairMoveSearchDocumentsCache.get(cacheKey);
    const data = moveTextDataByLocale.get(locale);
    if (!data) return [];
    const documents = [...moveIdsByTrainerId.get(String(pair.id)) || []].map((moveId) => {
      const description = data.resolver?.resolveMoveDescription(moveId) || replaceSkillTemplateParts(
        data.descriptions?.[moveId] || "",
        data.descriptionParts || {},
        "MoveDescriptionPartsIdTag"
      );
      return normalizeSearchText(searchableSkillTemplateText(`${moveNameByLocale[locale]?.get(moveId) || ""} ${description}`, locale, data));
    });
    pairMoveSearchDocumentsCache.set(cacheKey, documents);
    return documents;
  }
  function pairMoveSearchText(pair, locale) {
    const cacheKey = `${locale}:${pair.id}`;
    if (pairMoveSearchCache.has(cacheKey)) return pairMoveSearchCache.get(cacheKey);
    const normalized = pairMoveSearchDocuments(pair, locale).join(" ");
    pairMoveSearchCache.set(cacheKey, normalized);
    return normalized;
  }
  function pairSkillIds(pair) {
    const cacheKey = `${spoilerProtectionEnabled ? "safe" : "all"}:${pair.id}`;
    if (pairSkillIdCache.has(cacheKey)) return pairSkillIdCache.get(cacheKey);
    const result = /* @__PURE__ */ new Set();
    const now = Date.now() / 1e3;
    const entries = skillEntriesByTrainerId.get(pair.id);
    entries?.forEach((availableDate, passiveId) => {
      if (spoilerProtectionEnabled && availableDate > now) return;
      passiveSkillIdsIncludingChildren(passiveId).forEach((id) => result.add(String(id)));
    });
    pairSkillIdCache.set(cacheKey, result);
    return result;
  }
  function passiveSyncCountdownReduction(passiveId) {
    const detail = passiveSkillDetails(passiveId, "en");
    if (!detail) return 0;
    return syncCountdownReductionInDescription(detail.description);
  }
  function syncCountdownReductionInDescription(description) {
    const values = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 };
    const text2 = String(description || "");
    const valueOf = (value) => values[String(value).toLowerCase()] || Number(value) || 0;
    const total = (text2.match(/[^.!?]+[.!?]?/g) || []).filter((sentence) => !/\bchance\b/i.test(sentence) && !/\bco-op battle\b/i.test(sentence)).flatMap((sentence) => [...sentence.matchAll(/reduc(?:es|ing)\b[^.!?]*?\b(?:sync move countdown|sync countdown)\s+by\s+(one|two|three|four|five|six|seven|eight|nine|\d+)/gi)]).reduce((sum, match) => sum + valueOf(match[1]), 0);
    const maximum = text2.match(/maximum reduction is\s+(one|two|three|four|five|six|seven|eight|nine|\d+)/i);
    return Math.max(total, valueOf(maximum?.[1]));
  }
  function resolvedMoveDescription(moveId) {
    const data = moveTextDataByLocale.get("en");
    if (!data) return "";
    return data.resolver?.resolveMoveDescription(moveId) || replaceSkillTemplateParts(
      data.descriptions?.[String(moveId)] || "",
      data.descriptionParts || {},
      "MoveDescriptionPartsIdTag"
    );
  }
  function moveSyncCountdownReduction(moveId) {
    return syncCountdownReductionInDescription(resolvedMoveDescription(moveId));
  }
  function moveSyncCountdownReductionUses(moveId, availableUses) {
    const description = resolvedMoveDescription(moveId);
    const replacement = description.match(/replaces the effects of the user[’']s moves with the following when it is in [^.]*form\./i);
    if (!replacement) return availableUses;
    const replacementIndex = replacement.index || 0;
    const beforeReplacement = description.slice(0, replacementIndex);
    const afterReplacement = description.slice(replacementIndex + replacement[0].length);
    if (syncCountdownReductionInDescription(beforeReplacement) > 0 && syncCountdownReductionInDescription(afterReplacement) === 0) return Math.min(availableUses, 1);
    return availableUses;
  }
  function passiveTemplate(passiveId) {
    return POMATOOLS_SKILL_ABBR.ja?.[String(Math.floor(Math.abs(Number(passiveId)) / 10))] || "";
  }
  function passiveRank(passiveId) {
    return Math.abs(Number(passiveId)) % 10;
  }
  function pairTheoreticalMoveUses(pair) {
    const moves = [...theoreticalMoveIdsByTrainerId.get(pair.id) || []].map((moveId) => moveById.get(String(moveId))).filter(Boolean);
    let pokemonStatusUses = moves.filter((move) => move.group === "Regular" && move.user === "Pokemon" && move.category === "Status").reduce((total, move) => total + Number(move.uses || 0), 0);
    let syncroMoveUses = moves.filter((move) => move.group === "Buddy").reduce((total, move) => total + Number(move.uses || 0), 0);
    let syncroMoveRecovery = 0;
    const now = Date.now() / 1e3;
    syncCountdownSkillEntriesByTrainerId.get(pair.id)?.forEach((availableDate, passiveId) => {
      if (spoilerProtectionEnabled && availableDate > now) return;
      const template = passiveTemplate(passiveId);
      if (template.includes("初B技後 P変化技 回数回復")) pokemonStatusUses += passiveRank(passiveId);
      if (template.includes("初B技後 S技 回数回復")) {
        const recovery = passiveRank(passiveId);
        syncroMoveUses += recovery;
        syncroMoveRecovery += recovery;
      }
    });
    return { pokemonStatusUses, syncroMoveUses, syncroMoveRecovery };
  }
  function pairSyncCountdownReduction(pair) {
    const cacheKey = `${spoilerProtectionEnabled ? "safe" : "all"}:${pair.id}`;
    if (pairSyncCountdownReductionCache.has(cacheKey)) return pairSyncCountdownReductionCache.get(cacheKey);
    const now = Date.now() / 1e3;
    let total = Number(pair.trainer.role) === 4 || Number(pair.exRole) === 4 ? 3 : 0;
    const moveUses = pairTheoreticalMoveUses(pair);
    syncCountdownSkillEntriesByTrainerId.get(pair.id)?.forEach((availableDate, passiveId) => {
      if (spoilerProtectionEnabled && availableDate > now) return;
      let uses = 1;
      const template = passiveTemplate(passiveId);
      if (template.includes("P変化技使用時 BC加速")) uses = moveUses.pokemonStatusUses;
      if (template.includes("S技後 BC加速")) uses = moveUses.syncroMoveUses;
      total += passiveSyncCountdownReduction(passiveId) * uses;
    });
    [...theoreticalMoveIdsByTrainerId.get(pair.id) || []].forEach((moveId) => {
      const move = moveById.get(String(moveId));
      if (!move || Number(move.uses) <= 0) return;
      const availableUses = Number(move.uses) + (move.group === "Buddy" ? moveUses.syncroMoveRecovery : 0);
      const uses = moveSyncCountdownReductionUses(moveId, availableUses);
      total += moveSyncCountdownReduction(moveId) * uses;
    });
    pairSyncCountdownReductionCache.set(cacheKey, total);
    return total;
  }
  function pairMatchesSkillCategory(pair, category, locale) {
    const cacheKey = `${spoilerProtectionEnabled ? "safe" : "all"}:${locale}:${pair.id}:${category.value}`;
    if (pairSkillCategoryMatchCache.has(cacheKey)) return pairSkillCategoryMatchCache.get(cacheKey);
    let matches = false;
    if (category.masterPassiveType) {
      const englishData = passiveSkillTextDataByLocale.get("en");
      if (!englishData) return false;
      const kinds = [...pairSkillIds(pair)].map((passiveId) => brybryMasterPassiveKind(passiveId, resolvedPassiveSkillName(passiveId, englishData))).filter(Boolean);
      matches = category.masterPassiveType === "all" ? kinds.length > 0 : kinds.includes(category.masterPassiveType);
      pairSkillCategoryMatchCache.set(cacheKey, matches);
      return matches;
    }
    const categoryLocale = passiveSkillTextDataByLocale.has("en") ? "en" : locale;
    const documents = [...pairSkillSearchDocuments(pair, categoryLocale, false), ...pairMoveSearchDocuments(pair, categoryLocale)];
    const patterns = category.patterns.en || [];
    matches = brybryDocumentsMatchPatterns(documents, patterns);
    pairSkillCategoryMatchCache.set(cacheKey, matches);
    return matches;
  }
  function roleFamily(role) {
    return ROLE_FAMILIES.find((family) => family.roles.includes(Number(role)))?.value || "";
  }
  function roleCombination(baseRole, exRole) {
    const order = ROLE_FAMILIES.map((family) => family.value);
    return [roleFamily(baseRole), roleFamily(exRole)].filter(Boolean).sort((first, second) => order.indexOf(first) - order.indexOf(second)).join("-");
  }
  function pairIconUrl(trainer) {
    const trainerBase = trainerBaseById.get(String(trainer?.trainerBaseId));
    const monster = monsterById.get(String(trainer?.monsterId));
    const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
    if (!trainerBase?.actorId || !monsterBase) return "";
    const trainerUid = trainerBase.actorId === "hero" ? "8000_00" : String(trainerBase.actorId).substring(2, 9);
    const dexNumber = String(monsterBase.dexNumber).padStart(4, "0");
    const actorVariant = String(monsterBase.actorVariant).padStart(2, "0");
    const shinySuffix = monsterBase.isShiny ? "s" : "";
    return new URL(`./data/icons/trainers/${trainerUid}-${dexNumber}_${actorVariant}${shinySuffix}.png`, location.href).href;
  }
  function pairFallbackIconUrls(trainer) {
    const trainerBase = trainerBaseById.get(String(trainer?.trainerBaseId));
    const monster = monsterById.get(String(trainer?.monsterId));
    const monsterBase = monsterBaseById.get(String(monster?.monsterBaseId));
    return [
      trainerBase?.actorId ? new URL(`./data/actor/Trainer/${trainerBase.actorId}/${trainerBase.actorId}_1024.png`, location.href).href : "",
      monsterBase?.actorId ? new URL(`./data/actor/Monster/${monsterBase.actorId}/${monsterBase.actorId}_256.png`, location.href).href : "",
      new URL("./data/icons/trainers/unknown.png", location.href).href
    ].filter(Boolean);
  }
  function typeMark(locale, trainer) {
    const mark = document.createElement("span");
    mark.className = "be-result-type";
    mark.style.setProperty("--be-type-color", TYPE_COLORS[trainer.type - 1] || "#6aafc0");
    mark.textContent = TYPE_NAMES[locale][trainer.type - 1]?.slice(0, locale === "ja" ? 1 : 2) || "?";
    return mark;
  }
  function captureSiteAvatars() {
    if (pairImageById.size) return false;
    const resultList = document.getElementById("pairSearchResults");
    const pairs = currentPairs(true);
    const rows = resultList ? Array.from(resultList.children) : [];
    if (!resultList || rows.length !== pairs.length) return false;
    rows.forEach((row, index) => {
      const src = row.querySelector("img")?.src;
      if (src) pairImageById.set(pairs[index].id, src);
    });
    return pairImageById.size > 0;
  }
  function selectedCount() {
    return selectedTypes.size + selectedMoveTypes.size + selectedRoles.size + selectedWeaknesses.size + selectedRarities.size + selectedAcquisitions.size + selectedExclusivities.size + selectedRegions.size + selectedExRoles.size + selectedRoleCombinations.size + selectedSuperawakening.size + selectedTrainerGroups.size + selectedFashion.size + selectedOther.size + selectedSkillIds.size + selectedSkillCategories.size;
  }
  function exclusionForGroup(group) {
    if (!excludedFilters.has(group)) excludedFilters.set(group, /* @__PURE__ */ new Set());
    return excludedFilters.get(group);
  }
  function excludedCount() {
    return [...excludedFilters.values()].reduce((count, values) => count + values.size, 0) + excludedSkillCategories.size;
  }
  function filterButtonLabel() {
    const included = selectedCount();
    const excluded = excludedCount();
    const summary = [included ? `✓${included}` : "", excluded ? `−${excluded}` : ""].filter(Boolean).join(" ");
    return `${text().filter}${summary ? ` (${summary})` : ""}`;
  }
  function activeFilterEntries() {
    const locale = language();
    const entries = [];
    const chipLabel = (group, value) => Array.from(document.querySelectorAll(".be-chip")).find((chip) => chip.dataset.beGroup === group && chip.dataset.beValue === String(value))?.dataset.beLabel || String(value);
    Object.entries({
      type: selectedTypes,
      moveType: selectedMoveTypes,
      role: selectedRoles,
      weakness: selectedWeaknesses,
      rarity: selectedRarities,
      acquisition: selectedAcquisitions,
      exclusivity: selectedExclusivities,
      region: selectedRegions,
      exRole: selectedExRoles,
      roleCombination: selectedRoleCombinations,
      superawakening: selectedSuperawakening,
      trainerGroup: selectedTrainerGroups,
      fashion: selectedFashion,
      other: selectedOther
    }).forEach(([group, values]) => {
      values.forEach((value) => entries.push({ group, value, state: "include", label: chipLabel(group, value) }));
      excludedFilters.get(group)?.forEach((value) => {
        entries.push({ group, value, state: "exclude", label: chipLabel(group, value) });
      });
    });
    const categoryLabel = (value) => {
      const category = SKILL_FILTER_CATEGORIES.find((candidate) => candidate.value === value);
      return category?.labels[locale] || category?.labels.en || value;
    };
    selectedSkillCategories.forEach((value) => entries.push({
      group: "skillCategory",
      value,
      state: "include",
      label: categoryLabel(value)
    }));
    excludedSkillCategories.forEach((value) => entries.push({
      group: "skillCategory",
      value,
      state: "exclude",
      label: categoryLabel(value)
    }));
    selectedSkillIds.forEach((value) => entries.push({
      group: "skill",
      value,
      state: "include",
      label: passiveSkillDetails(value, locale)?.name || value
    }));
    return entries;
  }
  function removeActiveFilter({ group, value, state }) {
    if (group === "skill") {
      selectedSkillIds.delete(value);
    } else if (group === "skillCategory") {
      (state === "exclude" ? excludedSkillCategories : selectedSkillCategories).delete(value);
    } else {
      (state === "exclude" ? exclusionForGroup(group) : selectionForGroup(group))?.delete(value);
    }
    savePickerPreferences();
    refreshPicker();
  }
  function renderActiveFilterTags() {
    const container = document.querySelector(".be-active-filter-tags");
    if (!container) return;
    const fragment = document.createDocumentFragment();
    const entries = activeFilterEntries();
    const included = entries.filter((entry) => entry.state === "include");
    const excluded = entries.filter((entry) => entry.state === "exclude");
    const appendOperator = (operator) => {
      const node = document.createElement("span");
      node.className = "be-filter-operator";
      node.textContent = operator;
      node.setAttribute("aria-hidden", "true");
      fragment.append(node);
    };
    const appendTag = (entry) => {
      const tag = document.createElement("button");
      tag.className = "be-active-filter-tag";
      tag.type = "button";
      tag.dataset.beFilterState = entry.state;
      tag.setAttribute("aria-label", `${text().clear}: ${entry.state === "exclude" ? `! ${entry.label}` : entry.label}`);
      const label = document.createElement("span");
      label.textContent = `${entry.state === "exclude" ? "! " : ""}${entry.label}`;
      const remove = document.createElement("span");
      remove.className = "be-active-filter-tag-remove";
      remove.setAttribute("aria-hidden", "true");
      remove.textContent = "×";
      tag.append(label, remove);
      tag.addEventListener("click", () => removeActiveFilter(entry));
      fragment.append(tag);
    };
    included.forEach((entry, index) => {
      if (index) appendOperator(filterMatchMode === "and" ? "&" : "|");
      appendTag(entry);
    });
    excluded.forEach((entry, index) => {
      if (included.length || index) appendOperator("&");
      appendTag(entry);
    });
    const clearButton = document.querySelector(".be-clear-button");
    if (clearButton) fragment.append(clearButton);
    container.replaceChildren(fragment);
    container.hidden = !entries.length && (!clearButton || clearButton.hidden);
  }
  function selectionForGroup(group) {
    return {
      type: selectedTypes,
      moveType: selectedMoveTypes,
      role: selectedRoles,
      weakness: selectedWeaknesses,
      rarity: selectedRarities,
      acquisition: selectedAcquisitions,
      exclusivity: selectedExclusivities,
      region: selectedRegions,
      exRole: selectedExRoles,
      roleCombination: selectedRoleCombinations,
      superawakening: selectedSuperawakening,
      trainerGroup: selectedTrainerGroups,
      fashion: selectedFashion,
      other: selectedOther
    }[group];
  }
  function filterState(group, value) {
    if (selectionForGroup(group)?.has(value)) return "include";
    if (exclusionForGroup(group).has(value)) return "exclude";
    return "off";
  }
  function cycleFilterState(group, value) {
    const included = selectionForGroup(group);
    const excluded = exclusionForGroup(group);
    if (!included) return "off";
    if (included.has(value)) {
      included.delete(value);
      excluded.add(value);
      return "exclude";
    }
    if (excluded.has(value)) {
      excluded.delete(value);
      return "off";
    }
    included.add(value);
    return "include";
  }
  function filterTooltip(label, state) {
    const copy = text();
    if (state === "include") return `${label} · ✓ ${copy.include}`;
    if (state === "exclude") return `${label} · − ${copy.exclude}`;
    return label;
  }
  function expandedDirectionLabel(label, locale) {
    const directionWords = {
      en: { "↑": "Increase", "↓": "Decrease" },
      fr: { "↑": "en hausse", "↓": "en baisse" },
      de: { "↑": "erhöht", "↓": "gesenkt" },
      es: { "↑": "aumentado", "↓": "reducido" },
      it: { "↑": "aumentata", "↓": "ridotta" },
      ja: { "↑": "上昇", "↓": "低下" },
      ko: { "↑": "상승", "↓": "하락" },
      zh: { "↑": "上升", "↓": "下降" }
    };
    const words = directionWords[locale] || directionWords.en;
    return label.replace(/[↑↓]/g, (direction) => words[direction]).replace(/\s+/g, " ").trim();
  }
  function updateFilterButtonState(button, state, label) {
    const tooltip = filterTooltip(label, state);
    const needsTooltip = button.matches(".be-chip--icon-only, .be-skill-category-chip--icon-only, .be-skill-category-chip--compact-label, .be-skill-category-chip--has-note");
    button.dataset.beFilterState = state;
    if (needsTooltip) button.dataset.beTooltip = tooltip;
    else delete button.dataset.beTooltip;
    button.removeAttribute("title");
    button.setAttribute("aria-pressed", state === "exclude" ? "mixed" : String(state === "include"));
    button.setAttribute("aria-label", tooltip);
    const marker = button.querySelector(".be-filter-state-mark");
    if (marker) marker.textContent = state === "include" ? "✓" : state === "exclude" ? "−" : "";
  }
  function filterTooltipElement() {
    let tooltip = document.getElementById("beFilterTooltip");
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.id = "beFilterTooltip";
    tooltip.className = "be-floating-filter-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    document.body.append(tooltip);
    return tooltip;
  }
  function showFilterTooltip(button) {
    const copy = button?.dataset.beTooltip;
    if (!copy) return;
    const tooltip = filterTooltipElement();
    tooltip.textContent = copy;
    tooltip.hidden = false;
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const modalRect = document.querySelector("#pairSearchModal .modal-content")?.getBoundingClientRect();
    const margin = 8;
    const minLeft = Math.max(margin, (modalRect?.left || 0) + margin);
    const maxRight = Math.min(window.innerWidth - margin, (modalRect?.right || window.innerWidth) - margin);
    const preferredLeft = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
    tooltip.style.left = `${Math.max(minLeft, Math.min(preferredLeft, maxRight - tooltipRect.width))}px`;
    const below = buttonRect.bottom + 7;
    const modalBottom = Math.min(window.innerHeight - margin, (modalRect?.bottom || window.innerHeight) - margin);
    tooltip.style.top = `${below + tooltipRect.height <= modalBottom ? below : Math.max(margin, buttonRect.top - tooltipRect.height - 7)}px`;
  }
  function hideFilterTooltip() {
    const tooltip = document.getElementById("beFilterTooltip");
    if (tooltip) tooltip.hidden = true;
  }
  function pairTooltipElement() {
    let tooltip = document.getElementById("bePairTooltip");
    if (tooltip) return tooltip;
    tooltip = document.createElement("div");
    tooltip.id = "bePairTooltip";
    tooltip.className = "be-floating-pair-tooltip";
    tooltip.setAttribute("role", "tooltip");
    tooltip.hidden = true;
    document.body.append(tooltip);
    return tooltip;
  }
  function pairSortMetadata(pair, locale) {
    const copy = text();
    const dateValue = (timestamp) => timestamp > 0 ? new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(timestamp * 1e3)) : "—";
    if (sortCriterion === "updated") return `${copy.sortUpdated}: ${dateValue(pair.updateDate)}`;
    if (sortCriterion === "release") return `${copy.sortRelease}: ${dateValue(pair.releaseDate)}`;
    if (sortCriterion === "sync-dex") return `${copy.sortSyncDex}: ${pair.syncDexNumber || "—"}`;
    if (sortCriterion === "pokemon-dex") return `${copy.sortPokemonDex}: ${pair.pokemonNumber || "—"}`;
    if (sortCriterion === "sync-countdown-reduction") return `${copy.sortSyncCountdownReduction}: ${pairSyncCountdownReduction(pair)}`;
    return "";
  }
  function showPairTooltip(row) {
    if (!row) return;
    const tooltip = pairTooltipElement();
    tooltip.replaceChildren();
    ["pair-stars", "pair-name"].forEach((className) => {
      const source = row.querySelector(`.${className}`);
      if (!source) return;
      const line = document.createElement("span");
      line.className = className;
      line.textContent = source.textContent;
      tooltip.append(line);
    });
    const sortMetadata = row.querySelector(".be-pair-sort-meta");
    if (sortMetadata) {
      const line = document.createElement("span");
      line.className = "be-pair-meta";
      line.textContent = sortMetadata.textContent;
      tooltip.append(line);
    }
    tooltip.hidden = false;
    const rowRect = row.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const modalRect = document.querySelector("#pairSearchModal .modal-content")?.getBoundingClientRect();
    const margin = 8;
    const minLeft = Math.max(margin, (modalRect?.left || 0) + margin);
    const maxRight = Math.min(window.innerWidth - margin, (modalRect?.right || window.innerWidth) - margin);
    const rightSide = rowRect.right + 8;
    tooltip.style.left = `${rightSide + tooltipRect.width <= maxRight ? rightSide : Math.max(minLeft, rowRect.left - tooltipRect.width - 8)}px`;
    const minTop = Math.max(margin, (modalRect?.top || 0) + margin);
    const maxBottom = Math.min(window.innerHeight - margin, (modalRect?.bottom || window.innerHeight) - margin);
    tooltip.style.top = `${Math.max(minTop, Math.min(rowRect.top, maxBottom - tooltipRect.height))}px`;
  }
  function hidePairTooltip() {
    const tooltip = document.getElementById("bePairTooltip");
    if (tooltip) tooltip.hidden = true;
  }
  function bindPairTooltips(resultList) {
    if (resultList.dataset.bePairTooltipsBound === "true") return;
    resultList.dataset.bePairTooltipsBound = "true";
    const pairRow = (target) => target.closest?.(".be-pair-result");
    resultList.addEventListener("pointerover", (event) => showPairTooltip(pairRow(event.target)));
    resultList.addEventListener("pointerout", (event) => {
      const row = pairRow(event.target);
      if (!row || row.contains(event.relatedTarget)) return;
      hidePairTooltip();
    });
    resultList.addEventListener("focusin", (event) => showPairTooltip(pairRow(event.target)));
    resultList.addEventListener("focusout", hidePairTooltip);
    resultList.addEventListener("scroll", hidePairTooltip, { passive: true });
  }
  function bindFilterTooltips(panel) {
    const tooltipButton = (target) => target.closest?.(".be-chip, .be-skill-category-chip, .be-filter-anchor, .be-sort-direction, .be-view-button");
    panel.addEventListener("pointerover", (event) => showFilterTooltip(tooltipButton(event.target)));
    panel.addEventListener("pointerout", (event) => {
      const button = tooltipButton(event.target);
      if (!button || button.contains(event.relatedTarget)) return;
      hideFilterTooltip();
    });
    panel.addEventListener("focusin", (event) => showFilterTooltip(tooltipButton(event.target)));
    panel.addEventListener("focusout", hideFilterTooltip);
  }
  function currentPairs(includeUnreleased = false) {
    const select = document.getElementById("syncPairSelect");
    if (!select) return [];
    const firstOption = select.options[0];
    const lastOption = select.options[select.options.length - 1];
    const cacheKey = [
      language(),
      spoilerProtectionEnabled ? "safe" : "all",
      select.options.length,
      firstOption?.value || "",
      lastOption?.value || ""
    ].join(":");
    if (pairListCacheKey !== cacheKey) {
      pairListCacheKey = cacheKey;
      pairListCache = Array.from(select.options).map((option) => {
        const trainer = trainerById.get(String(option.value));
        const monster = monsterById.get(String(trainer?.monsterId));
        const teamSkillTags = [1, 2, 3, 4, 5].map((index) => teamSkillTagById.get(String(trainer?.[`teamSkill${index}Id`]))).filter(Boolean);
        const region = teamSkillTags.find((tag) => tag.startsWith("200200")) || "";
        const exRole = exRoleByTrainerId.has(String(option.value)) ? exRoleByTrainerId.get(String(option.value)) : null;
        const releaseDate = releaseDateByScheduleId.get(String(trainer?.scheduleId)) || 0;
        const now = Date.now() / 1e3;
        const gridUpdateDates = [...gridUpdateDatesByTrainerId.get(String(option.value)) || []].filter((date) => !spoilerProtectionEnabled || date <= now);
        return {
          id: String(option.value),
          name: option.textContent.trim(),
          trainer,
          releaseDate,
          updateDate: Math.max(releaseDate, ...gridUpdateDates),
          syncDexNumber: Number(trainer?.number) || 0,
          pokemonNumber: pokemonNumberByBaseId.get(String(monster?.monsterBaseId)) || 0,
          region,
          teamSkillTags,
          moveTypes: pairDamagingMoveTypes(option.value),
          iconUrl: pairIconUrl(trainer),
          fallbackIconUrls: pairFallbackIconUrls(trainer),
          exRole,
          exRoleFamily: exRole === null ? "" : roleFamily(exRole),
          roleCombination: exRole === null ? "" : roleCombination(trainer?.role, exRole),
          hasSuperawakening: superawakeningTrainerIds.has(String(option.value))
        };
      }).filter((pair) => pair.trainer);
    }
    return includeUnreleased || !spoilerProtectionEnabled ? pairListCache : pairListCache.filter((pair) => pair.releaseDate <= Date.now() / 1e3);
  }
  function pairMatches(pair, query, locale = language()) {
    const matchesQuery = normalizeSearchText(pair.name).includes(normalizeSearchText(query));
    const skillIds = selectedSkillIds.size ? pairSkillIds(pair) : null;
    const scalarValues = [
      [selectedTypes, String(pair.trainer.type)],
      [selectedRoles, String(pair.trainer.role)],
      [selectedWeaknesses, String(pair.trainer.weakness)],
      [selectedRarities, String(pair.trainer.rarity)],
      [selectedAcquisitions, String(pair.trainer.scoutMethod)],
      [selectedExclusivities, pair.trainer.scoutMethod === 1 ? String(pair.trainer.exclusivity) : ""],
      [selectedRegions, pair.region],
      [selectedExRoles, pair.exRoleFamily],
      [selectedRoleCombinations, pair.roleCombination],
      [selectedSuperawakening, pair.hasSuperawakening ? "yes" : ""]
    ];
    const tagValues = [
      [selectedMoveTypes, pair.moveTypes],
      [selectedTrainerGroups, pair.teamSkillTags],
      [selectedFashion, pair.teamSkillTags],
      [selectedOther, pair.teamSkillTags]
    ];
    const contains = (values, value) => values?.has?.(value) || values?.includes?.(value);
    const includedMatches = [
      ...scalarValues.flatMap(([selected, actual]) => [...selected].map((value) => value === actual)),
      ...tagValues.flatMap(([selected, actual]) => [...selected].map((value) => contains(actual, value))),
      ...[...selectedSkillCategories].map((value) => {
        const category = SKILL_FILTER_CATEGORIES.find((option) => option.value === value);
        return category ? pairMatchesSkillCategory(pair, category, locale) : true;
      }),
      ...[...selectedSkillIds].map((id) => skillIds.has(id))
    ];
    const matchesIncluded = !includedMatches.length || (filterMatchMode === "and" ? includedMatches.every(Boolean) : includedMatches.some(Boolean));
    const matchesExcludedSkillCategories = [...excludedSkillCategories].every((value) => {
      const category = SKILL_FILTER_CATEGORIES.find((option) => option.value === value);
      return category ? !pairMatchesSkillCategory(pair, category, locale) : true;
    });
    const matchesExcludedScalars = [
      ["type", String(pair.trainer.type)],
      ["role", String(pair.trainer.role)],
      ["weakness", String(pair.trainer.weakness)],
      ["rarity", String(pair.trainer.rarity)],
      ["acquisition", String(pair.trainer.scoutMethod)],
      ["exclusivity", pair.trainer.scoutMethod === 1 ? String(pair.trainer.exclusivity) : ""],
      ["region", pair.region],
      ["exRole", pair.exRoleFamily],
      ["roleCombination", pair.roleCombination],
      ["superawakening", pair.hasSuperawakening ? "yes" : ""]
    ].every(([group, actual]) => !exclusionForGroup(group).has(actual));
    const matchesExcludedTags = [
      ["moveType", pair.moveTypes],
      ["trainerGroup", pair.teamSkillTags],
      ["fashion", pair.teamSkillTags],
      ["other", pair.teamSkillTags]
    ].every(([group, actual]) => ![...actual].some((value) => exclusionForGroup(group).has(value)));
    return matchesQuery && matchesIncluded && matchesExcludedSkillCategories && matchesExcludedScalars && matchesExcludedTags;
  }
  function sortPairs(pairs, locale) {
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
    return [...pairs].sort((first, second) => {
      let difference = 0;
      if (sortCriterion === "updated") difference = first.updateDate - second.updateDate;
      if (sortCriterion === "release") difference = first.releaseDate - second.releaseDate;
      if (sortCriterion === "sync-dex") difference = first.syncDexNumber - second.syncDexNumber;
      if (sortCriterion === "pokemon-dex") difference = first.pokemonNumber - second.pokemonNumber;
      if (sortCriterion === "rarity") difference = (first.trainer.rarity || 0) - (second.trainer.rarity || 0);
      if (sortCriterion === "sync-countdown-reduction") difference = pairSyncCountdownReduction(first) - pairSyncCountdownReduction(second);
      if (sortCriterion === "name") difference = collator.compare(first.name, second.name);
      if (difference) return sortDirection === "asc" ? difference : -difference;
      if (sortCriterion === "updated" && first.releaseDate !== second.releaseDate) {
        const releaseDifference = first.releaseDate - second.releaseDate;
        return sortDirection === "asc" ? releaseDifference : -releaseDifference;
      }
      return collator.compare(first.name, second.name);
    });
  }
  function resultsToolbar() {
    const copy = text();
    const toolbar = document.createElement("div");
    toolbar.className = "be-results-toolbar";
    const sortControl = document.createElement("label");
    sortControl.className = "be-sort-control";
    const sortLabel = document.createElement("span");
    sortLabel.className = "be-sort-label";
    sortLabel.textContent = copy.sort;
    const sortSelect = document.createElement("select");
    sortSelect.className = "be-sort-select";
    sortSelect.setAttribute("aria-label", copy.sort);
    [
      ["updated", copy.sortUpdated],
      ["release", copy.sortRelease],
      ["sync-dex", copy.sortSyncDex],
      ["pokemon-dex", copy.sortPokemonDex],
      ["name", copy.sortName],
      ["rarity", copy.sortRarity],
      ["sync-countdown-reduction", copy.sortSyncCountdownReduction]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      sortSelect.append(option);
    });
    sortSelect.value = sortCriterion;
    sortSelect.addEventListener("change", () => {
      sortCriterion = sortSelect.value;
      savePickerPreferences();
      queuePairRender();
    });
    sortControl.append(sortLabel, sortSelect);
    const directionButton = document.createElement("button");
    directionButton.className = "be-sort-direction";
    directionButton.type = "button";
    directionButton.dataset.direction = sortDirection;
    directionButton.innerHTML = SORT_DIRECTION_ICON;
    const updateDirectionLabel = () => {
      directionButton.dataset.direction = sortDirection;
      const label = sortDirection === "asc" ? copy.ascending : copy.descending;
      directionButton.setAttribute("aria-label", label);
      directionButton.dataset.beTooltip = label;
      directionButton.removeAttribute("title");
    };
    updateDirectionLabel();
    directionButton.addEventListener("click", () => {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
      updateDirectionLabel();
      savePickerPreferences();
      queuePairRender();
    });
    sortControl.append(directionButton);
    const viewToggle = document.createElement("div");
    viewToggle.className = "be-view-toggle";
    viewToggle.setAttribute("role", "group");
    [
      ["list", copy.listView],
      ["icons", copy.iconView]
    ].forEach(([value, label]) => {
      const button = document.createElement("button");
      button.className = "be-view-button";
      button.type = "button";
      button.dataset.beView = value;
      button.setAttribute("aria-label", label);
      button.setAttribute("aria-pressed", String(viewMode === value));
      button.dataset.beTooltip = label;
      button.removeAttribute("title");
      button.innerHTML = VIEW_ICONS[value];
      button.addEventListener("click", () => {
        viewMode = value;
        savePickerPreferences();
        queuePairRender();
      });
      viewToggle.append(button);
    });
    toolbar.append(sortControl, viewToggle);
    return toolbar;
  }
  function createChip({ label, value, group, iconName, iconUrl, iconSrc, iconText, iconNames, textContent, iconOnly = false, detail = false }) {
    const chip = document.createElement("button");
    chip.className = "be-chip";
    if (iconOnly) chip.classList.add("be-chip--icon-only");
    if (detail) chip.classList.add("be-chip--detail");
    chip.type = "button";
    chip.dataset.beGroup = group;
    chip.dataset.beValue = value;
    chip.dataset.beLabel = label;
    (iconNames || (iconName ? [iconName] : [])).forEach((name) => {
      const icon = document.createElement("img");
      icon.className = "be-chip-icon";
      icon.src = `${FILTER_ICON_BASE}${name}.png`;
      icon.alt = "";
      chip.append(icon);
    });
    if (iconSrc) {
      const icon = document.createElement("img");
      icon.className = "be-chip-icon be-role-variant-icon";
      icon.src = iconSrc;
      icon.alt = "";
      chip.append(icon);
    }
    if (iconUrl) {
      const icon = document.createElement("img");
      icon.className = "be-chip-icon be-origin-mark-icon";
      icon.src = iconUrl;
      icon.alt = "";
      icon.addEventListener("error", () => chip.classList.remove("be-chip--icon-only"), { once: true });
      chip.append(icon);
    }
    if (iconText) {
      const icon = document.createElement("span");
      icon.className = "be-chip-symbol";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = iconText;
      chip.append(icon);
    }
    const visibleLabel = document.createElement("span");
    visibleLabel.className = "be-chip-text";
    visibleLabel.textContent = textContent || label;
    chip.append(visibleLabel);
    const marker = document.createElement("span");
    marker.className = "be-filter-state-mark";
    marker.setAttribute("aria-hidden", "true");
    chip.append(marker);
    updateFilterButtonState(chip, filterState(group, value), label);
    return chip;
  }
  function accordionSection(group, title, contentNode, { defaultOpen = false, active = false, iconSrc = "" } = {}) {
    const section = document.createElement("details");
    section.className = "be-filter-section";
    section.dataset.beGroup = group;
    section.open = active || Boolean(selectionForGroup(group)?.size) || Boolean(exclusionForGroup(group).size) || openFilterAccordions.has(group) || defaultOpen && !closedFilterAccordions.has(group);
    const summary = document.createElement("summary");
    summary.className = "be-filter-title be-accordion-trigger";
    const heading = document.createElement("span");
    heading.className = "be-accordion-heading";
    if (iconSrc) {
      const icon = document.createElement("img");
      icon.className = "be-accordion-heading-icon";
      icon.src = iconSrc;
      icon.alt = "";
      heading.append(icon);
    }
    const label = document.createElement("span");
    label.textContent = title;
    heading.append(label);
    const chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chevron.classList.add("be-accordion-chevron");
    chevron.setAttribute("aria-hidden", "true");
    chevron.setAttribute("viewBox", "0 0 24 24");
    chevron.innerHTML = '<path d="m6 9 6 6 6-6"/>';
    summary.append(heading, chevron);
    const content = document.createElement("div");
    content.className = "be-accordion-content";
    content.append(contentNode);
    section.append(summary, content);
    section.addEventListener("toggle", () => {
      if (section.open) {
        openFilterAccordions.add(group);
        closedFilterAccordions.delete(group);
      } else {
        openFilterAccordions.delete(group);
        closedFilterAccordions.add(group);
      }
      savePickerPreferences();
    });
    return section;
  }
  function teamTagOptions(prefix, locale) {
    const usedTags = new Set(currentPairs().flatMap((pair) => pair.teamSkillTags));
    return [...usedTags].filter((tag) => tag.startsWith(prefix)).sort((first, second) => Number(first) - Number(second)).map((value) => ({ value, label: teamSkillNameByLocale[locale].get(value) || value }));
  }
  function availableSkillSuggestions(locale, query, limit = 30) {
    const terms = normalizeSearchText(query).split(" ").filter(Boolean);
    if (!terms.length || !passiveSkillTextDataByLocale.has(locale)) return [];
    const ids = /* @__PURE__ */ new Set();
    currentPairs().forEach((pair) => pairSkillIds(pair).forEach((id) => ids.add(id)));
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" });
    return [...ids].filter((id) => !selectedSkillIds.has(id)).map((id) => passiveSkillDetails(id, locale)).filter(Boolean).filter((skill) => terms.every((term) => skill.searchText.includes(term))).sort((first, second) => {
      const firstName = normalizeSearchText(first.name);
      const secondName = normalizeSearchText(second.name);
      const queryText = normalizeSearchText(query);
      const rank = (skill, name) => {
        if (name === queryText) return 0;
        if (name.startsWith(queryText)) return 1;
        if (name.includes(queryText)) return 2;
        if (normalizeSearchText(skill.description).includes(queryText)) return 3;
        return 4;
      };
      return rank(first, firstName) - rank(second, secondName) || collator.compare(first.name, second.name);
    }).slice(0, limit);
  }
  function refreshSkillSearchSuggestions() {
    const input = document.getElementById("beSkillSearchInput");
    if (input) input.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function createSkillCategoryChip(category, locale) {
    const categoryLabel = category.labels[locale] || category.labels.en;
    const tooltipNote = category.tooltipNotes?.[locale] || category.tooltipNotes?.en;
    const explicitTooltipLabel = category.tooltipLabels?.[locale] || category.tooltipLabels?.en;
    const tooltipLabel = [explicitTooltipLabel || expandedDirectionLabel(categoryLabel, locale), tooltipNote].filter(Boolean).join(" — ");
    const button = document.createElement("button");
    button.className = "be-skill-category-chip";
    if (tooltipNote || explicitTooltipLabel) button.classList.add("be-skill-category-chip--has-note");
    if (category.detailOf) button.classList.add("be-skill-category-chip--detail");
    if (category.compactLabels) button.classList.add("be-skill-category-chip--compact-label");
    if (category.rebuffDirection) button.classList.add("be-skill-category-chip--directional-icon");
    if (category.iconOnly) button.classList.add("be-skill-category-chip--icon-only");
    if (category.exVariant) button.classList.add("be-skill-category-chip--ex-detail");
    if (!category.suppressStatDirection && (category.detailOf === "statUp" || category.detailOf === "statDown")) {
      button.classList.add("be-skill-category-chip--stat-direction");
    }
    button.type = "button";
    button.setAttribute("aria-label", categoryLabel);
    button.dataset.beSkillCategory = category.value;
    if (category.iconName) {
      const icon = document.createElement("img");
      icon.src = `${FILTER_ICON_BASE}${category.iconName}.png`;
      icon.alt = "";
      button.append(icon);
    } else if (category.iconSrc) {
      const icon = document.createElement("img");
      icon.referrerPolicy = "no-referrer";
      icon.src = category.iconSrc;
      icon.alt = "";
      button.append(icon);
    } else if (category.iconSvg) {
      const icon = document.createElement("span");
      icon.className = "be-skill-category-icon";
      icon.innerHTML = category.iconSvg;
      button.append(icon);
    } else if (category.iconSrcs) {
      const icons = document.createElement("span");
      icons.className = "be-skill-category-icon-pair";
      category.iconSrcs.forEach((src) => {
        const icon = document.createElement("img");
        icon.referrerPolicy = "no-referrer";
        icon.src = src;
        icon.alt = "";
        icons.append(icon);
      });
      button.append(icons);
    }
    if (category.exVariant) {
      const exBadge = document.createElement("span");
      exBadge.className = "be-skill-category-ex-badge";
      exBadge.setAttribute("aria-hidden", "true");
      exBadge.textContent = "EX";
      button.append(exBadge);
    }
    if (!category.suppressStatDirection && (category.detailOf === "statUp" || category.detailOf === "statDown")) {
      const direction = document.createElement("span");
      direction.className = "be-stat-direction";
      direction.setAttribute("aria-hidden", "true");
      direction.textContent = category.detailOf === "statUp" ? "↑" : "↓";
      button.append(direction);
    }
    if (category.rebuffDirection || category.attributeDirection) {
      const direction = document.createElement("span");
      direction.className = "be-stat-direction";
      direction.setAttribute("aria-hidden", "true");
      direction.textContent = category.rebuffDirection || category.attributeDirection;
      button.append(direction);
    }
    const label = document.createElement("span");
    label.className = "be-skill-category-label";
    label.textContent = category.compactLabels?.[locale] || category.compactLabels?.en || categoryLabel;
    button.append(label);
    const marker = document.createElement("span");
    marker.className = "be-filter-state-mark";
    marker.setAttribute("aria-hidden", "true");
    button.append(marker);
    const categoryState = () => {
      if (selectedSkillCategories.has(category.value)) return "include";
      if (excludedSkillCategories.has(category.value)) return "exclude";
      return "off";
    };
    updateFilterButtonState(button, categoryState(), tooltipLabel);
    button.addEventListener("click", () => {
      if (selectedSkillCategories.has(category.value)) {
        selectedSkillCategories.delete(category.value);
        excludedSkillCategories.add(category.value);
      } else if (excludedSkillCategories.has(category.value)) {
        excludedSkillCategories.delete(category.value);
      } else {
        selectedSkillCategories.add(category.value);
      }
      updateFilterButtonState(button, categoryState(), tooltipLabel);
      queuePairRender(FILTER_RENDER_DELAY_MS);
    });
    return button;
  }
  function createCircleRegionAnchor(locale) {
    const copy = CIRCLE_REGION_ANCHOR_TRANSLATIONS[locale] || CIRCLE_REGION_ANCHOR_TRANSLATIONS.en;
    const anchor = document.createElement("button");
    anchor.className = "be-filter-anchor";
    anchor.type = "button";
    anchor.textContent = copy.label;
    anchor.dataset.beTooltip = copy.tooltip;
    anchor.setAttribute("aria-label", copy.tooltip);
    anchor.addEventListener("click", () => {
      const regionSection = document.querySelector('details.be-filter-section[data-be-group="region"]');
      if (!regionSection) return;
      regionSection.open = true;
      const summary = regionSection.querySelector(":scope > summary");
      regionSection.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
      summary?.focus({ preventScroll: true });
      regionSection.classList.remove("be-filter-section--jump-target");
      window.requestAnimationFrame(() => regionSection.classList.add("be-filter-section--jump-target"));
      window.setTimeout(() => regionSection.classList.remove("be-filter-section--jump-target"), 1400);
    });
    return anchor;
  }
  function skillSearchField() {
    const locale = language();
    const copy = text();
    const skillSearchSection = document.createElement("section");
    skillSearchSection.className = "be-skill-search-section";
    const skillSearchLabel = document.createElement("label");
    skillSearchLabel.className = "be-filter-title";
    skillSearchLabel.htmlFor = "beSkillSearchInput";
    skillSearchLabel.textContent = copy.skillSearch;
    const combobox = document.createElement("div");
    combobox.className = "be-skill-combobox";
    const tokenField = document.createElement("div");
    tokenField.className = "be-skill-token-field";
    const skillSearchInput = document.createElement("input");
    skillSearchInput.id = "beSkillSearchInput";
    skillSearchInput.className = "be-skill-search-input";
    skillSearchInput.type = "search";
    skillSearchInput.autocomplete = "off";
    skillSearchInput.placeholder = copy.skillSearchPlaceholder;
    skillSearchInput.value = skillSearchQuery;
    skillSearchInput.setAttribute("role", "combobox");
    skillSearchInput.setAttribute("aria-autocomplete", "list");
    skillSearchInput.setAttribute("aria-expanded", "false");
    skillSearchInput.setAttribute("aria-controls", "beSkillSuggestions");
    const suggestions = document.createElement("ul");
    suggestions.id = "beSkillSuggestions";
    suggestions.className = "be-skill-suggestions";
    suggestions.setAttribute("role", "listbox");
    suggestions.hidden = true;
    let activeIndex = -1;
    let suggestionTimer = 0;
    let isComposing = false;
    const renderTokens = () => {
      tokenField.querySelectorAll(".be-skill-token").forEach((token) => token.remove());
      [...selectedSkillIds].forEach((id) => {
        const skill = passiveSkillDetails(id, locale);
        const token = document.createElement("button");
        token.className = "be-skill-token";
        token.type = "button";
        token.title = skill?.description || skill?.name || id;
        token.setAttribute("aria-label", `${copy.removeSkill}: ${skill?.name || id}`);
        const name = document.createElement("span");
        name.textContent = skill?.name || id;
        const remove = document.createElement("span");
        remove.setAttribute("aria-hidden", "true");
        remove.textContent = "×";
        token.append(name, remove);
        token.addEventListener("click", () => {
          selectedSkillIds.delete(id);
          renderTokens();
          renderSuggestions();
          queuePairRender();
          skillSearchInput.focus();
        });
        tokenField.insertBefore(token, skillSearchInput);
      });
    };
    const addSkill = (skill) => {
      if (!skill) return;
      selectedSkillIds.add(String(skill.id));
      skillSearchQuery = "";
      skillSearchInput.value = "";
      renderTokens();
      suggestions.hidden = true;
      skillSearchInput.setAttribute("aria-expanded", "false");
      queuePairRender();
      skillSearchInput.focus();
    };
    const renderSuggestions = () => {
      skillSearchQuery = skillSearchInput.value;
      const options = availableSkillSuggestions(locale, skillSearchQuery);
      suggestions.replaceChildren();
      activeIndex = -1;
      if (!skillSearchQuery.trim()) {
        suggestions.hidden = true;
        skillSearchInput.setAttribute("aria-expanded", "false");
        return;
      }
      if (!options.length) {
        const empty = document.createElement("li");
        empty.className = "be-skill-suggestion-empty";
        empty.textContent = copy.skillNoResults;
        suggestions.append(empty);
      } else {
        options.forEach((skill, index) => {
          const option = document.createElement("li");
          option.className = "be-skill-suggestion";
          option.setAttribute("role", "option");
          option.dataset.index = String(index);
          const name = document.createElement("strong");
          name.textContent = skill.name;
          option.append(name);
          if (skill.description) {
            const description = document.createElement("span");
            description.textContent = skill.description;
            option.append(description);
          }
          option.addEventListener("mousedown", (event) => event.preventDefault());
          option.addEventListener("click", () => addSkill(skill));
          suggestions.append(option);
        });
      }
      suggestions.hidden = false;
      skillSearchInput.setAttribute("aria-expanded", "true");
    };
    const scheduleSuggestions = (delay = 180) => {
      window.clearTimeout(suggestionTimer);
      suggestionTimer = window.setTimeout(() => {
        if (skillSearchInput.isConnected && !isComposing) renderSuggestions();
      }, delay);
    };
    const moveActiveSuggestion = (offset) => {
      const options = [...suggestions.querySelectorAll(".be-skill-suggestion")];
      if (!options.length) return;
      activeIndex = (activeIndex + offset + options.length) % options.length;
      options.forEach((option, index) => {
        const active = index === activeIndex;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-selected", String(active));
      });
      options[activeIndex].scrollIntoView({ block: "nearest" });
    };
    skillSearchInput.addEventListener("input", (event) => {
      event.stopImmediatePropagation();
      if (!isComposing) scheduleSuggestions();
    }, true);
    skillSearchInput.addEventListener("compositionstart", () => {
      isComposing = true;
      window.clearTimeout(suggestionTimer);
    });
    skillSearchInput.addEventListener("compositionend", () => {
      isComposing = false;
      scheduleSuggestions(0);
    });
    skillSearchInput.addEventListener("focus", renderSuggestions);
    skillSearchInput.addEventListener("blur", () => {
      setTimeout(() => {
        suggestions.hidden = true;
        skillSearchInput.setAttribute("aria-expanded", "false");
      }, 100);
    });
    skillSearchInput.addEventListener("keydown", (event) => {
      if (event.isComposing || isComposing || event.keyCode === 229) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveActiveSuggestion(event.key === "ArrowDown" ? 1 : -1);
      }
      if (event.key === "Enter") {
        const options = availableSkillSuggestions(locale, skillSearchInput.value);
        const selected = activeIndex < 0 ? null : options[activeIndex];
        if (selected) {
          event.preventDefault();
          addSkill(selected);
        }
      }
      if (event.key === "Escape") {
        suggestions.hidden = true;
        skillSearchInput.setAttribute("aria-expanded", "false");
      }
    });
    tokenField.append(skillSearchInput);
    combobox.append(tokenField, suggestions);
    renderTokens();
    const categories = document.createElement("div");
    categories.className = "be-skill-category-groups";
    const battleGrid = document.createElement("div");
    battleGrid.className = "be-skill-battle-grid";
    [
      [copy.skillFieldEffects, ["weather", "terrain", "zone", "weatherEx", "terrainEx", "zoneEx", "circle", "alliedField", "opponentField"]],
      [copy.skillStatChanges, ["statUp", "statDown", "statReductionImmunity", "rebuffUp", "rebuff"]],
      [copy.skillConditions, ["status", "interference", "sureHitNext", "statusImmunity", "interferenceImmunity", "criticalHitImmunity"]],
      [SKILL_FILTER_CATEGORIES.find((category) => category.value === "masterPassive")?.labels?.[locale] || "Master Passive", ["masterPassive"]]
    ].forEach(([title, parentValues]) => {
      const row = document.createElement("div");
      row.className = "be-skill-category-row";
      const groupByParent = parentValues[0] === "weather" || parentValues[0] === "statUp" || parentValues[0] === "status";
      if (groupByParent) row.classList.add("be-skill-category-row--grouped");
      SKILL_FILTER_CATEGORIES.filter((category) => parentValues.includes(category.value) && !category.detailOf).sort((first, second) => parentValues.indexOf(first.value) - parentValues.indexOf(second.value)).forEach((category) => {
        if (category.value === "criticalHitImmunity" && parentValues.includes("sureHitNext")) return;
        const categoryRow = groupByParent ? document.createElement("div") : row;
        if (groupByParent) categoryRow.className = "be-skill-category-cluster";
        if (category.value !== "masterPassive") categoryRow.append(createSkillCategoryChip(category, locale));
        if (category.value === "sureHitNext" && parentValues.includes("criticalHitImmunity")) {
          const criticalHitImmunity = SKILL_FILTER_CATEGORIES.find((item) => item.value === "criticalHitImmunity");
          if (criticalHitImmunity) categoryRow.append(createSkillCategoryChip(criticalHitImmunity, locale));
        }
        SKILL_FILTER_CATEGORIES.filter((detail) => detail.detailOf === category.value).forEach((detail) => categoryRow.append(createSkillCategoryChip(detail, locale)));
        if (category.value === "circle") categoryRow.append(createCircleRegionAnchor(locale));
        if (groupByParent) row.append(categoryRow);
      });
      const categoryValues = new Set(SKILL_FILTER_CATEGORIES.filter((category) => parentValues.includes(category.value) || parentValues.includes(category.detailOf)).map((category) => category.value));
      const active = [...categoryValues].some((value) => selectedSkillCategories.has(value) || excludedSkillCategories.has(value));
      battleGrid.append(accordionSection(`skill-${parentValues[0]}`, title, row, { defaultOpen: true, active }));
    });
    categories.append(battleGrid);
    skillSearchSection.append(skillSearchLabel, combobox, categories);
    return skillSearchSection;
  }
  function nameSearchField(input) {
    const section = document.createElement("section");
    section.className = "be-name-search-section";
    const label = document.createElement("label");
    label.className = "be-filter-title";
    label.htmlFor = input.id;
    label.textContent = text().nameSearch;
    input.placeholder = text().nameSearchPlaceholder;
    section.append(label, input);
    return section;
  }
  function filterPanel() {
    const locale = language();
    const panel = document.createElement("form");
    panel.className = "be-filter-panel be-filter-form";
    panel.dataset.open = String(filterIsOpen);
    panel.addEventListener("submit", (event) => event.preventDefault());
    const typeRow = document.createElement("div");
    typeRow.className = "be-chip-row";
    TYPE_NAMES[locale].forEach((name, index) => typeRow.append(createChip({
      label: name,
      value: String(index + 1),
      group: "type",
      iconName: `type_${TYPE_ICON_NAMES[index]}`,
      iconOnly: true
    })));
    const typeSection = accordionSection("type", text().type, typeRow, { defaultOpen: true });
    const roleRow = document.createElement("div");
    roleRow.className = "be-chip-row";
    ROLE_NAMES[locale].forEach((name, index) => roleRow.append(createChip({
      label: name,
      value: String(index),
      group: "role",
      iconName: index < 2 ? null : `role_${ROLE_ICON_NAMES[index]}`,
      iconSrc: index === 0 ? "https://pomatools.github.io/assets/img/battle/ROLE_001P.png" : index === 1 ? "https://pomatools.github.io/assets/img/battle/ROLE_001S.png" : null,
      iconOnly: true
    })));
    const roleSection = accordionSection("role", text().role, roleRow, { defaultOpen: true });
    const exRoleRow = document.createElement("div");
    exRoleRow.className = "be-chip-row";
    ROLE_FAMILIES.filter((family) => family.value !== "multi").forEach((family) => exRoleRow.append(createChip({
      label: family.labels[locale],
      value: family.value,
      group: "exRole",
      iconName: `role_ex_${family.icon}`,
      iconOnly: true
    })));
    const exRoleSection = accordionSection("exRole", text().exRole, exRoleRow, { defaultOpen: true });
    const roleCombinationRow = document.createElement("div");
    roleCombinationRow.className = "be-chip-row";
    const familyOrder = ROLE_FAMILIES.map((family) => family.value);
    const combinations = [...new Set(currentPairs().map((pair) => pair.roleCombination).filter(Boolean))].sort((first, second) => {
      const [firstA, firstB] = first.split("-").map((value) => familyOrder.indexOf(value));
      const [secondA, secondB] = second.split("-").map((value) => familyOrder.indexOf(value));
      return firstA - secondA || firstB - secondB;
    });
    combinations.forEach((combination) => {
      const families = combination.split("-").map((value) => ROLE_FAMILIES.find((family) => family.value === value));
      roleCombinationRow.append(createChip({
        label: families.map((family) => family.labels[locale]).join(" + "),
        value: combination,
        group: "roleCombination",
        iconNames: families.map((family) => `role_${family.icon}`),
        iconOnly: true
      }));
    });
    const roleCombinationSection = accordionSection("roleCombination", text().roleCombination, roleCombinationRow);
    const regionRow = document.createElement("div");
    regionRow.className = "be-chip-row";
    REGION_OPTIONS.forEach((region) => regionRow.append(createChip({
      label: region.labels[locale],
      value: region.value,
      group: "region",
      iconUrl: region.iconUrl,
      iconText: region.iconText
    })));
    const regionSection = accordionSection("region", text().region, regionRow, {
      defaultOpen: true,
      iconSrc: FILTER_SECTION_ICON_URLS.region
    });
    const weaknessRow = document.createElement("div");
    weaknessRow.className = "be-chip-row";
    TYPE_NAMES[locale].forEach((name, index) => weaknessRow.append(createChip({
      label: name,
      value: String(index + 1),
      group: "weakness",
      iconName: `type_${TYPE_ICON_NAMES[index]}`,
      iconOnly: true
    })));
    const weaknessSection = accordionSection("weakness", text().weakness, weaknessRow);
    const moveTypeRow = document.createElement("div");
    moveTypeRow.className = "be-chip-row";
    TYPE_NAMES[locale].forEach((name, index) => moveTypeRow.append(createChip({
      label: name,
      value: String(index + 1),
      group: "moveType",
      iconName: `type_${TYPE_ICON_NAMES[index]}`,
      iconOnly: true
    })));
    const moveTypeSection = accordionSection("moveType", text().damagingMoveType, moveTypeRow);
    const rarityRow = document.createElement("div");
    rarityRow.className = "be-chip-row";
    const rarities = [...new Set(currentPairs().map((pair) => pair.trainer.rarity))].sort((a, b) => a - b);
    rarities.forEach((rarity) => rarityRow.append(createChip({
      label: `${rarity}★`,
      value: String(rarity),
      group: "rarity",
      iconName: `star${rarity}`,
      iconOnly: true
    })));
    const raritySection = accordionSection("rarity", text().rarity, rarityRow, { defaultOpen: true });
    const superawakeningRow = document.createElement("div");
    superawakeningRow.className = "be-chip-row";
    superawakeningRow.append(createChip({
      label: text().superawakening,
      value: "yes",
      group: "superawakening",
      iconName: "0_2"
    }));
    const superawakeningSection = accordionSection("superawakening", text().superawakening, superawakeningRow);
    const acquisitionGroups = document.createElement("div");
    acquisitionGroups.className = "be-acquisition-groups be-skill-category-row--grouped";
    const scoutCluster = document.createElement("div");
    scoutCluster.className = "be-skill-category-cluster";
    const otherAcquisitionCluster = document.createElement("div");
    otherAcquisitionCluster.className = "be-skill-category-cluster";
    ACQUISITION_OPTIONS.forEach((option) => {
      const chip = createChip({
        label: option.labels[locale],
        value: option.value,
        group: "acquisition",
        iconName: option.icon
      });
      (option.value === "1" ? scoutCluster : otherAcquisitionCluster).append(chip);
    });
    EXCLUSIVITY_OPTIONS.forEach((option) => scoutCluster.append(createChip({
      label: option.labels[locale],
      value: option.value,
      group: "exclusivity",
      iconName: option.icon,
      detail: true
    })));
    acquisitionGroups.append(scoutCluster, otherAcquisitionCluster);
    const acquisitionActive = selectedExclusivities.size > 0 || exclusionForGroup("exclusivity").size > 0;
    const acquisitionSection = accordionSection("acquisition", text().acquisition, acquisitionGroups, {
      active: acquisitionActive
    });
    const trainerGroupRow = document.createElement("div");
    trainerGroupRow.className = "be-chip-row";
    teamTagOptions("2003", locale).forEach((option) => trainerGroupRow.append(createChip({
      label: option.label,
      value: option.value,
      group: "trainerGroup",
      textContent: option.label
    })));
    const trainerGroupSection = accordionSection("trainerGroup", text().trainerGroup, trainerGroupRow, {
      iconSrc: FILTER_SECTION_ICON_URLS.trainerGroup
    });
    const fashionRow = document.createElement("div");
    fashionRow.className = "be-chip-row";
    teamTagOptions("2004", locale).forEach((option) => fashionRow.append(createChip({
      label: option.label,
      value: option.value,
      group: "fashion",
      textContent: option.label
    })));
    const fashionSection = accordionSection("fashion", text().fashion, fashionRow, {
      iconSrc: FILTER_SECTION_ICON_URLS.fashion
    });
    const otherRow = document.createElement("div");
    otherRow.className = "be-chip-row";
    teamTagOptions("2999", locale).forEach((option) => otherRow.append(createChip({
      label: option.label,
      value: option.value,
      group: "other",
      textContent: option.label
    })));
    const otherSection = accordionSection("other", text().other, otherRow, {
      iconSrc: FILTER_SECTION_ICON_URLS.other
    });
    panel.append(
      typeSection,
      weaknessSection,
      moveTypeSection,
      roleSection,
      exRoleSection,
      roleCombinationSection,
      raritySection,
      superawakeningSection,
      acquisitionSection,
      regionSection,
      trainerGroupSection,
      fashionSection,
      otherSection
    );
    return panel;
  }
  function setPairResultsLoading(loading) {
    const resultList = document.getElementById("pairSearchResults");
    const indicator = document.querySelector(".be-results-loading");
    resultList?.setAttribute("aria-busy", String(loading));
    document.querySelector(".be-results-column")?.classList.toggle("is-loading", loading);
    if (indicator) indicator.hidden = !loading;
  }
  function queuePairRender(delay = 0) {
    if (delay > 0) {
      window.clearTimeout(pairRenderTimer);
      pairRenderTimer = window.setTimeout(() => {
        pairRenderTimer = 0;
        queuePairRender();
      }, delay);
      return;
    }
    window.clearTimeout(pairRenderTimer);
    pairRenderTimer = 0;
    setPairResultsLoading(true);
    if (pairRenderQueued) return;
    pairRenderQueued = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      pairRenderQueued = false;
      try {
        renderPairs();
      } finally {
        setPairResultsLoading(false);
      }
    }));
  }
  function renderPairs() {
    const input = document.getElementById("pairSearchInput");
    const skillInput = document.getElementById("beSkillSearchInput");
    const resultList = document.getElementById("pairSearchResults");
    const count = document.querySelector(".be-filter-count");
    const clearButton = document.querySelector(".be-clear-button");
    if (!input || !resultList || !count) return;
    hidePairTooltip();
    const locale = language();
    if (skillInput) skillSearchQuery = skillInput.value;
    const pairs = sortPairs(currentPairs().filter((pair) => pairMatches(pair, input.value, locale)), locale);
    count.textContent = text().results(pairs.length);
    if (clearButton) {
      clearButton.hidden = selectedCount() === 0 && excludedCount() === 0 && !input.value.trim() && !skillSearchQuery.trim();
    }
    const filterButton = document.querySelector(".be-filter-button");
    if (filterButton) {
      filterButton.textContent = filterButtonLabel();
    }
    renderActiveFilterTags();
    resultList.dataset.beView = viewMode;
    document.querySelectorAll(".be-view-button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.beView === viewMode));
    });
    if (!pairs.length) {
      const empty = document.createElement("li");
      empty.className = "be-empty";
      empty.textContent = text().empty;
      resultList.replaceChildren(empty);
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const pair of pairs) {
      const row = document.createElement("li");
      row.className = "be-pair-result";
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", pair.name);
      const images = document.createElement("div");
      images.className = "pair-images";
      const iconUrls = [...new Set([
        pair.iconUrl || pairImageById.get(pair.id),
        ...pair.fallbackIconUrls || []
      ].filter(Boolean))];
      if (iconUrls.length) {
        const icon = document.createElement("img");
        icon.className = "be-pair-avatar";
        icon.loading = "lazy";
        icon.decoding = "async";
        let fallbackIndex = 0;
        icon.src = iconUrls[fallbackIndex];
        icon.alt = "";
        icon.addEventListener("error", () => {
          fallbackIndex += 1;
          if (iconUrls[fallbackIndex]) icon.src = iconUrls[fallbackIndex];
        });
        images.append(icon);
      } else {
        const icon = document.createElement("img");
        icon.className = "be-pair-avatar";
        icon.loading = "lazy";
        icon.decoding = "async";
        icon.src = new URL("./data/icons/trainers/unknown.png", location.href).href;
        icon.alt = "";
        images.append(icon);
      }
      const info = document.createElement("div");
      info.className = "pair-info";
      const stars = document.createElement("span");
      stars.className = "pair-stars";
      stars.textContent = "★".repeat(pair.trainer.rarity || 0);
      const name = document.createElement("span");
      name.className = "pair-name";
      name.textContent = pair.name;
      const meta = document.createElement("span");
      meta.className = "be-pair-meta";
      meta.textContent = `${TYPE_NAMES[locale][pair.trainer.type - 1] || "—"} · ${ROLE_NAMES[locale][pair.trainer.role] || "—"}`;
      const sortMetadataText = pairSortMetadata(pair, locale);
      info.append(stars, name, meta);
      if (sortMetadataText) {
        const sortMetadata = document.createElement("span");
        sortMetadata.className = "be-pair-sort-meta";
        sortMetadata.hidden = true;
        sortMetadata.textContent = sortMetadataText;
        info.append(sortMetadata);
      }
      row.append(images, info);
      const selectPair = () => {
        const select = document.getElementById("syncPairSelect");
        if (!select) return;
        rememberSafePair(pair.id);
        restoreSyncGridHome();
        select.value = pair.id;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        document.querySelector(".close-modal")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      };
      row.addEventListener("click", selectPair);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPair();
        }
      });
      fragment.append(row);
    }
    resultList.replaceChildren(fragment);
  }
  function mountPickerLayout(body, input, skillSearch, resultList, toolbar, tools, panel) {
    let layout = body.querySelector(".be-modal-layout");
    let resultsColumn = body.querySelector(".be-results-column");
    let filterSidebar = body.querySelector(".be-filter-sidebar");
    if (!layout) {
      layout = document.createElement("div");
      layout.className = "be-modal-layout";
      resultsColumn = document.createElement("div");
      resultsColumn.className = "be-results-column";
      filterSidebar = document.createElement("aside");
      filterSidebar.className = "be-filter-sidebar";
      layout.append(resultsColumn, filterSidebar);
      body.append(layout);
    }
    let loading = resultsColumn.querySelector(".be-results-loading");
    if (!loading) {
      loading = document.createElement("div");
      loading.className = "be-results-loading";
      loading.hidden = true;
      loading.innerHTML = '<span class="be-loading-spinner" aria-hidden="true"></span>';
      const loadingText = document.createElement("span");
      loadingText.className = "be-loading-text";
      loading.append(loadingText);
    }
    loading.querySelector(".be-loading-text").textContent = text().loading;
    resultsColumn.append(toolbar, resultList, loading);
    panel.prepend(nameSearchField(input), skillSearch);
    filterSidebar.append(tools, panel);
  }
  function ensurePicker() {
    const body = document.querySelector("#pairSearchModal .modal-body");
    const input = document.getElementById("pairSearchInput");
    const resultList = document.getElementById("pairSearchResults");
    const modalTitle = document.querySelector("#pairSearchModal .modal-header h1, #pairSearchModal .modal-header h2, #pairSearchModal .modal-title");
    const locale = language();
    const existingTools = document.querySelector(".be-picker-tools");
    const existingResultsToolbar = document.querySelector(".be-results-toolbar");
    if (!body || !input || !resultList) return;
    if (locale === "en" && modalTitle && /^change sync pair$/i.test(modalTitle.textContent.trim())) {
      modalTitle.textContent = "Change sync pair";
    }
    if (!currentPairs(true).length) return;
    const dynamicFiltersReady = Boolean(document.querySelector('.be-filter-section[data-be-group="rarity"] .be-chip'));
    if (existingTools?.dataset.beLocale === locale && existingResultsToolbar && dynamicFiltersReady) return;
    captureSiteAvatars();
    if (existingTools) {
      existingTools.remove();
      document.querySelector(".be-skill-search-section")?.remove();
      document.querySelector(".be-filter-panel")?.remove();
    }
    existingResultsToolbar?.remove();
    const tools = document.createElement("div");
    tools.className = "be-picker-tools";
    tools.dataset.beLocale = locale;
    const filterButton = document.createElement("button");
    filterButton.className = "be-filter-button";
    filterButton.type = "button";
    filterButton.textContent = filterButtonLabel();
    filterButton.setAttribute("aria-expanded", String(filterIsOpen));
    const count = document.createElement("span");
    count.className = "be-filter-count";
    const clearButton = document.createElement("button");
    clearButton.className = "be-clear-button";
    clearButton.type = "button";
    clearButton.textContent = text().clear;
    clearButton.hidden = selectedCount() === 0 && excludedCount() === 0 && !input.value.trim() && !skillSearchQuery.trim();
    const activeFilterTags = document.createElement("div");
    activeFilterTags.className = "be-active-filter-tags";
    activeFilterTags.setAttribute("aria-label", text().filters);
    activeFilterTags.hidden = true;
    activeFilterTags.append(clearButton);
    const matchModeLabel = document.createElement("label");
    matchModeLabel.className = "be-filter-match-mode";
    const matchModeText = document.createElement("span");
    matchModeText.textContent = text().filterMatch;
    const matchMode = document.createElement("select");
    matchMode.setAttribute("aria-label", text().filterMatch);
    [["and", text().filterMatchAll], ["or", text().filterMatchAny]].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      matchMode.append(option);
    });
    matchMode.value = filterMatchMode;
    matchMode.addEventListener("change", () => {
      filterMatchMode = matchMode.value;
      savePickerPreferences();
      renderActiveFilterTags();
      queuePairRender();
    });
    matchModeLabel.append(matchModeText, matchMode);
    tools.append(count, filterButton, matchModeLabel, activeFilterTags);
    const toolbar = resultsToolbar();
    const skillSearch = skillSearchField();
    const panel = filterPanel();
    mountPickerLayout(body, input, skillSearch, resultList, toolbar, tools, panel);
    bindFilterTooltips(panel);
    bindFilterTooltips(toolbar);
    bindPairTooltips(resultList);
    pickerAvatarObserver?.disconnect();
    pickerAvatarObserver = new MutationObserver(() => {
      requestAnimationFrame(() => {
        const hasSiteRows = Array.from(resultList.children).some((row) => !row.classList.contains("be-pair-result") && !row.classList.contains("be-empty"));
        if (!hasSiteRows) return;
        captureSiteAvatars();
        queuePairRender();
      });
    });
    pickerAvatarObserver.observe(resultList, { childList: true });
    filterButton.addEventListener("click", () => {
      filterIsOpen = !filterIsOpen;
      filterButton.setAttribute("aria-expanded", String(filterIsOpen));
      panel.dataset.open = String(filterIsOpen);
    });
    clearButton.addEventListener("click", () => {
      selectedTypes.clear();
      selectedMoveTypes.clear();
      selectedRoles.clear();
      selectedWeaknesses.clear();
      selectedRarities.clear();
      selectedAcquisitions.clear();
      selectedExclusivities.clear();
      selectedRegions.clear();
      selectedExRoles.clear();
      selectedRoleCombinations.clear();
      selectedSuperawakening.clear();
      selectedTrainerGroups.clear();
      selectedFashion.clear();
      selectedOther.clear();
      selectedSkillIds.clear();
      selectedSkillCategories.clear();
      excludedFilters.clear();
      excludedSkillCategories.clear();
      openFilterAccordions.clear();
      closedFilterAccordions.clear();
      input.value = "";
      skillSearchQuery = "";
      const skillInput = document.getElementById("beSkillSearchInput");
      if (skillInput) skillInput.value = "";
      savePickerPreferences();
      refreshPicker();
    });
    panel.addEventListener("click", (event) => {
      const chip = event.target.closest(".be-chip");
      if (!chip) return;
      const group = chip.dataset.beGroup;
      const value = chip.dataset.beValue;
      if (!selectionForGroup(group)) return;
      const state = cycleFilterState(group, value);
      updateFilterButtonState(chip, state, chip.dataset.beLabel);
      queuePairRender(FILTER_RENDER_DELAY_MS);
    });
    if (input.dataset.beNameSearchBound !== "true") {
      input.dataset.beNameSearchBound = "true";
      input.addEventListener("input", (event) => {
        event.stopImmediatePropagation();
        queuePairRender();
      }, true);
    }
    if (getComputedStyle(document.getElementById("pairSearchModal")).display !== "none") queuePairRender();
  }
  function refreshPicker() {
    const input = document.getElementById("pairSearchInput");
    const body = document.querySelector("#pairSearchModal .modal-body");
    if (input && body) body.append(input);
    document.querySelector(".be-picker-tools")?.remove();
    document.querySelector(".be-skill-search-section")?.remove();
    document.querySelector(".be-filter-panel")?.remove();
    document.querySelector(".be-results-toolbar")?.remove();
    ensurePicker();
    queuePairRender();
  }
  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(() => {
      refreshQueued = false;
      addTileLabels();
      setupMoveTooltips();
      setupMoveLevelAvailability();
      setupResponsiveGrid();
      setupGridBuildMemory();
      setupSectionOrdering();
      ensurePicker();
      ensureSettingsControl();
      updateSpoilerSensitiveSections();
      showSpoilerBanner();
    });
  }
  async function init() {
    addStyles();
    updateSpoilerSensitiveSections();
    try {
      await loadTrainerData();
      const currentPairId2 = new URL(location.href).searchParams.get("pair");
      if (currentPairId2) rememberSafePair(currentPairId2);
    } catch (error) {
      console.warn("[Brybry Enhancer] Pair filters could not load.", error);
    }
    queueRefresh();
    new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
  }
  async function bootstrap() {
    if (!await preflightSpoilerProtection()) return;
    if (document.readyState === "loading") {
      await new Promise((resolve) => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
    }
    await init();
  }
  bootstrap();
})();
