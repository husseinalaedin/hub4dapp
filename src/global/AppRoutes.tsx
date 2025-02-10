import { CompanyProfile } from "../app-comps/private/acc/CompanyProfile";
import { Team } from "../app-comps/private/acc/Team";
import { UserProfile } from "../app-comps/private/acc/UserProfile";
import { UserSetings } from "../app-comps/private/acc/UserSettings";
import { AppMain } from "../app-comps/private/app-admin/AppMain";
import {
  AddEditChannel,
  Channels,
} from "../app-comps/private/channel/Channels";
import { Analytic } from "../app-comps/private/dashboard/Analytic";
import { AppEntry } from "../app-comps/private/posts/AppEntry";
import { TradeDetails, Trades } from "../app-comps/private/posts/Trades";
import { AddEditShare, Shares } from "../app-comps/private/shares/Shares";
import { History } from "../app-comps/public/History";

import { Main } from "../app-comps/public/Main";
import { OutResponse } from "../app-comps/public/OutResponse";
import { SendVeriOrResetPwdfEmail, SignIn } from "../app-comps/public/SignIn";
import { SignUp } from "../app-comps/public/SignUp";

import { CoAdminMenu } from "../app-comps/private/co-admin/CoAdminMenu";
import { CoAdminChannels } from "../app-comps/private/co-admin/CoAdminChannels";
import { CoAdminCompanies } from "../app-comps/private/co-admin/CoAdminCompanies";
import { ChannelOwnerResponses } from "../app-comps/private/channel/ChannelOwnerResponses";
import { Unsubscribe } from "../app-comps/public/Unsubscribe";
import { Companies } from "../app-comps/private/companies/Companies";
import { LatestTrades } from "../app-comps/private/posts/LatestTrades";
import { ConcernPrivate } from "../app-comps/private/concern/ConcernPrivate";
import { CoAdminConcerns } from "../app-comps/private/co-admin/CoAdminConcerns";
import { AddEditDeal, CompanyDeals } from "../app-comps/private/posts/Deals";
import { SignOut } from "../app-comps/public/SignOut";
import { StripePricingTable } from "../app-comps/private/acc/Stripe";
import { Usage } from "../app-comps/private/dashboard/Usage";
import { Route, Routes } from "react-router";
import { Box } from "@mantine/core";
import Home2 from "../app-comps/public/Home";
import { QuickAccess } from "../app-comps/private/app-admin/QuickAccess";

export const AppRoutes = () => (
  <>
    <Routes>
      <Route path="" element={<Home2 />} />

      <Route path="/:shareidhex" element={<Main />} />
      <Route path="/pub" element={<Home2 />}>
        <Route path="sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-out" element={<SignOut />} />
        <Route
          path="out-email-request/:purpose"
          element={<SendVeriOrResetPwdfEmail />}
        />
        <Route path="out-response/:purpose" element={<OutResponse />} />
      </Route>
      <Route path="/app" element={<AppMain />}>
        <Route path="quickaccess" element={<QuickAccess />} />
        <Route path="usage" element={<Usage />} />

        <Route path="shareresponse/:shareidhex" element={<AppEntry />} />
        <Route
          path="decision-noted/:short_link"
          element={<ChannelOwnerResponses />}
        />
        <Route
          path="decision-noted/id/:id"
          element={<ChannelOwnerResponses />}
        />
        <Route path="unsubscribe/:shareidhex" element={<Unsubscribe />} />

        <Route path="trades/:source/:traderpage" element={<Trades />} />
        <Route
          path="trades/:source/:traderpage/:id"
          element={<TradeDetails />}
        />

        <Route path="latest-trades" element={<LatestTrades />} />

        <Route path="companies" element={<Companies />} />

        <Route path="board">
          <Route path="analytic" element={<Analytic />} />
          <Route path="usage" element={<Usage />} />
          <Route path="analytic/:src/:id" element={<Analytic />} />

          {/* <Route
              path="emailsStat/:src/:id"
              element={<EmailsSharesReport />}
            /> */}
        </Route>

        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<UserSetings />} />

        <Route path="team" element={<Team />} />

        <Route path="company-profile" element={<CompanyProfile />} />

        <Route path="channels" element={<Channels />} />
        <Route path="channels/:id" element={<Channels />} />
        <Route path="channel/:id" element={<AddEditChannel />} />
        <Route path="mydeals" element={<CompanyDeals />} />
        <Route path="mydeals/:id" element={<AddEditDeal />} />

        <Route path="shares" element={<Shares />} />

        <Route path="share/:channel_id" element={<AddEditShare />} />
        <Route path="concern" element={<ConcernPrivate />} />

        <Route path="history" element={<History />} />
        <Route path="co-admin" element={<CoAdminMenu />} />
        <Route path="co-admin-channels" element={<CoAdminChannels />} />
        <Route path="co-admin-companies" element={<CoAdminCompanies />} />
        <Route path="co-admin-concerns" element={<CoAdminConcerns />} />

        <Route path="plans" element={<StripePricingTable />} />
        <Route path="sign-out" element={<SignOut />} />
      </Route>

      <Route path="*" element={<Box>{"Not Found"}</Box>} />
    </Routes>
  </>
);
