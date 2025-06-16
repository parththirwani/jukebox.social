/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        // Neon effect keyframes
        'neon-flicker': {
          '0%, 100%': {
            textShadow: '0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff, 0 0 20px #ffffff, 0 0 25px #ffffff'
          },
          '50%': {
            textShadow: '0 0 2px #ffffff, 0 0 5px #ffffff, 0 0 8px #ffffff, 0 0 12px #ffffff, 0 0 15px #ffffff'
          }
        },
        'neon-pulse': {
          from: {
            textShadow: '0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981, 0 0 20px #10b981, 0 0 25px #10b981, 0 0 30px #10b981'
          },
          to: {
            textShadow: '0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981, 0 0 40px #10b981, 0 0 50px #10b981, 0 0 60px #10b981'
          }
        },
        'beat': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.7'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.3'
          }
        },
        'beat-icon': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '25%': {
            transform: 'scale(1.1)'
          },
          '50%': {
            transform: 'scale(1.05)'
          },
          '75%': {
            transform: 'scale(1.15)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Neon animations
        'neon-flicker': 'neon-flicker 2s infinite alternate',
        'neon-pulse': 'neon-pulse 1.5s ease-in-out infinite alternate',
        'beat': 'beat 0.8s ease-in-out infinite',
        'beat-icon': 'beat-icon 0.8s ease-in-out infinite'
      },
      // Custom utilities for neon effects
      textShadow: {
        'neon-white': '0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff, 0 0 20px #ffffff, 0 0 25px #ffffff',
        'neon-emerald': '0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981, 0 0 20px #10b981, 0 0 25px #10b981, 0 0 30px #10b981',
        'neon-subtle': '0 0 8px rgba(148, 163, 184, 0.5)'
      },
      boxShadow: {
        'neon-emerald': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.2)',
        'neon-emerald-hover': '0 0 15px rgba(16, 185, 129, 0.7), 0 0 25px rgba(16, 185, 129, 0.5), 0 0 35px rgba(16, 185, 129, 0.3)',
        'neon-outline': '0 0 10px rgba(16, 185, 129, 0.3), inset 0 0 10px rgba(16, 185, 129, 0.1)',
        'neon-outline-hover': '0 0 15px rgba(16, 185, 129, 0.5), inset 0 0 15px rgba(16, 185, 129, 0.2)'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    // Plugin for text-shadow utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-neon-white': {
          textShadow: '0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 15px #ffffff, 0 0 20px #ffffff, 0 0 25px #ffffff',
        },
        '.text-shadow-neon-emerald': {
          textShadow: '0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981, 0 0 20px #10b981, 0 0 25px #10b981, 0 0 30px #10b981',
        },
        '.text-shadow-neon-subtle': {
          textShadow: '0 0 8px rgba(148, 163, 184, 0.5)',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}