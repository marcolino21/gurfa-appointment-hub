
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormValues } from '../types';
import { Textarea } from '@/components/ui/textarea';

interface ClientFormProps {
  clientForm: UseFormReturn<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClient: any | null;
}

const ClientForm: React.FC<ClientFormProps> = ({
  clientForm,
  onSubmit,
  activeTab,
  setActiveTab,
  selectedClient
}) => {
  // Get the current value of isPrivate to conditionally render fields
  const isPrivate = clientForm.watch('isPrivate');
  
  return (
    <Form {...clientForm}>
      <form onSubmit={clientForm.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2">
            <TabsTrigger value="dati-personali">Dati Personali</TabsTrigger>
            <TabsTrigger value="dettagli-aggiuntivi">Dettagli Aggiuntivi</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dati-personali" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 flex justify-center items-start">
                <div className="flex items-center gap-2">
                  <FormField
                    control={clientForm.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="space-y-1 flex gap-4">
                        <FormLabel>Tipo cliente</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === 'privato')}
                            defaultValue={field.value ? 'privato' : 'azienda'}
                            className="flex"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="privato" id="privato" />
                              <label htmlFor="privato">Privato</label>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <RadioGroupItem value="azienda" id="azienda" />
                              <label htmlFor="azienda">Azienda</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {!isPrivate && (
                <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                  <h3 className="font-medium">Dati Aziendali</h3>
                  
                  <FormField
                    control={clientForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ragione Sociale</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ragione Sociale" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="vatNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partita IVA</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Partita IVA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="fiscalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice Fiscale</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Codice Fiscale" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={clientForm.control}
                      name="sdiCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice SDI</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Codice SDI" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="pecEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PEC</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="Indirizzo PEC" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isPrivate ? 'Cognome' : 'Cognome Referente'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={isPrivate ? 'Cognome' : 'Cognome Referente'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isPrivate ? 'Nome' : 'Nome Referente'}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={isPrivate ? 'Nome' : 'Nome Referente'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indirizzo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Indirizzo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Città" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={clientForm.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CAP" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={clientForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={clientForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Telefono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPrivate && (
                <FormField
                  control={clientForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sesso</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="M" id="M" />
                            <label htmlFor="M">M</label>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <RadioGroupItem value="F" id="F" />
                            <label htmlFor="F">F</label>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <RadioGroupItem value="O" id="O" />
                            <label htmlFor="O">Altro</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="dettagli-aggiuntivi" className="space-y-4 mt-4">
            {isPrivate && (
              <FormField
                control={clientForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data di nascita</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" placeholder="GG/MM/AAAA" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isPrivate && (
              <FormField
                control={clientForm.control}
                name="fiscalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice fiscale</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Codice fiscale" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={clientForm.control}
              name="loyaltyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice tessera</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Codice tessera" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={clientForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      placeholder="Aggiungi note"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Annulla</Button>
          </DialogClose>
          <Button type="submit">{selectedClient ? 'Salva modifiche' : 'Aggiungi cliente'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClientForm;
