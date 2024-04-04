import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [data, SetData] = useState<any>();
  const [nextPag, SetNextPag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("");
  const [elementsOnPage, setElementsOnPage] = useState<number>();
  const [totalElements, setTotalElements] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [previousPage, setPreviousPage] = useState<string>("");
  const [nextPage, setNextPage] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<string>("0");

  useEffect(() => {
    setPageNumber((parseInt(nextPag) - 1).toString());
  });
  const handleFetchData = () => {
    ListOfDigimon(url);
    Infos(url);
  };
  const url = `https://digi-api.com/api/v1/digimon?pageSize=12&page=${pageNumber}`;

  const ListOfDigimon = (url: string) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const namesArray = data.content.map(
          (item: { id: string; name: string; image: string }) => [
            item.id,
            item.name,
            item.image,
          ]
        );
        SetData(namesArray);
        console.log(namesArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const Infos = (url: string) => {
    interface PageableData {
      currentPage: string;
      elementsOnPage: number;
      totalElements: number;
      totalPages: number;
      previousPage: string;
      nextPage: string;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const infos: PageableData = data.pageable;
        const infosArray: [string, number, number, number, string, string] = [
          infos.currentPage,
          infos.elementsOnPage,
          infos.totalElements,
          infos.totalPages,
          infos.previousPage,
          infos.nextPage,
        ];
        setCurrentPage(infos.currentPage);
        setElementsOnPage(infos.elementsOnPage);
        setTotalElements(infos.totalElements);
        setTotalPages(infos.totalPages);
        setPreviousPage(infos.previousPage);
        setNextPage(infos.nextPage);
        console.log(infosArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    ListOfDigimon(`https://digi-api.com/api/v1/digimon?pageSize=12&page=0`);
    Infos(`https://digi-api.com/api/v1/digimon?pageSize=12&page=0`);
    SetNextPag("1");
  }, []);
  const renderItem = ({ item }: { item: [string, string, string] }) => (
    <View style={{ width: "50%", marginHorizontal: 10,marginVertical: 5 }}>
      <Image src={item[2]} style={{ width: 90, height: 90 }} />
      <Text style={{ fontSize: 20 }}>
        {item[0]} {item[1]}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View
        style={{
          height: 100,
          width: "100%",
          backgroundColor: "gray",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{color: "white"}}>Page</Text>
          <TextInput
            onChangeText={(text: string) => SetNextPag(text)}
            value={nextPag}
            style={{
              backgroundColor: "white",
              height: 40,
              width: 40,
              textAlign: "center",
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <Text style={{color: "white"}}>of</Text>
          <View
            style={{
              backgroundColor: "white",
              height: 40,
              width: 40,
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{totalPages}</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleFetchData}
          >
            <MaterialIcons name="find-replace" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        <FlatList
          numColumns={2}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 20,
    borderTopStartRadius: 30,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});
