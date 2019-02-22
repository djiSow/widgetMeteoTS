import *  as React from "react";
import { WidgetProps } from "@talentsoft-opensource/integration-widget-contract"
import '../asset/widget.less'; 
import '../asset/image/logo-soleil.png';


interface Weather {
    name: string;
    temp: number;
    sky: string;
    desc:string;
    country:string;
}

interface WidgetState {
    data:Weather[];
    textvalue:string;
    test:string;
}

export class Widget extends React.Component<WidgetProps,WidgetState> {
    constructor(props: WidgetProps) {
        super(props);
        this.defineActionHeaders(); 
        this.state = { 
            data:[],
            textvalue : "",
            test:"" 
        }
    }
    
    componentDidMount(){
        this.loadCities();
    }

    loadCities() {
        this.getweather('Paris');
        this.getweather('London');

        const {myTSHostService} = this.props;
        myTSHostService.setDataIsLoaded();
    }

    public async getweather(city:string) {
        const {myTSHostService} = this.props;
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        let queryString = `?q=${city}&units=metric&appid=7848d30cce738e7887f77f176bb76f2c`;
       
        const response = await myTSHostService.requestExternalResource({verb: 'GET', url: url + queryString });

        if (response !== null){
            let data = [];
            try {
                data = JSON.parse(response.body);
            } 
            catch (e) {
                console.log(e);
            }  
            if (data.cod === 200){
                let weather:Weather= {
                    name:data.name,
                    temp:data.main.temp,
                    sky:data.weather[0].icon,
                    desc:data.weather[0].main,
                    country:data.sys.country,
                };
                    
                this.setState(prevState => ({
                    data: [...prevState.data, weather]
                }));
            }
            else {
                console.warn(city + ": " + data.message);
            }
        }
        else {
            alert("this city may not exist try again...")
        }
    }

    defineActionHeaders() {
        const {myTSHostService} = this.props;
        // Set to true to define your widget Logo as enlargeable
        myTSHostService.setHeaderActionConfiguration({enlargeable: false});
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ textvalue: e.target.value });
        console.log(e)
    }

    upperCaseF = (a:string) => {
        return a.charAt(0).toUpperCase() +a.slice(1);
    }

    getRandomTemp = (max: number) => {
        return Math.floor(Math.random() * Math.floor(max));
    } 
    
    remove(idx: number) {  
        // Concatening original items array returns new array - this is important!
        const items : Weather[] = this.state.data;
        items.splice(idx, 1);
        this.setState({data: items});
    }

    //récupère la donnée entrée dans le textvalue et la push dans le array 
    handleAddTodoItem = () => {
        let city = this.upperCaseF(this.state.textvalue);
        if (city !== "" && !this.state.data.find(c => c.name === city)) {
            this.getweather(city);
        }
    }


    public render() {
        const items = this.state.data.map((item:Weather, i:number) => {
            let urlImage = 'http://openweathermap.org/img/w/' + item.sky + '.png';

            return (
                <tr key={i}>
                    <td title={item.country}>{item.name}</td> 
                    <td>{Math.round(item.temp)+'°C'}</td>
                    <td title={item.desc}> 
                        <img src={urlImage} id='myimage'/>
                    </td>
                    <td>
                        <button onClick={() => this.remove(i) }>
                            <i className="icon-trash" />
                        </button>
                    </td>    
                </tr>
            );
        }); 
             
        return (
            <div>
                <div className="input-city">
                    <input type="text" placeholder="ex : dublin" className="inner-div" onChange={this.handleChange}  />
                    <button className="addButton" onClick={this.handleAddTodoItem}> 
                        <i className="icon-add"/>
                    </button>
                </div>

                <div className="weather-cities">
                    <table className="weather-table">
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>Temperature</th>
                                <th>Weather</th>
                                <th>Cancel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items}
                        </tbody>
                    </table>              
                </div>
            </div>
        );      
    }
}
