import React from 'react';
import { MapType } from '../../../../types/MapType';
import { GithubAction } from '../../GithubAction';
import { CCTray } from '../../CCTray';
import { DatadogMonitor } from '../../DatadogMonitor';
import { Sentry } from '../../Sentry';
import { NewRelic } from '../../NewRelic';
import { Grafana } from '../../Grafana';

export const observersComponentBuilderMap: MapType<
  (observable: any, index: number, updateFieldWithValue: any, translate: any) => JSX.Element
> = {
  githubAction: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <GithubAction
      observable={observable}
      index={index}
      updateFieldWithValue={updateFieldWithValue}
      translate={translate}
    />
  ),
  ccTray: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <CCTray observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  datadogMonitor: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <DatadogMonitor
      observable={observable}
      index={index}
      updateFieldWithValue={updateFieldWithValue}
      translate={translate}
    />
  ),
  sentry: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <Sentry observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  newRelic: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <NewRelic observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
  grafana: (observable: any, index: number, updateFieldWithValue: any, translate: any) => (
    <Grafana observable={observable} index={index} updateFieldWithValue={updateFieldWithValue} translate={translate} />
  ),
};
