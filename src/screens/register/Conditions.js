import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { GreenFitrecColor, SignUpColor, WhiteColor } from "../../Styles";

const Conditions = (props, { navigation }) => {

  return (
    <View style={styles.viewContent}>
      <ScrollView style={styles.content}>
        <TextView
          first={true}
          title="Last updated: November 08, 2016"
          body='Please read these Terms of 
                        Service ("Terms", "Terms of Service") carefully before using the
                        www.FITREC.com website and the FITREC APP  mobile application (together, or individually,
                        the "Service") operated by FITREC APP LLC  ("us", "we", or "our").
                        Your access to and use of the Service is conditioned upon your acceptance of and compliance
                        with these Terms. These Terms apply to all visitors, users and others who wish to access or
                        use the Service.
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with
                        any part of the terms then you do not have permission to access the Service.
                        The minimum age requirement for members is set at 16 years of age. It is imperative that the
                        member provide complete and accurate information, including any updates to the information the
                        user provides. It is your responsibility to always keep all information on your account, current.'
        />

        <TextView
          title="Communications"
          body="By creating an Account on our service, you agree 
                        to subscribe to newsletters, marketing or promotional materials and other information we 
                        may send. However, you may opt out of receiving any, or all, of these communications from 
                        us by following the unsubscribe link or instructions provided in any email we send."
        />

        <TextView
          title="Privacy"
          body="We respect your privacy and have rules in place in handling your data. 
                        All information provided by you is covered in FITREC privacy policy. By using the Site and the 
                        Service, you provide your consent to use your data. The privacy of your username or screen 
                        name is your personal duty. Any actions by any party using your screen name will be your 
                        responsibility. You agree to abide by all applicable laws and regulations in using the Service; 
                        including but not limited to the Data Protection Act of 1998. You agree not to pose as someone 
                        else, misrepresent, state falsely, impersonate or otherwise fake your affiliation with any person
                        or entity. Any and all illegal, immoral or unlawful activity is prohibited. You agree not to 
                        post, promote, publish via the Service, any form of harassment, defamation, abuse, threat, 
                        obscenity, racism, ethically questionable or objectionable material of any nature. This covers 
                        any and all forms directly or indirectly related to libel, slander, criminal activity or the 
                        encouragement therein and of any other activity that violates any applicable laws or regulations. 
                        All activities mentioned above plus all related actions deemed unethical or unlawful is NOT"
        />

        <TextView
          title="Endorsed nor supported by fitrec"
          body="Under these Terms & Conditions, you agree 
                        not to use, upload or provide links that contain viruses, corrupted files, malware, and other 
                        similar software or programs aimed to damage the operation of anyone’s computer. 
                        You agree not to start nor participate in any activities aimed to disrupt the service. 
                        All devices, software or routines that will result in Website and Service interruptions is 
                        strictly prohibited and will result in appropriate legal action. 
                        FITREC has no control over the safety of its Members or the accuracy of the content contained 
                        therein. Exercise caution in interacting and dealing with other members"
        />

        <TextView
          title="Purchases"
          body='If you wish to purchase any product or service made available through 
                        the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase 
                        including, without limitation, your credit card number, the expiration date of your credit card, 
                        your billing address, and your shipping information.
                        You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment 
                        method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct 
                        and complete. The service may employ the use of third party services for the purpose of facilitating 
                        payment and the completion of Purchases. By submitting your information, you grant us the right to 
                        provide the information to these third parties subject to our Privacy Policy.
                        We reserve the right to refuse or cancel your order at any time for reasons including but not limited 
                        to: product or service availability, errors in the description or price of the product or service, 
                        error in your order or other reasons.
                        We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction
                        is suspected.'
        />

        <TextView
          title="Availability, Errors and Inaccuracies"
          body="We are constantly updating product and 
                        service offerings on the Service. We may experience delays in updating information on the Service 
                        and in our advertising on other web sites. The information found on the Service may contain errors 
                        or inaccuracies and may not be complete or current. Products or services may be mispriced, described 
                        inaccurately, or unavailable on the Service and we cannot guarantee the accuracy or completeness of 
                        any information found on the Service. We therefore reserve the right to change or update information 
                        and to correct errors, inaccuracies, or omissions at any time without prior notice."
        />

        <TextView
          title="Content"
          body='Our Service allows you to post, link, store, share and otherwise make 
                        available certain information, text, graphics, videos, or other material ("Content"). You are 
                        responsible for the Content that you post on or through the Service, including its legality, 
                        reliability, and appropriateness. By posting Content on or through the Service, You represent 
                        and warrant that: (i) the Content is yours (you own it) and/or you have the right to use it and 
                        the right to grant us the rights and license as provided in these Terms, and (ii) that the posting 
                        of your Content on or through the Service does not violate the privacy rights, publicity rights, 
                        copyrights, contract rights or any other rights of any person or entity. We reserve the right to 
                        terminate the account of anyone found to be infringing on a copyright.
                        You retain any and all of your rights to any Content you submit, post or display on or through the 
                        Service and you are responsible for protecting those rights. We take no responsibility and assume 
                        no liability for Content you or any third party posts on or through the Service. However, by posting
                        Content using the Service you grant us the right and license to use, modify, publicly perform, 
                        publicly display, reproduce, and distribute such Content on and through the Service. You agree that 
                        this license includes the right for us to make your Content available to other users of the Service,
                        who may also use your Content subject to these Terms.
                        FITREC APP LLC  has the right but not the obligation to monitor and edit all Content provided by users.
                        In addition, Content found on or through this Service are the property of FITREC APP LLC or used with 
                        permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said 
                        Content, whether in whole or in part, for commercial purposes or for personal gain, without express 
                        advance written permission from us.'
        />

        <TextView
          title="Limitations"
          body={
            "The user agrees to not post any content on or transmit any content " +
            "to others, communicate any content, provide links to any content, or otherwise engage in any " +
            "activity through the services that: " +
            "\n" +
            "• Impersonates or otherwise misrepresents affiliation, connection or association with any " +
            "person or entity." +
            "\n" +
            "• Discloses any personal or confidential information of any person or organization without " +
            "consent or the solicitation any person’s information for commercial purposes." +
            "• Solicits or request personal information from anyone under 16 years old and store personal " +
            "data about users and members consent." +
            "\n" +
            "• Promote unsolicited messages, such as promos, mobile numbers and email addresses." +
            "\n" +
            "• Defamatory, inaccurate, obscene, indecent seditious, offensive, pornographic, abusive, " +
            "\n" +
            "liable to incite racial hatred, discriminatory, inflammatory, blasphemous, breach of confidence, " +
            "in breach of privacy or which may cause annoyance or inconvenience. " +
            "\n" +
            "• Promotes racism, bigotry, hatred or physical harm to any group or individual. " +
            "\n" +
            "• Violates any of the provisions in the Terms and Conditions, Privacy Policy and Existing " +
            "Laws governing services such as FITREC"
          }
        />

        <TextView
          title="Accounts"
          body="When you create an account with us, you guarantee that you are 
                        above the age of 16, and that the information you provide us is accurate, complete, and current 
                        at all times. Inaccurate, incomplete, or obsolete information may result in the immediate 
                        termination of your account on the Service.
                        You are responsible for maintaining the confidentiality of your account and password, including 
                        but not limited to the restriction of access to your computer and/or account. You agree to accept 
                        responsibility for any and all activities or actions that occur under your account and/or password, 
                        whether your password is with our Service or a third-party service. You must notify us immediately 
                        upon becoming aware of any breach of security or unauthorized use of your account.
                        You may not use as a username the name of another person or entity or that is not lawfully available
                        for use, a name or trademark that is subject to any rights of another person or entity other than 
                        you, without appropriate authorization. You may not use as a username any name that is offensive, 
                        vulgar or obscene. We reserve the right to refuse service, terminate accounts, remove or edit 
                        content, or cancel orders in our sole discretion."
        />

        <TextView
          title="Intellectual Property"
          body="The Service and its original content (excluding Content 
                        provided by users), features and functionality are and will remain the exclusive property of FITREC 
                        APP LLC  and its licensors. The Service is protected by copyright, trademark, and other laws of 
                        both the United States and foreign countries. Our trademarks and trade dress may not be used in 
                        connection with any product or service without the prior written consent of FITREC APP LLC ."
        />

        <TextView
          title="Links To Other Web Sites"
          body="Our Service may contain links to third party web sites 
                        or services that are not owned or controlled by FITREC APP LLC .
                        FITREC APP LLC  has no control over, and assumes no responsibility for the content, privacy 
                        policies, or practices of any third party web sites or services. We do not warrant the offerings 
                        of any of these entities/individuals or their websites.
                        You acknowledge and agree that FITREC APP LLC  shall not be responsible or liable, directly or 
                        indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of 
                        or reliance on any such content, goods or services available on or through any such third party 
                        web sites or services. We strongly advise you to read the terms and conditions and privacy policies
                        of any third party web sites or services that you visit."
        />

        <TextView
          title="Termination and Cancellation"
          body="
                        We may terminate or suspend your account and bar access to the Service immediately, without prior 
                        notice or liability, under our sole discretion, for any reason whatsoever and without limitation, 
                        including but not limited to a breach of the Terms. If you wish to terminate your account, you 
                        may use the delete option. Upon termination of the services, you acknowledge and agree that FITREC 
                        may immediately delete the files in your account and no further access too such files or the 
                        services. All provisions of the Terms which by their nature should survive termination shall 
                        survive termination, including, without limitation, ownership provisions, warranty disclaimers,
                        indemnity and limitations of liability."
        />

        <TextView
          title="Indemnification"
          body="You agree to defend, indemnify and hold harmless FITREC APP 
                        LLC  and its licensee and licensors, and their employees, contractors, agents, officers and 
                        directors, from and against any and all claims, damages, obligations, losses, liabilities, 
                        costs or debt, and expenses (including but not limited to attorney's fees), resulting from or 
                        arising out of a) your use and access of the Service, by you or any person using your account 
                        and password; b) a breach of these Terms, or c) Content posted on the Service."
        />

        <TextView
          title="Limitation Of Liability"
          body="In no event shall FITREC APP LLC , nor its directors, 
                        employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
                        special, consequential or punitive damages, including without limitation, loss of profits, 
                        data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of 
                        or inability to access or use the Service; (ii) any conduct or content of any third party on 
                        the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or 
                        alteration of your transmissions or content, whether based on warranty, contract, tort (including 
                        negligence) or any other legal theory, whether or not we have been informed of the possibility 
                        of such damage, and even if a remedy set forth herein is found to have failed of its essential 
                        purpose."
        />

        <TextView
          title="Disclaimer"
          body='Your use of the Service is at your sole risk. The Service is 
                        provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of 
                        any kind, whether express or implied, including, but not limited to, implied warranties of 
                        merchantability, fitness for a particular purpose, non-infringement or course of performance.
                        FITREC APP LLC  its subsidiaries, affiliates, and its licensors do not warrant that a) the Service 
                        will function uninterrupted, secure or available at any particular time or location; b) any errors 
                        or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) 
                        the results of using the Service will meet your requirements.
                        FITREC has no control over the safety of its Members or the accuracy of the content contained 
                        therein. Exercise caution in interacting and dealing with other members
                        As with all forms of Service, FITREC does not guarantee 100% uninterrupted service, nor does it 
                        guarantee that the Service will be timely, secure or free from errors. 
                        The Service may contain material for Entertainment purposes only or may have accounts that 
                        facilitate in interactions to ensure that the site and the Service flow stays true to the goal 
                        of fitness, and health'
        />

        <TextView
          title="Indemnification"
          body="You agree to release, indemnify and hold us, our parents, 
                        subsidiaries and affiliates, and each of their respective members, officers, directors, employees, 
                        agents and/or other partners, harmless from and against any and all claims, expenses (including 
                        reasonable attorneys' fees, costs and settlement costs), damages, suits, costs, demands and/or 
                        judgments whatsoever, made by any third party due to or arising out of: (i) your use of the 
                        Website, Service, Submissions or Content; (ii) your breach of the Member Terms; (iii) your 
                        violation of any rights including, but not limited to, intellectual property rights, of another 
                        Member, individual and/or entity; (iv) your violation of the CAN-SPAM Act of 2003, as well as any 
                        state and/or federal laws, rules or regulations prohibiting transmission of unsolicited email; 
                        and/or (v) any deceptive, threatening, libelous, obscene, harassing or offensive material contained 
                        in any of your email communications or other Submissions "
        />

        <TextView
          title="Exclusions"
          body="Some jurisdictions do not allow the exclusion of certain warranties 
                        or the exclusion or limitation of liability for consequential or incidental damages, so the 
                        limitations above may not apply to you."
        />

        <TextView
          title="Governing Law"
          body="These Terms shall be governed and construed in accordance with 
                        the laws of Maryland, United States, without regard to its conflict of law provisions.
                        Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
                        those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, 
                        the remaining provisions of these Terms will remain in effect. These Terms constitute the entire 
                        agreement between us regarding our Service, and supersede and replace any prior agreements we might 
                        have had between us regarding the Service."
        />

        <TextView
          title="Changes to the Service"
          body="FITREC reserves the right to alter the service, 
                        without any liability, to change site look and feel, discontinue specific features, content 
                        or campaigns and/or modify the service either temporarily or permanently. Any and all changes 
                        or updates will be done with prior notice and may be found within the website itself."
        />

        <TextView
          title="Changes, Amendments or Modifications to the Terms & Conditions"
          body="FITREC, may 
                        at any time, change the Terms & Conditions in order to reflect current trends, circumvent any 
                        potentially new threats based on online activity as well as any other reasons deemed fit and lawful. 
                        By continuing to access or use our Service after any revisions become effective, you agree to 
                        be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized 
                        to use the Service. What constitutes a material change will be determined at our sole discretion.
                        Majority of changes will be done with prior notice and will be posted on the website; These changes
                        will be effective immediately upon posting and will be in-effect henceforth. Some changes may not 
                        be immediately announced but will be applied as soon as possible. These are for urgent and/or 
                        required changes deemed necessary to protect the site/service. A notice of these changes will 
                        follow soon after. 
                        Your continued use of the service after the date of posting constitutes your agreement and 
                        acknowledgement of the new Terms & Conditions. This also signifies that you will abide by the 
                        rules and guidelines set by FITREC. "
        />

        <TextView
          title="Contact Us"
          body="If you have any questions about these Terms, please contact 
                        us: info@fitrec.com"
          last={true}
        />
      </ScrollView>
      {!props.hiddenButtons && (
        <View style={styles.viewButtons}>
          <Pressable
            style={[
              styles.buttonConditions,
              { backgroundColor: GreenFitrecColor },
            ]}
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={{ color: WhiteColor }}>DISAGREE</Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttonConditions,
              { backgroundColor: SignUpColor },
            ]}
            onPress={() => {
              navigation.navigate("RegisterFinalStep", {
                user:
                  navigation.getParam("user", null),
              });
            }}
          >
            <Text style={{ color: WhiteColor }}>AGREE</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const TextView = (props) => (
  <View>
    <Text style={props.first ? styles.bold : styles.title}>{props.title}</Text>
    <Text style={[styles.colorGreen, props.last && { marginBottom: 20 }]}>
      {props.body}
    </Text>
  </View>
);

export default Conditions;

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
  bold: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  colorGreen: {
    color: GreenFitrecColor,
  },
  viewButtons: {
    flexDirection: "row",
    height: 60,
    paddingBottom: 10,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonConditions: {
    width: "48%",
    height: 30,
    borderRadius: 5,
    marginRight: "4%",
    justifyContent: "center",
    alignItems: "center",
  },
});
