
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void; // Chiama in caso di successo
}

const initialState = {
  first_name: "",
  last_name: "",
  business_name: "",
  vat_number: "",
  street_address: "",
  city: "",
  province: "",
  postal_code: "",
  phone: "",
  email: "",
  pec_email: "",
  sdi_code: "",
  is_active: true,
};

const BusinessUserDialog: React.FC<BusinessUserDialogProps> = ({
  open,
  onOpenChange,
  onUserCreated,
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validazione base
    if (!form.first_name || !form.last_name || !form.email) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: "I campi Nome, Cognome ed Email sono obbligatori.",
      });
      setIsLoading(false);
      return;
    }

    const toInsert = {
      ...form,
      is_active: !!form.is_active,
    };
    try {
      const { data, error } = await supabase
        .from("business_users")
        .insert(toInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }
      toast({
        title: "Utente creato",
        description: "Il nuovo utente è stato aggiunto con successo!",
      });
      setForm(initialState);
      onOpenChange(false);
      if (onUserCreated) onUserCreated();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Errore",
        description: err?.message || "Si è verificato un errore.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => { onOpenChange(o); if (!o) setForm(initialState); }}>
      <DialogContent className="max-w-lg w-[95%] max-h-[85vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Nuovo utente</DialogTitle>
        </DialogHeader>
        <form className="space-y-3 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="first_name">Nome*</Label>
              <Input id="first_name" value={form.first_name} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <Label htmlFor="last_name">Cognome*</Label>
              <Input id="last_name" value={form.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email*</Label>
            <Input id="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Telefono</Label>
            <Input id="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="business_name">Nome azienda</Label>
            <Input id="business_name" value={form.business_name} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="vat_number">Partita IVA</Label>
            <Input id="vat_number" value={form.vat_number} onChange={handleChange} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="street_address">Indirizzo</Label>
              <Input id="street_address" value={form.street_address} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <Label htmlFor="city">Città</Label>
              <Input id="city" value={form.city} onChange={handleChange} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Label htmlFor="province">Provincia</Label>
              <Input id="province" value={form.province} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <Label htmlFor="postal_code">CAP</Label>
              <Input id="postal_code" value={form.postal_code} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="pec_email">PEC</Label>
            <Input id="pec_email" value={form.pec_email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="sdi_code">Codice SDI</Label>
            <Input id="sdi_code" value={form.sdi_code} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input id="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="accent-blue-600" />
            <Label htmlFor="is_active">Profilo attivo</Label>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessUserDialog;
