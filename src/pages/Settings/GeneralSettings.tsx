
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const GeneralSettings = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [calendarType, setCalendarType] = React.useState("scorrimento");
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tipo di salone</h2>
        <Card>
          <CardContent className="p-6">
            <RadioGroup defaultValue="unisex" className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unisex" id="unisex" />
                <Label htmlFor="unisex">Unisex</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uomo" id="uomo" />
                <Label htmlFor="uomo">Uomo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="donna" id="donna" />
                <Label htmlFor="donna">Donna</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Riepilogo giornaliero</h2>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-email" className="font-medium">RIEPILOGO GIORNALIERO APPUNTAMENTI VIA EMAIL</Label>
              <Switch id="daily-email" defaultChecked />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">EMAIL</Label>
                <Input id="email" placeholder="gestione.gurfa@gmail.com" />
              </div>
              <div className="space-y-2 flex items-end gap-2">
                <div className="flex-1">
                  <Label>SCARICA RIEPILOGO APPUNTAMENTI</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {date ? format(date, "dd/MM/yyyy") : "Seleziona data"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="mb-px">DOWNLOAD</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Calendario</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border rounded-md p-4 flex flex-col items-center">
                <div className="border rounded-md p-2 mb-4 w-full bg-blue-50">
                  <img 
                    src="/lovable-uploads/937f1400-82bb-47c4-a273-367710437c13.png" 
                    alt="Calendario a scorrimento" 
                    className="w-full h-auto" 
                  />
                </div>
                <RadioGroup value={calendarType} onValueChange={setCalendarType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scorrimento" id="scorrimento" />
                    <Label htmlFor="scorrimento">Calendario a Scorrimento</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="border rounded-md p-4 flex flex-col items-center">
                <div className="border rounded-md p-2 mb-4 w-full">
                  <img 
                    src="/lovable-uploads/8d6595b7-bfe8-4866-8bee-7154c478859b.png" 
                    alt="Calendario mensile" 
                    className="w-full h-auto" 
                  />
                </div>
                <RadioGroup value={calendarType} onValueChange={setCalendarType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mensile" id="mensile" />
                    <Label htmlFor="mensile">Calendario Mensile</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notifiche</h2>
        <Card>
          <CardContent className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-center uppercase">NOTIFICA DI CONFERMA PRENOTAZIONE AL CLIENTE</h3>
              <div className="flex justify-around">
                <div className="flex items-center gap-2">
                  <Label htmlFor="push-confirm">INVIA PUSH DI NOTIFICA</Label>
                  <Switch id="push-confirm" />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-confirm">INVIA EMAIL DI NOTIFICA</Label>
                  <Switch id="email-confirm" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-center uppercase">PROMEMORIA APPUNTAMENTO AL CLIENTE</h3>
              <div className="flex justify-around">
                <div className="flex items-center gap-2">
                  <Label htmlFor="push-reminder">INVIA PUSH DI NOTIFICA</Label>
                  <Switch id="push-reminder" />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-reminder">INVIA EMAIL DI NOTIFICA</Label>
                  <Switch id="email-reminder" />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sms-reminder">INVIA SMS DI NOTIFICA</Label>
                  <Switch id="sms-reminder" />
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <div className="w-full max-w-md">
                  <Label htmlFor="reminder-time" className="block mb-2">QUANDO?</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger id="reminder-time">
                      <SelectValue placeholder="Seleziona il tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Ora Prima</SelectItem>
                      <SelectItem value="2h">2 Ore Prima</SelectItem>
                      <SelectItem value="12h">12 Ore Prima</SelectItem>
                      <SelectItem value="24h">24 Ore Prima</SelectItem>
                      <SelectItem value="48h">48 Ore Prima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettings;
