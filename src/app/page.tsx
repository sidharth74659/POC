"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Battery,
  Bell,
  Biohazard,
  Calendar,
  ClipboardList,
  Cpu,
  Crosshair,
  Database,
  Factory,
  FileCheck,
  Flame,
  FlaskConical,
  Gauge,
  Hammer,
  HardHat,
  LifeBuoy,
  Mountain,
  Play,
  Power,
  Radio,
  Server,
  Settings,
  TestTube,
  Thermometer,
  Truck,
  Users,
  Wrench,
  X
} from "lucide-react";
import React, { useState } from "react";

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

const TemplateSelectionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [description, setDescription] = useState("");
  const [iconSelections, setIconSelections] = useState<IconSelections>({});

  const templates: Template[] = [
    {
      id: 1,
      title: "Mining Equipment Condition Assessment Checklist",
      description:
        "Detailed inspection of mining equipment such as hoists, conveyors, and pressure vessels, including maintenance records and safety features.",
      icons: [
        { component: Hammer, name: "hammer" },
        { component: HardHat, name: "hard-hat" },
        { component: Wrench, name: "wrench" },
        { component: Mountain, name: "mountain" },
      ],
      category: "Mining",
    },
    {
      id: 2,
      title: "Chemical Storage & Handling Safety Audit",
      description:
        "Inspect chemical storage areas, check for proper labeling, segregation of incompatible substances, spill control, and PPE compliance.",
      icons: [
        { component: FlaskConical, name: "flask-conical" },
        { component: TestTube, name: "test-tube" },
        { component: Biohazard, name: "biohazard" },
        { component: AlertOctagon, name: "alert-octagon" },
      ],
      category: "Chemical",
    },
    {
      id: 3,
      title: "Process Safety Management Inspection Checklist",
      description:
        "Evaluate process equipment integrity, emergency shutdown systems, and adherence to chemical safety protocols.",
      icons: [
        { component: Gauge, name: "gauge" },
        { component: Thermometer, name: "thermometer" },
        { component: Settings, name: "settings" },
        { component: AlertCircle, name: "alert-circle" },
      ],
      category: "Process Safety",
    },
    {
      id: 4,
      title: "Utility System Emergency Preparedness Checklist",
      description:
        "Assess readiness of emergency systems, backup power, communication protocols, and staff training for utility service continuity.",
      icons: [
        { component: Power, name: "power" },
        { component: Radio, name: "radio" },
        { component: Battery, name: "battery" },
        { component: Bell, name: "bell" },
      ],
      category: "Utility",
    },
    {
      id: 5,
      title: "Manufacturing Equipment Preventive Maintenance Form",
      description:
        "Routine inspection and servicing of production machinery, including lubrication, calibration, and wear assessment.",
      icons: [
        { component: Factory, name: "factory" },
        { component: Wrench, name: "wrench" },
        { component: Cpu, name: "cpu" },
        { component: Calendar, name: "calendar" },
      ],
      category: "Manufacturing",
    },
    {
      id: 6,
      title: "Utility Asset Management Inspection Form",
      description:
        "Track the condition, maintenance schedules, and operational status of utility infrastructure such as transformers, pumps, and pipelines.",
      icons: [
        { component: Server, name: "server" },
        { component: Truck, name: "truck" },
        { component: ClipboardList, name: "clipboard-list" },
        { component: Database, name: "database" },
      ],
      category: "Utility",
    },
    {
      id: 7,
      title: "Well Control Equipment Inspection Checklist",
      description:
        "Regular inspection of blowout preventers, pressure systems, and emergency response equipment at drilling sites.",
      icons: [
        { component: Hammer, name: "hammer" },
        { component: Crosshair, name: "crosshair" },
        { component: LifeBuoy, name: "life-buoy" },
        { component: AlertTriangle, name: "alert-triangle" },
      ],
      category: "Oil & Gas",
    },
    {
      id: 8,
      title: "Oil & Gas Pre-Operational Safety Checklist",
      description:
        "Verify equipment readiness, safety gear, environmental controls, and permit compliance before starting operations.",
      icons: [
        { component: Flame, name: "flame" },
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
  };

  const handleIconSelect = (templateId: number, iconIndex: number) => {
    setIconSelections((prev) => ({
      ...prev,
      [templateId]: iconIndex,
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
      setIconSelections({});
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
    setDescription("");
    setIconSelections({});
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-100 p-8">
        {/* Demo Button */}
        <div className="text-center mb-8">
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
                {/* Template Grid - always visible, no toggle */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
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
                            {/* Icon with Picker (Popover) */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <div
                                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                    selectedTemplate?.id === template.id
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                  }`}
                                  title={selectedIcon.name}
                                >
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>
                                        <IconComponent size={24} />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      {selectedIcon.name}
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="grid grid-cols-4 gap-2">
                                  {template.icons.map((icon, index) => {
                                    const Icon = icon.component;
                                    return (
                                      <Tooltip key={icon.name}>
                                        <TooltipTrigger asChild>
                                          <button
                                            onClick={() => handleIconSelect(template.id, index)}
                                            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                                              (iconSelections[template.id] || 0) === index
                                                ? "bg-blue-100 text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                          >
                                            <Icon size={20} />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          {icon.name}
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              </PopoverContent>
                            </Popover>
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
    </TooltipProvider>
  );
};

export default TemplateSelectionModal;
