import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface CalendarErrorBoundaryProps {
  children: React.ReactNode;
  fallbackUI?: React.ReactNode;
}

interface CalendarErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component specifically designed for the calendar component.
 * Catches errors that occur during rendering of the calendar and displays a friendly fallback UI.
 */
class CalendarErrorBoundary extends React.Component<
  CalendarErrorBoundaryProps, 
  CalendarErrorBoundaryState
> {
  constructor(props: CalendarErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): CalendarErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Calendar Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default error message
      if (this.props.fallbackUI) {
        return this.props.fallbackUI;
      }

      return (
        <Card className="calendar-error-container shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Alert className="mb-4 border-orange-200 bg-orange-50 w-full">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <AlertTitle className="text-orange-800">
                Problema di visualizzazione del calendario
              </AlertTitle>
              <AlertDescription className="text-orange-700">
                {this.state.error?.message || 
                  "Si è verificato un errore durante il caricamento del calendario."}
              </AlertDescription>
            </Alert>
            
            <p className="text-gray-600 mb-4">
              Riprova a caricare il calendario o contatta l'assistenza se il problema persiste.
            </p>
            
            <Button 
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <RefreshCw className="h-4 w-4" />
              Riprova
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default CalendarErrorBoundary; 