"use client";

import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  // Mining Equipment icons
  Axe as Pickaxe,
  Cog,
  Wrench,
  HardDrive as HardHatIcon,
  // Chemical Storage icons
  FlaskConical as Flask,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  // Process Safety icons
  Gauge,
  Settings,
  AlertCircle,
  Lock,
  // Utility Emergency icons
  Zap,
  Radio,
  Battery,
  Bell as Siren,
  // Mining Site Hazard icons
  Mountain,
  AlertTriangle as ExclamationTriangle,
  HardDrive,
  MapPin,
  // Manufacturing Equipment icons
  Cog as Gear,
  Cpu,
  Wrench as Screwdriver,
  Calendar,
  // Manufacturing Facility icons
  Factory,
  Shield,
  Eye,
  CheckCircle,
  // Utility Asset Management icons
  Activity,
  BarChart3,
  Clipboard,
  Database,
  // Well Control Equipment icons
  Wrench as Drill,
  Gauge as Pressure,
  Crosshair,
  LifeBuoy,
  // Oil & Gas Pre-Operational icons
  Flame as Fuel,
  FileCheck,
  Users,
  Play,
} from "lucide-react";

interface Icon {
  component: React.ComponentType<{ size?: number }>;
  name: string;
}

interface Template {
  id: number;
  title: string;
  description: string;
  icons: Icon[];
  category: string;
}

interface IconSelections {
  [key: number]: number;
}

interface ShowIconPicker {
  [key: number]: boolean;
}

const TemplateSelectionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [description, setDescription] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [iconSelections, setIconSelections] = useState<IconSelections>({});
  const [showIconPicker, setShowIconPicker] = useState<ShowIconPicker>({});

  const templates: Template[] = [
    {
      id: 1,
      title: "Mining Equipment Condition Assessment Checklist",
      description:
        "Design a checklist for detailed inspection of mining equipment such as hoists, conveyors, and pressure vessels, including maintenance records and safety features.",
      icons: [
        { component: Pickaxe, name: "pickaxe" },
        { component: Cog, name: "cog" },
        { component: Wrench, name: "wrench" },
        { component: HardHatIcon, name: "hard-hat" },
      ],
      category: "Mining",
    },
    {
      id: 2,
      title: "Chemical Storage & Handling Safety Audit",
      description:
        "Generate a form to inspect chemical storage areas, check for proper labeling, segregation of incompatible substances, spill control, and PPE compliance.",
      icons: [
        { component: Flask, name: "flask" },
        { component: ShieldCheck, name: "shield-check" },
        { component: AlertTriangle, name: "alert-triangle" },
        { component: Droplets, name: "droplets" },
      ],
      category: "Chemical",
    },
    {
      id: 3,
      title: "Process Safety Management Inspection Checklist",
      description:
        "Create a checklist to evaluate process equipment integrity, emergency shutdown systems, and adherence to chemical safety protocols.",
      icons: [
        { component: Gauge, name: "gauge" },
        { component: Settings, name: "settings" },
        { component: AlertCircle, name: "alert-circle" },
        { component: Lock, name: "lock" },
      ],
      category: "Process Safety",
    },
    {
      id: 4,
      title: "Utility System Emergency Preparedness Checklist",
      description:
        "Generate a checklist to assess readiness of emergency systems, backup power, communication protocols, and staff training for utility service continuity.",
      icons: [
        { component: Zap, name: "zap" },
        { component: Radio, name: "radio" },
        { component: Battery, name: "battery" },
        { component: Siren, name: "siren" },
      ],
      category: "Utility",
    },
    {
      id: 5,
      title: "Mining Site Hazard & Safety Audit Form",
      description:
        "Create a form to document site conditions, hazard identification, signage, emergency preparedness, and regulatory compliance in mining operations.",
      icons: [
        { component: Mountain, name: "mountain" },
        { component: ExclamationTriangle, name: "exclamation-triangle" },
        { component: HardDrive, name: "hard-drive" },
        { component: MapPin, name: "map-pin" },
      ],
      category: "Mining",
    },
    {
      id: 6,
      title: "Manufacturing Equipment Preventive Maintenance Form",
      description:
        "Create a checklist for routine inspection and servicing of production machinery, including lubrication, calibration, and wear assessment.",
      icons: [
        { component: Gear, name: "gear" },
        { component: Cpu, name: "cpu" },
        { component: Screwdriver, name: "screwdriver" },
        { component: Calendar, name: "calendar" },
      ],
      category: "Manufacturing",
    },
    {
      id: 7,
      title: "Manufacturing Facility Safety Inspection Checklist",
      description:
        "Generate a form to assess workplace hazards, machine guarding, emergency exits, PPE usage, and fire safety compliance in a manufacturing plant.",
      icons: [
        { component: Factory, name: "factory" },
        { component: Shield, name: "shield" },
        { component: Eye, name: "eye" },
        { component: CheckCircle, name: "check-circle" },
      ],
      category: "Manufacturing",
    },
    {
      id: 8,
      title: "Utility Asset Management Inspection Form",
      description:
        "Track the condition, maintenance schedules, and operational status of utility infrastructure such as transformers, pumps, and pipelines.",
      icons: [
        { component: Activity, name: "activity" },
        { component: BarChart3, name: "bar-chart-3" },
        { component: Clipboard, name: "clipboard" },
        { component: Database, name: "database" },
      ],
      category: "Utility",
    },
    {
      id: 9,
      title: "Well Control Equipment Inspection Checklist",
      description:
        "Generate a checklist for regular inspection of blowout preventers, pressure systems, and emergency response equipment at drilling sites.",
      icons: [
        { component: Drill, name: "drill" },
        { component: Pressure, name: "pressure" },
        { component: Crosshair, name: "crosshair" },
        { component: LifeBuoy, name: "life-buoy" },
      ],
      category: "Oil & Gas",
    },
    {
      id: 10,
      title: "Oil & Gas Pre-Operational Safety Checklist",
      description:
        "Develop a form to verify equipment readiness, safety gear, environmental controls, and permit compliance before starting operations.",
      icons: [
        { component: Fuel, name: "fuel" },
        { component: FileCheck, name: "file-check" },
        { component: Users, name: "users" },
        { component: Play, name: "play" },
      ],
      category: "Oil & Gas",
    },
  ];

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setDescription(template.description);
    setShowTemplates(false);
    // Reset icon picker states
    setShowIconPicker({});
  };

  const handleIconSelect = (templateId: number, iconIndex: number) => {
    setIconSelections((prev) => ({
      ...prev,
      [templateId]: iconIndex,
    }));
    setShowIconPicker((prev) => ({
      ...prev,
      [templateId]: false,
    }));
  };

  const toggleIconPicker = (templateId: number) => {
    setShowIconPicker((prev) => ({
      ...prev,
      [templateId]: !prev[templateId],
    }));
  };

  const getSelectedIcon = (template: Template) => {
    const selectedIndex = iconSelections[template.id] || 0;
    return template.icons[selectedIndex];
  };

  const handleSubmit = () => {
    if (description.trim()) {
      console.log("Description:", description);
      console.log("Selected template:", selectedTemplate);
      if (selectedTemplate) {
        const selectedIcon = getSelectedIcon(selectedTemplate);
        console.log("Selected icon:", selectedIcon.name);
      }
      setIsOpen(false);
      setSelectedTemplate(null);
      setDescription("");
      setShowTemplates(false);
      setIconSelections({});
      setShowIconPicker({});
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
    setDescription("");
    setShowTemplates(false);
    setIconSelections({});
    setShowIconPicker({});
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Demo Button */}
      <div className="text-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create New Checklist
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Checklist
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Template Selection Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Templates
                    </h3>
                    {selectedTemplate && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-blue-600 font-medium">
                          {selectedTemplate.title}
                        </span>
                        <button
                          onClick={clearTemplate}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {showTemplates ? "Hide Templates" : "Browse Templates"}
                    </span>
                    {showTemplates ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>

                {/* Fixed Height Container for Templates - Prevents Layout Shift */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    showTemplates ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                      {templates.map((template) => {
                        const selectedIcon = getSelectedIcon(template);
                        const IconComponent = selectedIcon.component;

                        return (
                          <div
                            key={template.id}
                            className={`border rounded-lg p-4 transition-all bg-white relative ${
                              selectedTemplate?.id === template.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Icon with Picker */}
                              <div className="relative">
                                <div
                                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                    selectedTemplate?.id === template.id
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                  onClick={() => toggleIconPicker(template.id)}
                                  title={selectedIcon.name}
                                >
                                  <IconComponent size={20} />
                                </div>

                                {/* Icon Picker Dropdown */}
                                {showIconPicker[template.id] && (
                                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                                    <div className="grid grid-cols-2 gap-1">
                                      {template.icons.map((icon, index) => {
                                        const Icon = icon.component;
                                        return (
                                          <button
                                            key={index}
                                            onClick={() =>
                                              handleIconSelect(
                                                template.id,
                                                index
                                              )
                                            }
                                            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                              (iconSelections[template.id] ||
                                                0) === index
                                                ? "bg-blue-100 text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                            title={icon.name}
                                          >
                                            <Icon size={16} />
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              <div
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => handleTemplateSelect(template)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-gray-900 text-sm">
                                    {template.title}
                                  </h4>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded ml-2 flex-shrink-0">
                                    {template.category}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs leading-relaxed">
                                  {template.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-900">
                    Description
                  </label>
                  <span className="text-sm text-gray-500">
                    {description.length} characters
                  </span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the checklist you need or select a template above to get started..."
                  className="w-full h-32 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                />
                <div className="text-sm text-gray-500">
                  <p className="mb-2">
                    💡 <strong>Tips for better results:</strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>• Specify the industry or equipment type</div>
                    <div>• Include safety standards or regulations</div>
                    <div>• Mention inspection frequency</div>
                    <div>• List key components to check</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedTemplate ? (
                    <div className="flex items-center space-x-2">
                      <span>
                        Using template:{" "}
                        <strong>{selectedTemplate.title}</strong>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        Icon:{" "}
                        <strong>
                          {getSelectedIcon(selectedTemplate).name}
                        </strong>
                      </span>
                    </div>
                  ) : (
                    <span>Create a custom checklist</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim()}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      description.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Create Checklist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelectionModal;
