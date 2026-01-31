/**
 * Represents a generic entity with common properties.
 * Used as a base interface for makes, models, generations etc.
 */
type Entity = {
  /**
   * The unique identifier for the entity. It's slugified version of the name.
   * @dev It's a prefferred way to reference data in consumer applications.
   */
  id: string
  /**
   * The source identifier for the entity.
   * @dev Used to link to the original data source - eg. in URLs or selectors.
   */
  sourceId: string
  /**
   * The human-readable name of the entity.
   */
  name: string
}

export type Make = Entity
export type Model = Entity
export type Generation = Entity & {
  production: {
    start: number
    end: number | null
  }
  type?: string
}

type PageDataMakes = {
  id: 'brandtree.overview'
  data: {
    allBrands: {
      title: string
      url: string
    }[]
  }
}

type PageDataModels = {
  id: 'brandtree.listSeries'
} & {
  [key in 'past' | 'current']: {
    title: string
    url: string
  }[]
}

type PageDataGenerations = {
  id: 'brandtree.listGenerationsBySeriesOverview'
  data: {
    name: string
    seriesName: string
    url: string
    productionStart: string
    productionEnd: string | '0'
    type: string
  }[]
}

export type PageDataTechSheets = {
  id: 'brandtree.navigation'
  techData: {
    /**
     * Technical data for the vehicle
     */
    techdata: {
      /**
       * Unique identifier
       */
      ID: number
      /**
       * CCDB availability flag
       */
      CCDB_verfuegbar: number
      /**
       * JATO vehicle ID
       */
      JATO_Fahrzeug_ID: null
      /**
       * JATO vehicle existence flag
       */
      JATO_Fahrzeug_Exist: null
      /**
       * Last modified date
       */
      Modified: string
      /**
       * Serial number
       */
      Slnr: number
      /**
       * Make/brand ID
       */
      Marke_ID: number
      /**
       * Series/model line ID
       */
      Baureihe_ID: number
      /**
       * Model ID
       */
      Modell_ID: number
      /**
       * Body category ID
       */
      KarosserieKategorie_ID: number
      /**
       * Drive type ID
       */
      Antriebstyp_ID: number
      /**
       * Trim/equipment name
       */
      Ausstattname: string
      /**
       * Production year
       */
      Baujahr_Jahr: number
      /**
       * Production month
       */
      Baujahr_Monat: number
      /**
       * End of production year
       */
      Bauende_Jahr: number
      /**
       * End of production month
       */
      Bauende_Monat: number
      /**
       * Manufacturer key number (HSN)
       */
      Hsn1: string
      /**
       * Type key number (TSN)
       */
      Tsn1: string
      /**
       * Construction type
       */
      Bauart: string
      /**
       * Engine direction
       */
      Manordrich: string
      /**
       * Engine position/placement
       */
      Manordlage: string
      /**
       * Number of cylinders
       */
      Zylinder: number
      /**
       * Engine stroke (2-stroke or 4-stroke)
       */
      Takt: number
      /**
       * Camshaft arrangement
       */
      AnordnungNockenwellen: string
      /**
       * Valve control system
       */
      Ventilsteuerung: string
      /**
       * Valves per cylinder
       */
      VentileproZylinder: string
      /**
       * Emission standard class
       */
      Schadstoffklasse: string
      /**
       * Exhaust system
       */
      Abgas: string
      /**
       * Power in kilowatts
       */
      Kw: number
      /**
       * Power in horsepower
       */
      Ps: number
      /**
       * Minimum power in kilowatts
       */
      Kwmin: number
      /**
       * Kilowatt limit/range
       */
      KwL: string
      /**
       * Horsepower limit/range
       */
      PsL: string
      /**
       * Engine displacement in cc
       */
      Hubraum: number
      /**
       * Cylinder bore
       */
      Bohrung: string
      /**
       * Piston stroke
       */
      Hub: string
      /**
       * Compression ratio
       */
      Verdichtung: string
      /**
       * Boost pressure
       */
      Ladedruck: string
      /**
       * Torque in Nm
       */
      Drehmoment: number
      /**
       * Minimum RPM for max torque
       */
      Drehmin: number
      /**
       * Piston speed at max power
       */
      KolbengeschwindigkeitbeimaxLeistg: string
      /**
       * Oil capacity
       */
      Oelinhalt: string
      /**
       * Cooling system capacity
       */
      Kuehlinh: string
      /**
       * 0-100 km/h acceleration time
       */
      B100: string
      /**
       * Number of gears
       */
      Gangzahl: string
      /**
       * Axle drive
       */
      Achsantr: string
      /**
       * Transmission type
       */
      Getriebe: string
      /**
       * Inner city fuel consumption
       */
      EgzInner: string
      /**
       * Highway fuel consumption
       */
      EgzAusser: string
      /**
       * Total/combined fuel consumption
       */
      EgzGesamt: null
      /**
       * Hydrocarbon and nitrogen oxide emissions
       */
      HcNox: string
      /**
       * Nitrogen oxide emissions
       */
      Nox: string
      /**
       * Carbon monoxide emissions
       */
      Co: string
      /**
       * Particulate emissions
       */
      Partikel: string
      /**
       * CO2 emissions
       */
      EgzCo2: number
      /**
       * Front suspension
       */
      Aufhaengv: string
      /**
       * Rear suspension
       */
      Aufhaengh: string
      /**
       * Front spring/suspension
       */
      Federung_v: string
      /**
       * Rear spring/suspension
       */
      Federung_h: string
      /**
       * Front stabilizer
       */
      Stabiv: string
      /**
       * Rear stabilizer
       */
      Stabih: string
      /**
       * Power steering
       */
      Servolenk: string
      /**
       * Steering gear
       */
      Lenkgetr: string
      /**
       * Steering ratio
       */
      Lenkuebers: string
      /**
       * Brake booster
       */
      Servobrems: string
      /**
       * Brake system
       */
      Bremssys: string
      /**
       * Front brake type
       */
      Bremse_v: string
      /**
       * Rear brake type
       */
      Bremse_h: string
      /**
       * Front brake disc diameter
       */
      Brdurchmvo: string
      /**
       * Rear brake disc diameter
       */
      Brdurchmhi: string
      /**
       * Anti-lock braking system
       */
      ABS: string
      /**
       * Brake performance
       */
      Fsbremswir: string
      /**
       * Front wheel rim specification
       */
      Felgenstring_v: string
      /**
       * Rear wheel rim specification
       */
      Felgenstring_h: string
      /**
       * Front tire specification
       */
      Reifenstring_v: string
      /**
       * Rear tire specification
       */
      Reifenstring_h: string
      /**
       * Number of seats
       */
      Sitze: number
      /**
       * Number of doors
       */
      Tuerzahl: number
      /**
       * Body style
       */
      Karobauart: string
      /**
       * Trunk volume (VDA standard)
       */
      Koffervda: number
      /**
       * Original trunk volume
       */
      Kofferurs: number
      /**
       * Vehicle length
       */
      Alaenge: number
      /**
       * Vehicle width
       */
      Abreite: number
      /**
       * Vehicle height
       */
      Ahoehe: number
      /**
       * Wheelbase
       */
      Radstand: number
      /**
       * Front track width
       */
      Spurv: number
      /**
       * Rear track width
       */
      Spurh: number
      /**
       * Turning circle
       */
      Wendekr: string
      /**
       * Curb weight
       */
      Werksgew: number
      /**
       * Gross vehicle weight
       */
      Gewichtges: number
      /**
       * Payload capacity
       */
      Zuladung: number
      /**
       * Front axle load
       */
      Achslastv: number
      /**
       * Rear axle load
       */
      Achslasth: number
      /**
       * Unbraked trailer load
       */
      Anhaengu: number
      /**
       * Braked trailer load (12% gradient)
       */
      Anhaengb12: number
      /**
       * Towball/tongue weight
       */
      Stuetzlast: number
      /**
       * Roof load capacity
       */
      Dachlast: number
      /**
       * Third-party liability insurance type 1
       */
      Typhk1: number
      /**
       * Comprehensive insurance type 1
       */
      Typvk1: number
      /**
       * Partial insurance type 1
       */
      Typtk1: number
      /**
       * Price in cents
       */
      PreisinCent: number
      /**
       * Oil change interval in kilometers
       */
      Oelwechskm: number
      /**
       * Labor value class
       */
      AwKl: number
      /**
       * Inspection interval in kilometers
       */
      Inspektkm: number
      /**
       * Warranty period in years
       */
      Garantjahr: number
      /**
       * Labor value group
       */
      AwGr: number
      /**
       * Rust perforation warranty in years
       */
      Rostjahr: number
      /**
       * Comprehensive insurance annual cost in Euro
       */
      VollkaskoJahrEuroSUM: string
      /**
       * Partial coverage insurance annual cost in Euro
       */
      TeilkaskoJahrEuroSUM: string
      /**
       * Partial coverage insurance total sum in Euro
       */
      TeilkaskoSumEuroSUM: string
      /**
       * Tax cost in Euro
       */
      SteuerEuroSUM: string
      /**
       * Operating costs in Euro
       */
      BetriebskEuroSUM: string
      /**
       * Depreciation/value loss sum
       */
      WertverlustSUM: string
      /**
       * Operating costs with value loss over 15k km/year in Euro
       */
      BkMwv15EuroSUM: string
      /**
       * Operating costs without value loss over 15k km/year in Euro
       */
      BkOwv15EuroSUM: string
      /**
       * ESP safety features
       */
      ESPSicherheiten: string
      /**
       * ESP price in Euro
       */
      ESPPREISEURO: string
      /**
       * Side airbag front (availability)
       */
      SAIRBAGVORN: number
      /**
       * Front side airbag price in Euro
       */
      SAIRBAGVORNPREISEURO: string
      /**
       * Rear side airbag (availability)
       */
      SAIRBAGHINTEN: number
      /**
       * Rear side airbag price in Euro
       */
      SAIRBAGHINTENPREISEURO: string
      /**
       * Head airbag front (availability)
       */
      KAIRBAGVORN: string
      /**
       * Front head airbag price in Euro
       */
      KAIRBAGVORNPREISEURO: string
      /**
       * Fuel type/variant
       */
      Vart: string
      /**
       * Maximum speed in km/h
       */
      Vmax: number
      /**
       * Model series
       */
      Baureihe: string
      /**
       * Body/vehicle category sort order
       */
      AkSort: number
      /**
       * Production period start
       */
      BauzeitVon: string
      /**
       * Drive type
       */
      Antriebtyp: string
      /**
       * Drive configuration (FWD, RWD, AWD, etc.)
       */
      Antrieb: string
      /**
       * Optional automatic transmission
       */
      OptAutom: string
      /**
       * Forced induction (turbo, supercharger, etc.)
       */
      Aufladung: string
      /**
       * Future model flag
       */
      zukunft: string
      /**
       * Tuner/modifier company
       */
      Tuner: string
      /**
       * Liability insurance annual cost in Euro
       */
      HaftpflichtJahrEuroSUM: string
      /**
       * Fuel costs in Euro
       */
      TreibstKostEuroSUM: string
      /**
       * Fixed costs in Euro
       */
      FixkostenEuroSUM: string
      /**
       * Cost per 100km in Euro
       */
      Ver100EuroSUM: string
      /**
       * Non-conventional drive
       */
      NOKANTRIEB: string
      /**
       * Fuel tank capacity in liters
       */
      Tankinhalt: number
      /**
       * Vehicle class
       */
      KFZKlasse: string
      /**
       * Generation identifier
       */
      GenerationID: string
      /**
       * Energy efficiency class
       */
      Effizienzklasse: string
      /**
       * Charging time (for electric vehicles)
       */
      Aufladezeit: string
      /**
       * Range in km
       */
      Reichweite: string
      /**
       * Base model
       */
      BasisModell: string
      /**
       * Mixed operation/hybrid mode
       */
      GemischterBetrieb: string
      /**
       * Price date
       */
      PreisDatum: string
      /**
       * Number of motors/engines
       */
      AnzahlMotoren: number
      /**
       * Hybrid type
       */
      Hybrid: string
      /**
       * Rear end type
       */
      Heckart: string
      /**
       * Hybrid classification
       */
      KlassifizierungHybrid: string
      /**
       * Creation date
       */
      Created: string
      /**
       * Tuner base model
       */
      Tuner_Basismodell: number
      /**
       * Gear ratio 1
       */
      Ue1: string
      /**
       * Gear ratio 2
       */
      Ue2: string
      /**
       * Gear ratio 3
       */
      Ue3: string
      /**
       * Gear ratio 4
       */
      Ue4: string
      /**
       * Gear ratio 5
       */
      Ue5: string
      /**
       * Gear ratio 6
       */
      Ue6: string
      /**
       * Gear ratio 7
       */
      Ue7: string
      /**
       * Gear ratio 8
       */
      Ue8: string
      /**
       * Gear ratio 9
       */
      Ue9: string
      /**
       * Gear ratio 10
       */
      Ue10: string
      /**
       * Ground clearance
       */
      BODENFREIHEIT: string
      /**
       * Rear departure angle
       */
      HBOESCHW: string
      /**
       * Maximum gradient/climbing ability
       */
      MAXSTEIG: string
      /**
       * Ramp angle
       */
      RAMPENW: string
      /**
       * Front approach angle
       */
      VBOESCHW: string
      /**
       * Wading depth
       */
      WATTIEFE: string
      /**
       * Gross energy content (for batteries)
       */
      EnergiegehaltBrutto: string
      /**
       * Classification by Auto Motor und Sport
       */
      KlassifizierungAMS: string
      /**
       * Classification by Sport Auto
       */
      KlassifizierungSPA: string
      /**
       * Classification by Motor Klassik
       */
      KlassifizierungMKL: string
      /**
       * Classification by 4Wheel Fun
       */
      Klassifizierung4WF: string
      /**
       * Editorial approval
       */
      FreigabeRedaktionen: string
      /**
       * Used car prices
       */
      Gebrauchtwagenpreise: string
      /**
       * Additional seats
       */
      AnzahlSitzeZusaetzlich: string
      /**
       * Drag coefficient
       */
      LuftwiderstandCW: string
      /**
       * Frontal area drag coefficient
       */
      LuftwiderstandCWA: string
      /**
       * Drag resistance index
       */
      LuftwiderstandIndex: string
      /**
       * Combustion process
       */
      Verbrennungsverfahren: string
      /**
       * Camshaft drive system
       */
      NockenwellenAntrieb: string
      /**
       * Dry sump lubrication
       */
      Trockensumpfschmierung: string
      /**
       * Cooling system
       */
      Kuehlsystem: string
      /**
       * Engine installation location
       */
      EinbauortMotoren: string
      /**
       * Engine type 1
       */
      MotorTyp1: string
      /**
       * Engine type 2
       */
      MotorTyp2: string
      /**
       * Power output
       */
      Leistung: string
      /**
       * Electric motor torque
       */
      DrehmomentElektromotor: string
      /**
       * Battery type/construction
       */
      BatterieBauart: string
      /**
       * Total nominal voltage
       */
      NennspannungGesamt: string
      /**
       * System power in kilowatts
       */
      SystemleistungKW: string
      /**
       * System power in horsepower
       */
      SystemleistungPS: string
      /**
       * System torque
       */
      SystemleistungDrehmoment: string
      /**
       * Front differential lock type
       */
      DifferentialsperrenBauartVorne: string
      /**
       * Center differential lock type
       */
      DifferentialsperrenBauartMitte: string
      /**
       * Rear differential lock type
       */
      DifferentialsperrenBauartHinten: string
      /**
       * Clutch type
       */
      KupplungBauart: string
      /**
       * Clutch operation
       */
      KupplungBetaetigung: string
      /**
       * Front suspension type
       */
      AufhaengungVorneTyp: string
      /**
       * Rear suspension type
       */
      AufhaengungHintenTyp: string
      /**
       * Front material
       */
      WerkstoffVorne: string
      /**
       * Rear material
       */
      WerkstoffHinten: string
      /**
       * Theoretical range
       */
      TheoretischeReichweite: string
      /**
       * Hydrocarbon emissions
       */
      AusstossHC: string
      /**
       * Stationary noise level
       */
      Standgeraeusch: string
      /**
       * Driving noise level
       */
      Fahrgeraeusch: string
      /**
       * Price in Deutsche Mark (historical)
       */
      PreisinDM: string
      /**
       * Fuel consumption at 90 km/h
       */
      Verbrauch90kmh: string
      /**
       * Fuel consumption at 120 km/h
       */
      Verbrauch120kmh: string
      /**
       * City fuel consumption
       */
      VerbrauchStadt: string
      /**
       * Average fuel consumption
       */
      VerbrauchMittel: string
      /**
       * External width including mirrors
       */
      AussenbreiteMitSpiegeln: string
      /**
       * Motor 2 installation location
       */
      EinbauortMotor2: string
      /**
       * Motor 2 continuous power
       */
      DauerleistungMotor2: string
      /**
       * Motor 2 maximum power
       */
      MaximalleistungMotor2: string
      /**
       * Motor 2 torque
       */
      DrehmomentMotor2: string
      /**
       * Motor 3 installation location
       */
      EinbauortMotor3: string
      /**
       * Motor 3 continuous power
       */
      DauerleistungMotor3: string
      /**
       * Motor 3 maximum power
       */
      MaximalleistungMotor3: string
      /**
       * Motor 3 torque
       */
      DrehmomentMotor3: string
      /**
       * Motor 4 installation location
       */
      EinbauortMotor4: string
      /**
       * Motor 4 continuous power
       */
      DauerleistungMotor4: string
      /**
       * Motor 4 maximum power
       */
      MaximalleistungMotor4: string
      /**
       * Motor 4 torque
       */
      DrehmomentMotor4: string
      /**
       * Total power of electric motors
       */
      GesamtleistungElektromotoren: string
      /**
       * Total torque of electric motors
       */
      GesamtdrehmomentElektromotoren: string
      /**
       * Pure electric range
       */
      ReichweiteReinElektrisch: string
      /**
       * Net energy content (for batteries)
       */
      EnergiegehaltNetto: string
      /**
       * Charging time from household socket (minimum)
       */
      AufladezeitHaushaltssteckdoseVon: string
      /**
       * Charging time from household socket (maximum)
       */
      AufladezeitHaushaltssteckdoseBis: string
      /**
       * Charging time with 400 Volt
       */
      Aufladezeit400Volt: string
      /**
       * Fast charging time
       */
      AufladezeitSchnelladung: string
      /**
       * Electricity consumption
       */
      VerbrauchStrom: string
      /**
       * Manufacturer's country
       */
      HerstellerLand: string
      /**
       * Manufacturer's form of address
       */
      HerstellerAnrede: string
      /**
       * Manufacturer's designation
       */
      HerstellerBezeichnung: string
      /**
       * Manufacturer's street address
       */
      HerstellerStrasse: string
      /**
       * Manufacturer's postal code
       */
      HerstellerPLZ: string
      /**
       * Manufacturer's city
       */
      HerstellerOrt: string
      /**
       * Manufacturer's contact person
       */
      HerstellerPartner: string
      /**
       * Manufacturer's phone number
       */
      HerstellerTelefon: string
      /**
       * Manufacturer's secondary contact person
       */
      HerstellerPartner2: string
      /**
       * Manufacturer's secondary phone number
       */
      HerstellerTelefon2: string
      /**
       * Manufacturer's fax number
       */
      HerstellerFax: string
      /**
       * Importer's form of address
       */
      ImporteurAnrede: string
      /**
       * Importer's name
       */
      ImporteurName: string
      /**
       * Importer's street address
       */
      ImporteurStrasse: string
      /**
       * Importer's postal code
       */
      ImporteurPLZ: string
      /**
       * Importer's city
       */
      ImporteurOrt: string
      /**
       * Importer's contact person
       */
      ImporteurPartner: string
      /**
       * Importer's phone number
       */
      ImporteurTelefon: string
      /**
       * Importer's secondary contact person
       */
      ImporteurPartner2: string
      /**
       * Importer's secondary phone number
       */
      ImporteurTelefon2: string
      /**
       * Importer's fax number
       */
      ImporteurFax: string
      /**
       * Contracted dealers
       */
      Vertragshaendler: string
      /**
       * Labor cost price
       */
      ArbeitswertPreis: string
      /**
       * Generation name
       */
      GenerationName: string
      /**
       * Production end date
       */
      BauzeitBis: string
      /**
       * Vehicle type designation
       */
      TypBezeichnungFahrzeuge: string
      /**
       * Schwacke ID
       */
      SchwackeID: string
      /**
       * Generation type designation
       */
      TypBezeichnungGeneration: string
      /**
       * Pre-entry/preliminary input
       */
      Vorabeingabe: string
      /**
       * Manufacturer name (JATO)
       */
      HerstellerNameJATO: string
      /**
       * Series name (JATO)
       */
      BaureiheNameJATO: string
      /**
       * Model name (JATO)
       */
      ModellNameJATO: string
      /**
       * Vehicle ID (JATO)
       */
      FahrzeugIDJATO: string
      /**
       * Serial number (JATO)
       */
      SLNRJATO: string
      /**
       * Production year (JATO)
       */
      BaujahrJATO: string
      /**
       * Production end (JATO)
       */
      BauendeJATO: string
      /**
       * Type designation (JATO)
       */
      TypBezeichnungJATO: string
      /**
       * Equipment/trim (JATO)
       */
      AusstattungJATO: string
      /**
       * Manufacturer key number (JATO)
       */
      HSNJATO: string
      /**
       * Type key number (JATO)
       */
      TSNJATO: string
      /**
       * Generation number (JATO)
       */
      GenerationNummerJATO: string
      /**
       * Cylinder angle
       */
      Zylinderwinkel: string
      /**
       * Crankshaft bearings
       */
      Kurbelwellenlager: string
      /**
       * Balance shafts
       */
      Ausgleichswellen: string
      /**
       * Variable camshaft timing - intake
       */
      VariablenNockenwellensteuerEinlass: string
      /**
       * Variable camshaft timing - exhaust
       */
      VariablenNockenwellensteuerAuslass: string
      /**
       * Valve clearance adjustment
       */
      Ventilspielausgleich: string
      /**
       * Ignition system
       */
      Zuendung: string
      /**
       * Number of catalytic converters
       */
      AnzahlKatalysatoren: string
      /**
       * Fan control system
       */
      Ventilatorsteuerung: string
      /**
       * Oil cooler
       */
      Oelkuehler: string
      /**
       * Start-stop system
       */
      StartStop: string
      /**
       * Bore and stroke
       */
      BohrungHub: string
      /**
       * Maximum torque at maximum RPM
       */
      MaximalesDrehmomentMaximaleDrehzahl: string
      /**
       * Mean effective pressure at maximum power
       */
      MitteldruckMaximaleLeistung: string
      /**
       * Mean effective pressure at maximum torque
       */
      MitteldruckMaximalesDrehmoment: string
      /**
       * Alternator type
       */
      LichtmaschineArt: string
      /**
       * Alternator power
       */
      LichtmaschineLeistung: string
      /**
       * Alternator current
       */
      LichtmaschineStromstaerke: string
      /**
       * Battery voltage
       */
      BatterieSpannung: string
      /**
       * Battery capacity
       */
      BatterieKapazitaet: string
      /**
       * Mixture preparation/fuel system
       */
      Gemischaufbereitung: string
      /**
       * Carburetor type
       */
      VergaserBauart: string
      /**
       * Carburetor manufacturer
       */
      VergaserHerstellerName: string
      /**
       * Carburetor model
       */
      VergaserTyp: string
      /**
       * Carburetor control
       */
      Vergasersteuerung: string
      /**
       * Cold start regulation
       */
      KaltstartRegelung: string
      /**
       * Maximum injection pressure
       */
      MaximalerEinspritzdruck: string
      /**
       * Number of chargers/turbos
       */
      AnzahlLader: string
      /**
       * Charger/turbo type
       */
      LaderTyp: string
      /**
       * Intercooler
       */
      Ladeluftkuehler: string
      /**
       * Variable boost
       */
      VariableAufladung: string
      /**
       * Variable geometry turbo
       */
      VariableGeometrie: string
      /**
       * Number of batteries
       */
      AnzahlBatterienAkkus: string
      /**
       * Battery installation location
       */
      EinbauortBatterien: string
      /**
       * Energy requirement in city cycle
       */
      EnergiebedarfStadtzyklus: string
      /**
       * Flywheel energy storage
       */
      Schwungradspeicher: string
      /**
       * RPM
       */
      Drehzahl: string
      /**
       * Short-term power output
       */
      Kurzzeitleistung: string
      /**
       * Continuous short-term power
       */
      DauerKurzzeitleistung: string
      /**
       * Regenerative braking
       */
      Nutzbremsung: string
      /**
       * Number of cells
       */
      AnzahlZellen: string
      /**
       * Individual module voltage
       */
      EinzelspannungModule: string
      /**
       * Battery total weight
       */
      BatterieGesamtgewicht: string
      /**
       * Traction control
       */
      Antriebsschlupfregelung: string
      /**
       * Drive torque distribution
       */
      VerteilungAntriebsmoment: string
      /**
       * Front drive torque
       */
      AntriebsmomentVorne: string
      /**
       * Front drive torque distribution
       */
      VerteilungAntriebsmomentVorne: string
      /**
       * Rear drive torque distribution
       */
      VerteilungAntriebsmomentHinten: string
      /**
       * Front drive torque distribution upper limit
       */
      VerteilungAntriebsmomentVorneBis: string
      /**
       * Rear drive torque distribution upper limit
       */
      VerteilungAntriebsmomentHintenBis: string
      /**
       * Front differential lock percentage
       */
      DifferentialsperrenBauartVorneProzent: string
      /**
       * Center differential lock percentage
       */
      DifferentialsperrenBauartMitteProzent: string
      /**
       * Rear differential lock percentage
       */
      DifferentialsperrenBauartHintenProzent: string
      /**
       * Torque converter lockup
       */
      KupplungWandelueberbrueckung: string
      /**
       * Reduction gearbox stages
       */
      ReduktionsgetriebeStufen: string
      /**
       * Reduction gearbox stage 1
       */
      ReduktionsgetriebeStufe1: string
      /**
       * Reduction gearbox stage 2
       */
      ReduktionsgetriebeStufe2: string
      /**
       * Optional shifting/transmission
       */
      OptionalSchaltung: string
      /**
       * Secondary axle drive
       */
      Achsantrieb2: string
      /**
       * Special gear ratio
       */
      UebersetzungGangS: string
      /**
       * Reverse gear ratio
       */
      UebersetzungGangR: string
      /**
       * Speed at 1000 RPM in 1st gear
       */
      Geschwindigkeit1000DrehzahlGang1: string
      /**
       * Speed at 1000 RPM in 2nd gear
       */
      Geschwindigkeit1000DrehzahlGang2: string
      /**
       * Speed at 1000 RPM in 3rd gear
       */
      Geschwindigkeit1000DrehzahlGang3: string
      /**
       * Speed at 1000 RPM in 4th gear
       */
      Geschwindigkeit1000DrehzahlGang4: string
      /**
       * Speed at 1000 RPM in 5th gear
       */
      Geschwindigkeit1000DrehzahlGang5: string
      /**
       * Speed at 1000 RPM in 6th gear
       */
      Geschwindigkeit1000DrehzahlGang6: string
      /**
       * Speed at 1000 RPM in 7th gear
       */
      Geschwindigkeit1000DrehzahlGang7: string
      /**
       * Speed at 1000 RPM in 8th gear
       */
      Geschwindigkeit1000DrehzahlGang8: string
      /**
       * Speed at 1000 RPM in 9th gear
       */
      Geschwindigkeit1000DrehzahlGang9: string
      /**
       * Speed at 1000 RPM in 10th gear
       */
      Geschwindigkeit1000DrehzahlGang10: string
      /**
       * Speed at rated RPM in 1st gear
       */
      GeschwindigkeitNenndrehzahlGang1: string
      /**
       * Speed at rated RPM in 2nd gear
       */
      GeschwindigkeitNenndrehzahlGang2: string
      /**
       * Speed at rated RPM in 3rd gear
       */
      GeschwindigkeitNenndrehzahlGang3: string
      /**
       * Speed at rated RPM in 4th gear
       */
      GeschwindigkeitNenndrehzahlGang4: string
      /**
       * Speed at rated RPM in 5th gear
       */
      GeschwindigkeitNenndrehzahlGang5: string
      /**
       * Speed at rated RPM in 6th gear
       */
      GeschwindigkeitNenndrehzahlGang6: string
      /**
       * Speed at rated RPM in 7th gear
       */
      GeschwindigkeitNenndrehzahlGang7: string
      /**
       * Speed at rated RPM in 8th gear
       */
      GeschwindigkeitNenndrehzahlGang8: string
      /**
       * Speed at rated RPM in 9th gear
       */
      GeschwindigkeitNenndrehzahlGang9: string
      /**
       * Speed at rated RPM in 10th gear
       */
      GeschwindigkeitNenndrehzahlGang10: string
      /**
       * Number of control arms front
       */
      AnzahlLenkerVorne: string
      /**
       * Number of control arms rear
       */
      AnzahlLenkerHinten: string
      /**
       * Adjustable suspension
       */
      EinstellbaresFahrwerk: string
      /**
       * Active suspension
       */
      AktivesFahrwerk: string
      /**
       * Level control
       */
      Niveauregulierung: string
      /**
       * ABS manufacturer
       */
      ABSHerstellerName: string
      /**
       * ABS type
       */
      ABSTyp: string
      /**
       * Brake assist
       */
      Bremsassistent: string
      /**
       * Brake force limiter
       */
      Bremskraftbegrenzer: string
      /**
       * Front brakes design 1
       */
      BremsenVorneBauart1: string
      /**
       * Front brakes design 2
       */
      BremsenVorneBauart2: string
      /**
       * Front brakes material
       */
      BremsenVorneWerkstoff: string
      /**
       * Rear brakes design 1
       */
      BremsenHintenBauart1: string
      /**
       * Rear brakes design 2
       */
      BremsenHintenBauart2: string
      /**
       * Rear brakes material
       */
      BremsenHintenWerkstoff: string
      /**
       * ESP manufacturer
       */
      ESPHerstellerName: string
      /**
       * ESP type
       */
      ESPTyp: string
      /**
       * Steering type
       */
      LenkungTyp: string
      /**
       * Steering ratio 2
       */
      Lenkuebersetzung2: string
      /**
       * Variable steering ratio
       */
      VariableLenkuebersetzung: string
      /**
       * Front tire rolling circumference
       */
      ReifenAbrollumfangVorne: string
      /**
       * Front tire price
       */
      ReifenPreisVorne: string
      /**
       * Rear tire rolling circumference
       */
      ReifenAbrollumfangHinten: string
      /**
       * Rear tire price
       */
      ReifenPreisHinten: string
      /**
       * Number of sliding doors
       */
      AnzahlSchiebetueren: string
      /**
       * Optional door count
       */
      AnzahlTuerenOptional: string
      /**
       * Tailgate/trunk lid
       */
      Heckklappe: string
      /**
       * Material 1
       */
      Werkstoff1: string
      /**
       * Material 2
       */
      Werkstoff2: string
      /**
       * Body structure
       */
      Aufbau: string
      /**
       * Frame type
       */
      Rahmen: string
      /**
       * Variable rear seat
       */
      VariableRuecksitzbank: string
      /**
       * Maximum trunk volume (VDA method)
       */
      KofferraumvolumenVDAMax: string
      /**
       * Trunk volume with third row seats
       */
      KofferraumvolumenDritteRuecksitzbank: string
      /**
       * Trunk volume with convertible top open
       */
      KofferraumvolumenCabrioOffen: string
      /**
       * Trunk volume with rear seat folded (up to window line)
       */
      KofferraumvolumenUmgeklappterRuecksitzUnterkanteFenster: string
      /**
       * Power-to-weight ratio in kW/kg
       */
      LeistungsgewichtKW: string
      /**
       * Power-to-weight ratio in PS/kg
       */
      LeistungsgewichtPS: string
      /**
       * Maximum towed weight (braked) at 10% gradient
       */
      ZulaessigeAnhaengelastGebremstSteigung10Prozent: string
      /**
       * Maximum towed weight (braked) at 8% gradient
       */
      ZulaessigeAnhaengelastGebremstSteigung08Prozent: string
      /**
       * Maximum towed weight at gradient
       */
      ZulaessigeAnhaengelastSteigung: string
      /**
       * Maximum towed weight description
       */
      ZulaessigeAnhaengelastBeschreibung: string
      /**
       * Maximum train weight (vehicle + trailer)
       */
      ZulaessigesGesamtzuggewicht: string
      /**
       * Inspection interval in months
       */
      InspektionAnzahlMonate: string
      /**
       * Oil change interval in months
       */
      OelwechselAnzahlMonate: string
      /**
       * Service interval indicator
       */
      Serviceintervallanzeige: string
      /**
       * Mileage limit
       */
      KilometerBegrenzung: string
      /**
       * Warranty type
       */
      GewaehrleistungArt: string
      /**
       * Rust perforation treatment
       */
      DurchrostungNachbehandlung: string
      /**
       * Mobility guarantee in months
       */
      MobilitaetsgarantieAnzahlMonate: string
      /**
       * Paint warranty in months
       */
      LackgarantieAnzahlMonate: string
      /**
       * Speed in gear
       */
      GeschwindigkeitGang: string
      /**
       * Elasticity 60-100 km/h time
       */
      Elastizitaet60100: string
      /**
       * Elasticity 60-100 km/h gear
       */
      Elastizitaet60100Gang: string
      /**
       * Elasticity 80-120 km/h time
       */
      Elastizitaet80120: string
      /**
       * Elasticity 80-120 km/h gear
       */
      Elastizitaet80120Gang: string
      /**
       * Vehicle tax calculation
       */
      KFZSteuerberechnung: string
      /**
       * Top speed gear
       */
      HoechstgeschwindigkeitGang: string
      /**
       * Top speed RPM
       */
      HoechstgeschwindigkeitDrehzahl: string
      /**
       * 1 km acceleration time
       */
      Beschleunigung1km: string
      /**
       * Liability insurance latest classification
       */
      HaftpflichtLetzteEinstufung: string
      /**
       * Liability insurance previous classification
       */
      HaftpflichtVorletzteEinstufung: string
      /**
       * Liability insurance third-last classification
       */
      HaftpflichtDrittletzteEinstufung: string
      /**
       * Partial coverage insurance latest classification
       */
      TeilkaskoLetzteEinstufung: string
      /**
       * Partial coverage insurance previous classification
       */
      TeilkaskoVorletzteEinstufung: string
      /**
       * Partial coverage insurance third-last classification
       */
      TeilkaskoDrittletzteEinstufung: string
      /**
       * Comprehensive insurance latest classification
       */
      VollkaskoLetzteEinstufung: string
      /**
       * Comprehensive insurance previous classification
       */
      VollkaskoVorletzteEinstufung: string
      /**
       * Comprehensive insurance third-last classification
       */
      VollkaskoDrittletzteEinstufung: string
      /**
       * CO limit value
       */
      GrenzwertCO: string
      /**
       * HC limit value
       */
      GrenzwertHC: string
      /**
       * NOX limit value
       */
      GrenzwertNOX: string
      /**
       * Price history
       */
      Preishistorie: string
      /**
       * Cooling system for motors 02
       */
      KuehlsystemMotoren02: string
      /**
       * Manufacturer ID (MPS)
       */
      HerstellerID_MPS: number
      /**
       * Series ID (MPS)
       */
      BaureiheID_MPS: number
      /**
       * Model ID (MPS)
       */
      ModellID_MPS: number
      /**
       * Vehicle ID (MPS)
       */
      FahrzeugID_MPS: number
      /**
       * Generation number
       */
      GenerationNummer: string
      /**
       * Future generation flag
       */
      Zukunftsgeneration: string
      /**
       * Type designation
       */
      TypBezeichnung: string
      /**
       * Electronic stability program
       */
      ESP: string
      /**
       * Generation number for vehicles
       */
      GenerationNummerFahrzeuge: string
      /**
       * Vehicle generation number
       */
      FahrzeugGenerationNummer: string
      /**
       * Secondary fuel tank capacity
       */
      TankinhaltSekundaerkraftstoff: string
      /**
       * AdBlue tank capacity
       */
      TankinhaltAdBlue: string
      /**
       * WLTP low consumption
       */
      VerbrauchLowWLTP: string
      /**
       * WLTP medium consumption
       */
      VerbrauchMediumWLTP: string
      /**
       * WLTP high consumption
       */
      VerbrauchHighWLTP: string
      /**
       * WLTP extra high consumption
       */
      VerbrauchExtraHighWLTP: string
      /**
       * WLTP total consumption
       */
      VerbrauchGesamtWLTP: string
      /**
       * WLTP electricity consumption
       */
      VerbrauchStromWLTP: string
      /**
       * WLTP theoretical range
       */
      TheoretischeReichweiteWLTP: string
      /**
       * WLTP CO2 emissions
       */
      AusstossCO2WLTP: string
      /**
       * WLTP CO emissions
       */
      AusstossCOWLTP: string
      /**
       * WLTP HC emissions
       */
      AusstossHCWLTP: string
      /**
       * WLTP NOX emissions
       */
      AusstossNOXWLTP: string
      /**
       * WLTP HC+NOX emissions
       */
      AusstossHCNOXWLTP: string
      /**
       * WLTP particulate emissions
       */
      AusstossPartikelWLTP: string
      /**
       * Make/brand name
       */
      Marke_Name: string
      /**
       * Series name
       */
      Baureihe_Name: string
      /**
       * Generation name
       */
      Generation_Name: string
      /**
       * Generation type
       */
      Generation_Typ: string
      /**
       * Model name
       */
      Modell_Name: string
    }
  }[]
}

/**
 * Represents the structure of the page data used in scraping.
 */
export interface PageData {
  props: {
    pageProps: {
      pageData: {
        data: {
          mobile: (
            | PageDataMakes
            | PageDataModels
            | PageDataGenerations
            | PageDataTechSheets
          )[]
        }
      }
    }
  }
}

export type OutputTree = {
  make: Make
  models: Array<
    Model & {
      generations: Generation[]
    }
  >
}
