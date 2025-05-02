import { useState } from 'react';
import { Check } from 'lucide-react';

interface StepSliderProps {
  value: number;
  onChange: (step: number) => void;
  steps?: string[];
}

const StepSlider = ({ value, onChange, steps = ['Account', 'Securyty', 'Review'] }: StepSliderProps) => {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Labels for steps */}
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <span 
            key={index}
            className={`text-sm md:text-base font-medium ${
              index + 1 <= value ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {step}
          </span>
        ))}
      </div>
      
      {/* Step indicator with circles and lines */}
      <div className="relative flex items-center justify-between">
        {/* Connecting lines */}
        <div className="absolute h-0.5 bg-gray-300 top-1/2 left-0 right-0 -translate-y-1/2"></div>
        
        {/* Active line overlay */}
        <div 
          className="absolute h-0.5 bg-blue-600 top-1/2 left-0 -translate-y-1/2 transition-all duration-300"
          style={{ 
            width: `${(value - 1) * 50}%`,
          }}
        ></div>
        
        {/* Step circles */}
        {steps.map((_, index) => {
          const isActive = index + 1 <= value;
          const isCompleted = index + 1 < value;
          
          return (
            <div 
              key={index}
              onClick={() => onChange(index + 1)}
              className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full cursor-pointer
                transition-all duration-300
                ${isActive 
                  ? 'bg-blue-600 border-2 border-blue-600' 
                  : 'bg-gray-300 border-2 border-gray-300'
                }
              `}
            >
              {isCompleted && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Hidden native input for accessibility */}
      <input
        type="range"
        min={1}
        max={steps.length}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sr-only"
        aria-label="Progress step"
      />
    </div>
  );
};

// Ejemplo de uso
const StepSliderDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <div className="p-4">
      <StepSlider 
        value={currentStep}
        onChange={setCurrentStep}
      />
      
      <div className="mt-8">
        <button 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="px-4 py-2 mr-2 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200"
          disabled={currentStep === 1}
        >
          Anterior
        </button>
        <button 
          onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
          className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
          disabled={currentStep === 3}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default StepSliderDemo;