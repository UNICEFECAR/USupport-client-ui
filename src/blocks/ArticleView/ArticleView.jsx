import React from "react";
import RectMarkdown from "react-markdown";
import {
  Block,
  Grid,
  GridItem,
  Icon,
  Label,
} from "@USupport-components-library/src";

import "./article-view.scss";

/**
 * ArticleView
 *
 * ArticleView block
 *
 * @return {jsx}
 */
export const ArticleView = ({ articleData }) => {
  return (
    <Block classes="article-view">
      <Grid classes="article-view__main-grid">
        <GridItem md={8} lg={12} classes="article-view__labels-item">
          {articleData.labels.map((label, index) => {
            return (
              <Label
                classes={"article-view__label"}
                text={label.name}
                key={index}
              />
            );
          })}{" "}
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__title-item">
          <h3>{articleData.title}</h3>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__details-item">
          <p className={"small-text"}>By {articleData.creator}</p>

          <Icon name={"time"} size="sm" />
          <p className={"small-text"}> {articleData.readingTime} min read</p>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__body-item">
          <RectMarkdown className={"text"}>{articleData.body}</RectMarkdown>
        </GridItem>
      </Grid>
    </Block>
  );
};
