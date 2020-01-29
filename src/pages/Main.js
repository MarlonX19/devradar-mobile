import React, { useEffect, useState } from 'react';
import { StyleSheet, PermissionsAndroid, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import api from '../services/api';


export default function Main(props) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('')


    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs,
            }
        });
        setDevs(response.data.devs)
    }

    function handleRegionChanged(region) {
        setCurrentRegion(region)
    }


    async function loadInitialPosition() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão de localização',
                    message:
                        'Necessário para funcionar',
                    buttonNeutral: 'Depois',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    ({ coords: { latitude, longitude } }) => {
                        setCurrentRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.04,
                            longitudeDelta: 0.04,
                        })
                    },
                    (error) => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
                );

            } else {
                console.log('Fine Location permission denied');
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    useEffect(() => {
        loadInitialPosition();

    }, [])

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} style={styles.map} initialRegion={currentRegion}>
                {devs.map(dev => (
                    <Marker
                        key={dev._id}
                        coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => props.navigation.navigate('Profile', { github_username: dev.github_username })}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Procurar devs por tecnologias'
                    placeholderTextColor='#999'
                    autoCapitalize='words'
                    autoCorrect={false}
                    value={techs}
                    onChangeText={techs => setTechs(techs)}
                />
                <TouchableOpacity onPress={() => loadDevs()} style={styles.loadButton}>
                    <Image style={{ width: 16, height: 16 }} source={require('../assets/lupa.png')} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },

    callout: {
        width: 250,
    },

    devName: {
        fontSize: 16,
        fontWeight: 'bold'
    },

    devBio: {
        marginTop: 5,
        color: '#666'
    },

    devTechs: {
        marginTop: 5
    },

    searchForm: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4
        },

        elevation: 4
    },

    loadButton: {
        height: 50,
        width: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    }


})
