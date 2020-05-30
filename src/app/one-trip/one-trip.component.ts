import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileRetrievalServiceService } from '../profile-retrieval-service.service';
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { CoordsServiceService } from '../coords-service.service';
import { CityActivityService } from '../city-activity.service';

@Component({
  selector: 'app-one-trip',
  templateUrl: './one-trip.component.html',
  styleUrls: ['./one-trip.component.css']
})
export class OneTripComponent implements OnInit {
  userid: any;
  userName: string;
  userTrips: any;
  modalOn: boolean;
  somethingelse: any = "hello";
  objectData = [];
  countryCityData: any;
  coordsList = [];
  tripId: any;

  countrycodes: any = {
    'Afghanistan': "AF", "Aland Islands": "AX", 'Albania': "AL", 'Algeria': "DZ", 'American Samoa': "AS", 'Andorra': "AD", 'Angola': "AO",
    'Anguilla': "AI", 'Antarctica': "AQ", 'Antigua And Barbuda': "AG", 'Argentina': "AR", 'Armenia': "AM", 'Aruba': "AW", 'Australia': "AU", 'Austria': "AT", 'Azerbaijan': "AZ",
    'Bahamas': "BS", 'Bahrain': "BH", 'Bangladesh': "BD", 'Barbados': "BB", 'Belarus': "BY", 'Belgium': "BE", 'Belize': "BZ", 'Benin': "BJ", 'Bermuda': "BM",
    'Bhutan': "BT", 'Bolivia': "BO", 'Bosnia And Herzegovina': "BA", 'Botswana': "BW", 'Bouvet Island': "BV", 'Brazil': "BR", 'British Indian Ocean Territory': "IO",
    'Brunei Darussalam': "BN", 'Bulgaria': "BG", 'Burkina Faso': "BF", 'Burundi': "BI", 'Cambodia': "KH", 'Cameroon': "CM", 'Canada': "CA", 'Cape Verde': "CV",
    'Cayman Islands': "KY", 'Central African Republic': "CF", 'Chad': "TD", 'Chile': "CL", 'China': "CN", 'Christmas Island': "CX", 'Cocos (Keeling) Islands': "CC", 'Colombia': "CO",
    'Comoros': "KM", 'Congo': "CG", 'Congo, Democratic Republic': "CD", 'Cook Islands': "CK", 'Costa Rica': "CR", "Cote D'Ivoire": "CI", 'Croatia': "HR", 'Cuba': "CU",
    'Cyprus': "CY", 'Czech Republic': "CZ", 'Denmark': "DK", 'Djibouti': "DJ", 'Dominica': "DM", 'Dominican Republic': "DO", 'Ecuador': "EC", 'Egypt': "EG", 'El Salvador': "SV",
    'Equatorial Guinea': "GQ", 'Eritrea': "ER", 'Estonia': "EE", 'Ethiopia': "ET", 'Falkland Islands (Malvinas)': "FK", 'Faroe Islands': "FO", 'Fiji': "FJ",
    'Finland': "FI", 'France': "FR", 'French Guiana': "GF", 'French Polynesia': "PF", 'French Southern Territories': "TF", 'Gabon': "GA", 'Gambia': "GM", 'Georgia': "GE",
    'Germany': "DE", 'Ghana': "GH", 'Gibraltar': "GI", 'Greece': "GR", 'Greenland': "GL", 'Grenada': "GD", 'Guadeloupe': "GP", 'Guam': "GU", 'Guatemala': "GT",
    'Guernsey': "GG", 'Guinea': "GN", 'Guinea-Bissau': "GW", 'Guyana': "GY", 'Haiti': "HT", 'Heard Island & Mcdonald Islands': "HM", 'Holy See (Vatican City State)': "VA",
    'Honduras': "HN", 'Hong Kong': "HK", 'Hungary': "HU", 'Iceland': "IS", 'India': "IN", 'Indonesia': "ID", 'Iran, Islamic Republic Of': "IR", 'Iraq': "IQ",
    'Ireland': "IE", 'Isle Of Man': "IM", 'Israel': "IL", 'Italy': "IT", 'Jamaica': "JM", 'Japan': "JP", 'Jersey': "JE", 'Jordan': "JO", 'Kazakhstan': "KZ",
    'Kenya': "KE", 'Kiribati': "KI", 'Korea': "KR", 'Kuwait': "KW", 'Kyrgyzstan': "KG", "Lao People's Democratic Republic": "LA", 'Latvia': "LV", 'Lebanon': "LB",
    'Lesotho': "LS", 'Liberia': "LR", 'Libyan Arab Jamahiriya': "LY", 'Liechtenstein': "LI", 'Lithuania': "LT", 'Luxembourg': "LU", 'Macao': "MO",
    'Macedonia': "MK", 'Madagascar': "MG", 'Malawi': "MW", 'Malaysia': "MY", 'Maldives': "MV", 'Mali': "ML", 'Malta': "MT", 'Marshall Islands': "MH", 'Martinique': "MQ",
    'Mauritania': "MR", 'Mauritius': "MU", 'Mayotte': "YT", 'Mexico': "MX", 'Micronesia, Federated States Of': "FM", 'Moldova': "MD", 'Monaco': "MC", 'Mongolia': "MN",
    'Montenegro': "ME", 'Montserrat': "MS", 'Morocco': "MA", 'Mozambique': "MZ", 'Myanmar': "MM", 'Namibia': "NA", 'Nauru': "NR", 'Nepal': "NP", 'Netherlands': "NL",
    'Netherlands Antilles': "AN", 'New Caledonia': "NC", 'New Zealand': "NZ", 'Nicaragua': "NI", 'Niger': "NE", 'Nigeria': "NG", 'Niue': "NU", 'Norfolk Island': "NF",
    'Northern Mariana Islands': "MP", 'Norway': "NO", 'Oman': "OM", 'Pakistan': "PK", 'Palau': "PW", 'Palestinian Territory, Occupied': "PS", 'Panama': "PA",
    'Papua New Guinea': "PG", 'Paraguay': "PY", 'Peru': "PE", 'Philippines': "PH", 'Pitcairn': "PN", 'Poland': "PL", 'Portugal': "PT", 'Puerto Rico': "PR",
    'Qatar': "QA", 'Reunion': "RE", 'Romania': "RO", 'Russian Federation': "RU", 'Rwanda': "RW", 'Saint Barthelemy': "BL", 'Saint Helena': "SH",
    'Saint Kitts And Nevis': "KN", 'Saint Lucia': "LC", 'Saint Martin': "MF", 'Saint Pierre And Miquelon': "PM", 'Saint Vincent And Grenadines': "VC", 'Samoa': "WS",
    'San Marino': "SM", 'Sao Tome And Principe': "ST", 'Saudi Arabia': "SA", 'Senegal': "SN", 'Serbia': "RS", 'Seychelles': "SC", 'Sierra Leone': "SL",
    'Singapore': "SG", 'Slovakia': "SK", 'Slovenia': "SI", 'Solomon Islands': "SB", 'Somalia': "SO", 'South Africa': "ZA", 'South Georgia And Sandwich Isl.': "GS",
    'Spain': "ES", 'Sri Lanka': "LK", 'Sudan': "SD", 'Suriname': "SR", 'Svalbard And Jan Maye': "SJ", 'Swaziland': "SZ", 'Sweden': "SE", 'Switzerland': "CH",
    'Syrian Arab Republic': "SY", 'Taiwan': "TW", 'Tajikistan': "TJ", 'Tanzania': "TZ", 'Thailand': "TH", 'Timor-Leste': "TL", 'Togo': "TG", 'Tokelau': "TK",
    'Tonga': "TO", 'Trinidad And Tobago': "TT", 'Tunisia': "TN", 'Turkey': "TR", 'Turkmenistan': "TM", 'Turks And Caicos Islands': "TC", 'Tuvalu': "TV",
    'Uganda': "UG", 'Ukraine': "UA", 'United Arab Emirates': "AE", 'United Kingdom': "GB", 'United States': "US", 'United States Outlying Islands': "UM",
    'Uruguay': "UY", 'Uzbekistan': "UZ", 'Vanuatu': "VU", 'Venezuela': "VE", 'Vietnam': "VN", 'Virgin Islands, British': "VG", 'Virgin Islands, U.S.': "VI",
    'Wallis And Futuna': "WF", 'Western Sahara': "EH", 'Yemen': "YE", 'Zambia': "ZM", 'Zimbabwe': "ZW"
  };

  constructor(private _router: Router, private route: ActivatedRoute, private profServe: ProfileRetrievalServiceService,
    private coordService: CoordsServiceService, private cityActiveServ: CityActivityService) {
    this.userid = window.history.state['userid'];
    this.route.queryParams.subscribe(params => {
      this.userid = params['userid'];
    });

  }

  getUserTrips() {
    this.profServe.getAllUserTrips(this.userid).subscribe(data => {
      this.userTrips = data;
    });
  }

  getProfileInfo() {
    this.profServe.getUserName(this.userid).subscribe(data => {
      this.userName = data;
    });
  }

  ngOnInit() {
    console.log("This is where it messes up");
    this.getProfileInfo();
    this.getUserTrips();
    this.modalOn = false;
  }

  openModal() {
    this.modalOn = !this.modalOn;
  }

  parentMethod(data) {
    console.log(data);
    this.modalOn = data;
  }

  parentInput(data) {
    this.profServe.submitUserTrip(this.userid, data).subscribe((data: any) => {
      var info = data.body;
      this.tripId = info.id;
      this.ngOnInit();
    });

    console.log("The 'data' that we are getting: ", data);
    //Get something back and based on that either keep going or dont? 
    if (this.countrycodes[data]) {
      console.log("it Let us in");
      this.cityActiveServ.getCityData(this.countrycodes[data]).subscribe(data => {
        this.countryCityData = data;

        for (var cityIndex in this.countryCityData.records) {
          var cityInfo = this.countryCityData.records[cityIndex].fields
          this.objectData[cityIndex] = { city: cityInfo.city, population: cityInfo.population, longitude: cityInfo.longitude, latitude: cityInfo.latitude };
        }

        for (var coordData in this.objectData) {
          console.log(this.objectData[coordData]);

          this.coordsList[coordData] = {
            tripId: this.tripId, poi: this.objectData[coordData].city, note: this.objectData[coordData].population,
            latitude: this.objectData[coordData].latitude, longitude: this.objectData[coordData].longitude
          };
        }
        this.coordService.saveCoords(this.coordsList).subscribe(data => {
        });
      });
    }
    this.modalOn = false;
  }


  deleteTrip(obj) {
    console.log(obj);
    this.profServe.deleteTrip(obj).subscribe(data => {
      this.ngOnInit();
    });

  }

  openTripPage(data) {
    this._router.navigate(['singletrip']);
    sessionStorage.setItem("stuff", JSON.stringify(data));
  }

}
