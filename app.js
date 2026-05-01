const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const navLinks = document.querySelectorAll(".desktop-nav a");
const hero = document.querySelector(".hero");
const pageFlight = document.querySelector("[data-page-flight]");
const aboutSection = document.querySelector("#about");
const contactSection = document.querySelector("#cv");
const flightEarth = document.querySelector(".flight-earth");
const flightMoon = document.querySelector(".flight-moon");
const heroPanel = document.querySelector(".hero-panel");
const paleDotScene = document.querySelector(".pale-dot-scene");
const themeOutput = document.querySelector("[data-theme-output]");
const detailDialog = document.querySelector("[data-detail-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogBody = document.querySelector("[data-dialog-body]");
const closeDetail = document.querySelector("[data-close-detail]");
const copyToast = document.querySelector("[data-copy-toast]");
const carbonGrid = document.querySelector("[data-carbon-grid]");
const carbonTotal = document.querySelector("[data-carbon-total]");
const carbonTotalLabel = document.querySelector("[data-carbon-total-label]");
const cellReadout = document.querySelector("[data-cell-readout]");
const statTotal = document.querySelector("[data-stat-total]");
const statHotspot = document.querySelector("[data-stat-hotspot]");
const statPeak = document.querySelector("[data-stat-peak]");
const justiceGrid = document.querySelector("[data-justice-grid]");
const justiceBudget = document.querySelector("[data-justice-budget]");
const equityWeight = document.querySelector("[data-equity-weight]");
const justiceBudgetLabel = document.querySelector("[data-justice-budget-label]");
const equityLabel = document.querySelector("[data-equity-label]");
const justiceReadout = document.querySelector("[data-justice-readout]");
const justiceHeavy = document.querySelector("[data-justice-heavy]");
const justiceEquity = document.querySelector("[data-justice-equity]");
const justiceSink = document.querySelector("[data-justice-sink]");
const justiceKnee = document.querySelector("[data-justice-knee]");
const effectPlot = document.querySelector("[data-effect-plot]");
const elasticityMeter = document.querySelector("[data-elasticity-meter]");
const elasticityScore = document.querySelector("[data-elasticity-score]");
const heterogeneity = document.querySelector("[data-heterogeneity]");
const robustness = document.querySelector("[data-robustness]");

const gridColumns = 14;
const gridRows = 10;
let activeScenario = "compact";
let activeCostScenario = "baseline";
let activeNatureAttribute = "quality";
let selectedCell = null;
let heroPointerFrame = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const proximityScale = (pointerX, pointerY, element, maxLift) => {
  if (!element) return 1;
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distanceToCenter = Math.hypot(pointerX - centerX, pointerY - centerY);
  const range = Math.max(rect.width, rect.height) * 1.35;
  return 1 + clamp(1 - distanceToCenter / range, 0, 1) * maxLift;
};

const setHeroVars = (vars) => {
  if (!hero) return;
  Object.entries(vars).forEach(([key, value]) => {
    hero.style.setProperty(key, value);
  });
};

const resetHeroVars = () => {
  setHeroVars({
    "--content-tilt-x": "0deg",
    "--content-tilt-y": "0deg",
    "--orbit-shift-x": "0px",
    "--orbit-shift-y": "0px",
    "--earth-scale": "1",
    "--moon-scale": "1",
  });
};

const updatePageFlight = () => {
  if (!pageFlight || !aboutSection || !contactSection) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    pageFlight.classList.remove("is-visible");
    return;
  }

  const viewport = window.innerHeight || 1;
  const start = aboutSection.offsetTop - viewport * 0.42;
  const end = contactSection.offsetTop - viewport * 0.38;
  const progress = clamp((window.scrollY - start) / Math.max(end - start, 1), 0, 1);
  const railHeight = Math.max(viewport - 204, 260);
  const flightY = progress * railHeight;
  const approach = 1 - progress;
  const flightX = 28 + Math.sin(progress * Math.PI * 1.25) * 10 * approach;
  const flightRotate = -9 * approach;

  pageFlight.style.setProperty("--flight-y", `${flightY.toFixed(1)}px`);
  pageFlight.style.setProperty("--flight-x", `${flightX.toFixed(1)}px`);
  pageFlight.style.setProperty("--flight-rotate", `${flightRotate.toFixed(1)}deg`);
  pageFlight.style.setProperty("--flight-trail", `${Math.max(0, flightY - 8).toFixed(1)}px`);
  pageFlight.classList.toggle("is-visible", window.scrollY >= start && window.scrollY <= end + viewport * 0.75);
  pageFlight.classList.toggle("is-landed", progress > 0.92);
};

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
  if (heroPanel) {
    heroPanel.style.setProperty("--hero-panel-y", `${Math.min(window.scrollY * 0.08, 34)}px`);
  }
  if (paleDotScene) {
    paleDotScene.style.setProperty("--space-y", `${Math.min(window.scrollY * 0.05, 42)}px`);
  }
  updatePageFlight();
};

const closeMenu = () => {
  document.body.classList.remove("menu-open");
  mobileNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-label", "Open menu");
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
resetHeroVars();

hero?.addEventListener("pointermove", (event) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (heroPointerFrame) window.cancelAnimationFrame(heroPointerFrame);

  heroPointerFrame = window.requestAnimationFrame(() => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setHeroVars({
      "--content-tilt-x": `${clamp(y * -3.8, -3, 3).toFixed(2)}deg`,
      "--content-tilt-y": `${clamp(x * 4.8, -4, 4).toFixed(2)}deg`,
      "--orbit-shift-x": `${(x * 52).toFixed(1)}px`,
      "--orbit-shift-y": `${(y * 34).toFixed(1)}px`,
      "--earth-scale": proximityScale(event.clientX, event.clientY, flightEarth, 0.2).toFixed(3),
      "--moon-scale": proximityScale(event.clientX, event.clientY, flightMoon, 0.28).toFixed(3),
    });
  });
});

hero?.addEventListener("pointerleave", resetHeroVars);

menuToggle?.addEventListener("click", () => {
  const isOpen = mobileNav?.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", Boolean(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll("[data-filter-group]").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filterGroup;
    const filter = button.dataset.filter;
    const list = document.querySelector(`[data-filter-list="${group}"]`);

    document.querySelectorAll(`[data-filter-group="${group}"]`).forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    list?.querySelectorAll("[data-category]").forEach((item) => {
      const categories = item.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

const makeCellSignals = (x, y) => {
  const nx = x / (gridColumns - 1);
  const ny = y / (gridRows - 1);
  const compactCore = Math.max(0, 1 - distance(nx, ny, 0.48, 0.48) * 1.9);
  const eastCenter = Math.max(0, 1 - distance(nx, ny, 0.76, 0.32) * 2.5);
  const westCenter = Math.max(0, 1 - distance(nx, ny, 0.23, 0.68) * 2.3);
  const light = Math.min(1, compactCore * 0.7 + eastCenter * 0.48 + westCenter * 0.38 + 0.1);
  const heat = Math.min(1, compactCore * 0.46 + nx * 0.24 + (1 - ny) * 0.18 + Math.sin((x + y) * 1.7) * 0.04 + 0.18);
  const rent = Math.min(1, compactCore * 0.58 + eastCenter * 0.36 + nx * 0.18 + 0.08);
  const nature = Math.min(1, Math.max(0, 1 - compactCore * 0.7 - eastCenter * 0.38 + ny * 0.24));

  return { compactCore, eastCenter, westCenter, heat, light, nature, rent, x, y };
};

const scenarioWeight = (signals) => {
  if (activeScenario === "polycentric") {
    return signals.eastCenter * 0.7 + signals.westCenter * 0.72 + signals.compactCore * 0.36;
  }

  if (activeScenario === "buffered") {
    return signals.compactCore * 0.54 + signals.eastCenter * 0.32 + (1 - signals.nature) * 0.34;
  }

  return signals.compactCore * 0.82 + signals.eastCenter * 0.28 + signals.westCenter * 0.18;
};

const getEnabledFactors = () => {
  const factors = {};
  document.querySelectorAll("[data-factor]").forEach((input) => {
    factors[input.dataset.factor] = input.checked;
  });
  return factors;
};

const buildCarbonGrid = () => {
  if (!carbonGrid) return [];
  carbonGrid.innerHTML = "";

  const cells = [];
  for (let y = 0; y < gridRows; y += 1) {
    for (let x = 0; x < gridColumns; x += 1) {
      const cell = document.createElement("button");
      cell.className = "carbon-cell";
      cell.type = "button";
      cell.setAttribute("aria-label", `30m grid cell ${x + 1}, ${y + 1}`);
      carbonGrid.appendChild(cell);
      cells.push({ element: cell, signals: makeCellSignals(x, y) });
    }
  }

  return cells;
};

const carbonCells = buildCarbonGrid();

const renderCarbonGrid = () => {
  if (!carbonCells.length || !carbonTotal) return;

  const total = Number(carbonTotal.value);
  const factors = getEnabledFactors();
  const weighted = carbonCells.map((cell) => {
    const signals = cell.signals;
    let weight = 0.28 + scenarioWeight(signals);
    if (factors.light) weight += signals.light * 0.86;
    if (factors.heat) weight += signals.heat * 0.72;
    if (factors.rent) weight += signals.rent * 0.62;
    if (factors.nature) weight -= signals.nature * 0.46;
    weight = Math.max(0.08, weight);
    return { ...cell, weight };
  });

  const weightSum = weighted.reduce((sum, cell) => sum + cell.weight, 0);
  const values = weighted.map((cell) => ({ ...cell, value: (cell.weight / weightSum) * total }));
  const sorted = [...values].sort((a, b) => b.value - a.value);
  const cutoff = sorted[Math.max(0, Math.floor(sorted.length * 0.2) - 1)]?.value || 0;
  const peak = sorted[0]?.value || 0;
  const hotspotSum = sorted.slice(0, Math.floor(sorted.length * 0.2)).reduce((sum, cell) => sum + cell.value, 0);

  values.forEach((cell) => {
    const intensity = peak ? cell.value / peak : 0;
    const hue = 176 - intensity * 152;
    const lightness = 22 + intensity * 42;
    cell.element.style.background = `hsl(${hue} 58% ${lightness}%)`;
    cell.element.style.setProperty("--cell-bar", `${Math.max(8, intensity * 92)}%`);
    cell.element.classList.toggle("is-hotspot", cell.value >= cutoff);
    cell.element.dataset.value = cell.value.toFixed(2);
    cell.element.dataset.intensity = `${Math.round(intensity * 100)}%`;
    cell.element.dataset.x = cell.signals.x + 1;
    cell.element.dataset.y = cell.signals.y + 1;
  });

  if (carbonTotalLabel) carbonTotalLabel.textContent = `${total} kt CO2e`;
  if (statTotal) statTotal.textContent = `${total} kt`;
  if (statHotspot) statHotspot.textContent = `${Math.round((hotspotSum / total) * 100)}%`;
  if (statPeak) statPeak.textContent = `${peak.toFixed(1)} kt`;
};

carbonCells.forEach((cell) => {
  cell.element.addEventListener("click", () => {
    selectedCell?.classList.remove("is-selected");
    selectedCell = cell.element;
    selectedCell.classList.add("is-selected");
    if (cellReadout) {
      cellReadout.textContent = `Cell ${cell.element.dataset.x}, ${cell.element.dataset.y}: ${cell.element.dataset.value} kt CO2e allocated from the city total. Relative intensity: ${cell.element.dataset.intensity}.`;
    }
  });
});

carbonTotal?.addEventListener("input", renderCarbonGrid);

document.querySelectorAll("[data-factor]").forEach((input) => {
  input.addEventListener("change", renderCarbonGrid);
});

document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    activeScenario = button.dataset.scenario;
    document.querySelectorAll("[data-scenario]").forEach((item) => item.classList.toggle("active", item === button));
    renderCarbonGrid();
  });
});

renderCarbonGrid();

document.querySelectorAll("[data-lab-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.labTab;
    document.querySelectorAll("[data-lab-tab]").forEach((item) => item.classList.toggle("active", item === button));
    document.querySelectorAll("[data-lab-panel]").forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.labPanel !== target);
    });
  });
});

const makeJusticeCell = (x, y) => {
  const nx = x / 11;
  const ny = y / 7;
  const core = Math.max(0, 1 - distance(nx, ny, 0.48, 0.48) * 1.8);
  const deprived = Math.max(0, 1 - distance(nx, ny, 0.28, 0.72) * 2.2);
  const ilv = Math.min(1, core * 0.74 + nx * 0.18 + 0.1);
  const carbon = Math.min(1, core * 0.7 + (1 - ny) * 0.22 + Math.sin(x * 1.4 + y) * 0.04 + 0.12);
  const redline = ny < 0.16 && x > 7;
  const candidate = carbon > 0.46 && ilv < 0.72 && !redline;
  const equity = Math.min(1, deprived * 0.72 + (1 - ilv) * 0.38);
  return { x, y, ilv, carbon, redline, candidate, equity };
};

const buildJusticeGrid = () => {
  if (!justiceGrid) return [];
  justiceGrid.innerHTML = "";
  const cells = [];
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 12; x += 1) {
      const element = document.createElement("div");
      element.className = "justice-cell";
      justiceGrid.appendChild(element);
      cells.push({ element, signals: makeJusticeCell(x, y) });
    }
  }
  return cells;
};

const justiceCells = buildJusticeGrid();

const renderJusticeGrid = () => {
  if (!justiceCells.length || !justiceBudget || !equityWeight) return;

  const budgetPercent = Number(justiceBudget.value);
  const equity = Number(equityWeight.value) / 100;
  const costMultiplier = activeCostScenario === "high" ? 1.34 : activeCostScenario === "low" ? 0.72 : 1;
  const budget = budgetPercent * 1.8;
  let spent = 0;
  let heavyCount = 0;
  let equityGain = 0;
  let sinkGain = 0;

  const ranked = justiceCells
    .filter((cell) => cell.signals.candidate)
    .map((cell) => {
      const s = cell.signals;
      const score = s.carbon * (1 - equity) + s.equity * equity + (1 - s.ilv) * 0.24;
      return { ...cell, score };
    })
    .sort((a, b) => b.score - a.score);

  justiceCells.forEach((cell) => {
    cell.status = 0;
    cell.element.className = `justice-cell${cell.signals.redline ? " is-locked" : ""}`;
  });

  ranked.forEach((cell, index) => {
    const heavyCost = 5 * costMultiplier * (0.72 + cell.signals.ilv);
    const lightCost = 1 * costMultiplier * (0.82 + cell.signals.ilv);
    const preferHeavy = index < ranked.length * (0.25 + equity * 0.35);
    if (preferHeavy && spent + heavyCost <= budget) {
      cell.status = 2;
      spent += heavyCost;
      heavyCount += 1;
      equityGain += cell.signals.equity * 2.4;
      sinkGain += cell.signals.carbon * 2.1;
    } else if (spent + lightCost <= budget) {
      cell.status = 1;
      spent += lightCost;
      equityGain += cell.signals.equity * 0.9;
      sinkGain += cell.signals.carbon * 0.72;
    }
  });

  justiceCells.forEach((cell) => {
    cell.element.classList.add(`status-${cell.status || 0}`);
  });

  const normalizedEquity = Math.min(96, Math.round((equityGain / 32) * 100));
  const normalizedSink = Math.min(96, Math.round((sinkGain / 30) * 100));
  if (justiceBudgetLabel) justiceBudgetLabel.textContent = `${budgetPercent}% ${budgetPercent === 20 ? "baseline" : "ceiling"}`;
  if (equityLabel) equityLabel.textContent = `${Math.round(equity * 100)}% Rawlsian`;
  if (justiceHeavy) justiceHeavy.textContent = String(heavyCount);
  if (justiceEquity) justiceEquity.textContent = `${normalizedEquity}%`;
  if (justiceSink) justiceSink.textContent = `${normalizedSink}%`;
  if (justiceKnee) justiceKnee.textContent = `Knee point: ${normalizedEquity >= normalizedSink ? "equity-leaning" : "efficiency-leaning"} frontier`;
  if (justiceReadout) {
    justiceReadout.textContent = `Synthetic optimizer spent ${spent.toFixed(1)} of ${budget.toFixed(1)} budget units across ${ranked.length} screened parcels. Gold cells represent heavy reconstruction; teal cells represent light targeted intervention.`;
  }
};

justiceBudget?.addEventListener("input", renderJusticeGrid);
equityWeight?.addEventListener("input", renderJusticeGrid);

document.querySelectorAll("[data-cost-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    activeCostScenario = button.dataset.costScenario;
    document.querySelectorAll("[data-cost-scenario]").forEach((item) => item.classList.toggle("active", item === button));
    renderJusticeGrid();
  });
});

renderJusticeGrid();

const renderNatureMeta = () => {
  if (!effectPlot) return;
  const moderators = {};
  document.querySelectorAll("[data-moderator]").forEach((input) => {
    moderators[input.dataset.moderator] = input.checked;
  });

  let elasticity = activeNatureAttribute === "quality" ? 7.4 : activeNatureAttribute === "quantity" ? 3.1 : 5.6;
  if (moderators.developing) elasticity += 1.2;
  if (moderators.rental) elasticity -= 0.8;
  if (moderators.near) elasticity += 1.6;
  if (moderators.quality) elasticity += activeNatureAttribute === "quality" ? 1.1 : 0.3;

  const heteroValue = Math.abs(elasticity - 6.4);
  effectPlot.innerHTML = "";
  for (let i = 0; i < 34; i += 1) {
    const dot = document.createElement("span");
    const spread = Math.sin(i * 2.1) * (heteroValue + 2.4);
    const effect = elasticity + spread + ((i % 5) - 2) * 0.55;
    const x = 10 + ((i * 17) % 80);
    const y = 50 - effect * 2.4 + ((i % 3) - 1) * 4;
    dot.className = "effect-dot";
    dot.style.setProperty("--dot-x", `${x}%`);
    dot.style.setProperty("--dot-y", `${Math.max(12, Math.min(88, y))}%`);
    dot.style.setProperty("--dot-size", `${7 + (i % 4) * 2}px`);
    effectPlot.appendChild(dot);
  }

  if (elasticityMeter) elasticityMeter.style.width = `${Math.max(8, Math.min(96, 48 + elasticity * 4))}%`;
  if (elasticityScore) elasticityScore.textContent = `${elasticity >= 0 ? "+" : ""}${elasticity.toFixed(1)}%`;
  if (heterogeneity) heterogeneity.textContent = heteroValue > 4 ? "High" : heteroValue > 2 ? "Moderate" : "Low";
  if (robustness) robustness.textContent = moderators.quality && moderators.near ? "Stable" : "Sensitive";
};

document.querySelectorAll("[data-nature-attribute]").forEach((button) => {
  button.addEventListener("click", () => {
    activeNatureAttribute = button.dataset.natureAttribute;
    document.querySelectorAll("[data-nature-attribute]").forEach((item) => item.classList.toggle("active", item === button));
    renderNatureMeta();
  });
});

document.querySelectorAll("[data-moderator]").forEach((input) => {
  input.addEventListener("change", renderNatureMeta);
});

renderNatureMeta();

document.querySelectorAll(".theme-node").forEach((node) => {
  const activateTheme = () => {
    document.querySelectorAll(".theme-node").forEach((item) => item.classList.toggle("active", item === node));
    if (themeOutput) {
      themeOutput.textContent = node.dataset.themeDetail || "";
    }
  };

  node.addEventListener("click", activateTheme);
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateTheme();
    }
  });
});

document.querySelectorAll("[data-open-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!detailDialog || !dialogTitle || !dialogBody) return;
    dialogTitle.textContent = button.dataset.detailTitle || "Project Detail";
    dialogBody.textContent = button.dataset.detailBody || "";

    if (typeof detailDialog.showModal === "function") {
      detailDialog.showModal();
    } else {
      detailDialog.setAttribute("open", "");
    }
  });
});

closeDetail?.addEventListener("click", () => {
  detailDialog?.close();
});

detailDialog?.addEventListener("click", (event) => {
  if (event.target === detailDialog) {
    detailDialog.close();
  }
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .signal-strip > div, .atlas-stage, .atlas-panel, .intro-grid, .education-grid article, .theme-node, .info-card, .work-card, .honor-wall article, .project-list article, .skill-node, .timeline-list li, .cv-panel, .contact-panel",
);

revealTargets.forEach((target) => target.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealTargets.forEach((target) => revealObserver.observe(target));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -52% 0px", threshold: 0 },
);

document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

let copyToastTimer = null;

const showCopyToast = (message) => {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.add("is-visible");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1500);
};

const copyText = async (value) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
};

document.querySelectorAll("[data-copy-value]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue;
    if (!value) return;

    try {
      await copyText(value);
      button.classList.add("is-copied");
      showCopyToast("Copied to clipboard");
      window.setTimeout(() => button.classList.remove("is-copied"), 900);
    } catch {
      showCopyToast("Copy failed");
    }
  });
});

if (window.lucide) {
  window.lucide.createIcons();
}
