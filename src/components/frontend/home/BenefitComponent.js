import React, { useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { frontendBenefitActions } from "../../../store/actions/frontend/frontendBenefitActions";

const BenefitComponent = () => {
  const dispatch = useDispatch();
  const { width: windowWidth } = useWindowDimensions();
  const { lists: benefits, loading, page, hasMore } = useSelector(
    state => state.frontendBenefit
  );

  // Responsive layout config
  const responsiveStyles = useMemo(
    () => {
      const isSmallPhone = windowWidth < 375;
      const isMediumScreen = windowWidth >= 375 && windowWidth < 768;
      const isLargeScreen = windowWidth >= 768;

      return StyleSheet.create({
        container: {
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingVertical: isSmallPhone ? 16 : 24,
          paddingHorizontal: isSmallPhone ? 12 : 16,
        },
        itemContainer: {
          width: isSmallPhone ? "48%" : isMediumScreen ? "46%" : 236,
          marginBottom: isSmallPhone ? 16 : 24,
          paddingLeft:
            (isSmallPhone ? 20 : 24) +
            (isSmallPhone ? 8 : isMediumScreen ? 12 : 16) / 2,
        },
        iconImage: {
          position: "absolute",
          top: 0,
          left: 0,
          width: isSmallPhone ? 20 : 24,
          height: isSmallPhone ? 20 : 24,
        },
        titleText: {
          fontWeight: "600",
          textTransform: "capitalize",
          fontSize: isSmallPhone ? 14 : 16,
          marginBottom: isSmallPhone ? 4 : 8,
        },
        descriptionText: {
          color: "#4B5563",
          fontSize: isSmallPhone ? 12 : 14,
        },
        columnWrapper: {
          justifyContent: "space-between",
          marginBottom: isSmallPhone ? 8 : isMediumScreen ? 12 : 16,
        },
        contentContainer: {
          paddingBottom: isSmallPhone ? 16 : 24,
        },
        loadingContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 32,
        },
        footerLoading: {
          paddingVertical: 16,
        },
      });
    },
    [windowWidth]
  );

  // Initial data fetch
  useEffect(
    () => {
      dispatch(
        frontendBenefitActions.lists({
          paginate: 0,
          order_column: "id",
          order_type: "asc",
          status: 5,
        })
      );
    },
    [dispatch]
  );

  // Load more handler
  const handleLoadMore = useCallback(
    () => {
      if (!loading && hasMore) {
        dispatch(
          frontendBenefitActions.lists({
            paginate: 0,
            order_column: "id",
            order_type: "asc",
            status: 5,
            page: page + 1,
          })
        );
      }
    },
    [loading, hasMore, page, dispatch]
  );

  // Memoized benefit item
  const renderBenefitItem = useCallback(
    ({ item }) =>
      <View style={responsiveStyles.itemContainer}>
        <Image
          source={{ uri: item.thumb }}
          style={responsiveStyles.iconImage}
          resizeMode="contain"
        />
        <Text style={responsiveStyles.titleText}>
          {item.title}
        </Text>
        <Text style={responsiveStyles.descriptionText}>
          {item.description}
        </Text>
      </View>,
    [responsiveStyles]
  );

  if (loading && page === 1) {
    return (
      <View style={responsiveStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B6FED" />
      </View>
    );
  }

  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <View style={responsiveStyles.container}>
      <FlatList
        data={benefits}
        renderItem={renderBenefitItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={responsiveStyles.columnWrapper}
        contentContainerStyle={responsiveStyles.contentContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && page > 1
            ? <View style={responsiveStyles.footerLoading}>
                <ActivityIndicator size="small" color="#4B6FED" />
              </View>
            : null
        }
        initialNumToRender={8}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    </View>
  );
};

export default React.memo(BenefitComponent);
