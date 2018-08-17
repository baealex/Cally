#include "mainform.h"
#include "ui_mainform.h"
#include "function.h"
#include "setting.h"

QString This_Month;
QString Month_Day;
void Month_Display();
void Month_Day_Calculator();

int Text_Layout = 90*1.3;
bool View = false;

TextData mTD;

MainForm::MainForm(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainForm)
{
    setWindowFlags(Qt::FramelessWindowHint);

    ui->setupUi(this);
    ui->Day->setTextFormat(Qt::RichText);

    SettingData setData;
    move(setData.pos_x,setData.pos_y);
    this->setGeometry(this->geometry().x(),
                      this->geometry().y(),
                      setData.size_w,
                      setData.size_h);

    setWindowOpacity((double)setData.Opacity/100);

    QFile *file = new QFile;
    file->setFileName("UserData.txt");
    if(file->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        mTD.LOAD();
        QString temp = mTD.Text_Data;
        ui->maintext->setPlainText(temp);
    }

    IMGData mIMG;
    file->setFileName("IMGdata.dll");
    if(file->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        mIMG.Load();
        m_img.load(mIMG.LINK);
        int w = setData.size_w;
        int h = setData.size_h;
        ui->label->setPixmap(m_img.scaled(w, h, Qt::KeepAspectRatio));
        ui->label->setScaledContents(true);
    }

    Month_Display();
    ui->Month->setText(This_Month);

    Month_Day_Calculator();
    ui->Day->setText(Month_Day);
}

void Month_Display()
{
    QDate *date = new QDate;
    QDate THIS_MONTH = date->currentDate();

    if(THIS_MONTH.month()>9)
    {
        This_Month = QString::number(THIS_MONTH.month());
    }
    else
    {
        This_Month = "0" + QString::number(THIS_MONTH.month());
    }
}

void Month_Day_Calculator()
{
    QDate *date = new QDate;
    QDate Today = date->currentDate();

    int year = Today.year();
    int AllDay = (year-1)*365 + (year-1)/4 - (year-1)/100 + (year-1)/400;

    int month = Today.month();
    switch (month-1)
    {
        case 12:
            AllDay += 31;
        case 11:
            AllDay += 30;
        case 10:
            AllDay += 31;
        case 9:
            AllDay += 30;
        case 8:
            AllDay += 31;
        case 7:
            AllDay += 31;
        case 6:
            AllDay += 30;
        case 5:
            AllDay += 31;
        case 4:
            AllDay += 30;
        case 3:
            AllDay += 31;
        case 2:
            AllDay += 28;
            if(year%4==0 && year%100!=0 || year%400==0)
                AllDay += 29;
        case 1:
            AllDay += 31;

    }

    for(int i = 1;i <= 31;i++)
    {
        switch ((AllDay+i)%7) {
        case 0:
            Month_Day.append("<font color='red'> "+QString::number(i)+" </font>");
            break;
        case 1:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 2:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 3:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 4:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 5:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 6:
            Month_Day.append("<font color='blue'> "+QString::number(i)+" </font>");
            break;
        }
    }
}

MainForm::~MainForm()
{
    delete ui;
}

void MainForm::on_pushButton_clicked()
{
    Setting set(*this,this);
    set.exec();
}

void MainForm::on_pushButton_2_clicked()
{
    close();
}

void MainForm::on_pushButton_3_clicked()
{
    QPropertyAnimation *Text_Animation = new QPropertyAnimation(ui->maintext,"geometry"); Text_Animation->setDuration(200);
    QPropertyAnimation *But1_Animation = new QPropertyAnimation(ui->pushButton,"geometry"); But1_Animation->setDuration(200);
    QPropertyAnimation *But2_Animation = new QPropertyAnimation(ui->pushButton_2,"geometry"); But2_Animation->setDuration(200);
    QPropertyAnimation *But3_Animation = new QPropertyAnimation(ui->pushButton_3,"geometry"); But3_Animation->setDuration(200);

    if(View == false)
    {
        Text_Animation->setStartValue(QRect(ui->maintext->geometry().x(),
                                            ui->maintext->geometry().y(),
                                            ui->maintext->geometry().width(),
                                            ui->maintext->geometry().height()));
        Text_Animation->setEndValue(QRect(ui->maintext->geometry().x(),
                                          ui->maintext->geometry().y()-Text_Layout,
                                          ui->maintext->geometry().width(),
                                          ui->maintext->geometry().height()));
        Text_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But1_Animation->setStartValue(QRect(ui->pushButton->geometry().x(),
                                            ui->pushButton->geometry().y(),
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        But1_Animation->setEndValue(QRect(ui->pushButton->geometry().x(),
                                          ui->pushButton->geometry().y()-Text_Layout,
                                          ui->pushButton->geometry().width(),
                                          ui->pushButton->geometry().height()));
        But1_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But2_Animation->setStartValue(QRect(ui->pushButton_2->geometry().x(),
                                            ui->pushButton_2->geometry().y(),
                                            ui->pushButton_2->geometry().width(),
                                            ui->pushButton_2->geometry().height()));
        But2_Animation->setEndValue(QRect(ui->pushButton_2->geometry().x(),
                                          ui->pushButton_2->geometry().y()-Text_Layout,
                                          ui->pushButton_2->geometry().width(),
                                          ui->pushButton_2->geometry().height()));
        But2_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But3_Animation->setStartValue(QRect(ui->pushButton_3->geometry().x(),
                                            ui->pushButton_3->geometry().y(),
                                            ui->pushButton_3->geometry().width(),
                                            ui->pushButton_3->geometry().height()));
        But3_Animation->setEndValue(QRect(ui->pushButton_3->geometry().x(),
                                          ui->pushButton_3->geometry().y()-Text_Layout,
                                          ui->pushButton_3->geometry().width(),
                                          ui->pushButton_3->geometry().height()));
        But3_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        //ui->pushButton_3->setText((QString)0x025BD);

        Text_Animation->start();
        But1_Animation->start();
        But2_Animation->start();
        But3_Animation->start();
        View = true;
    }
    else
    {
        Text_Animation->setStartValue(QRect(ui->maintext->geometry().x(),
                                            ui->maintext->geometry().y(),
                                            ui->maintext->geometry().width(),
                                            ui->maintext->geometry().height()));
        Text_Animation->setEndValue(QRect(ui->maintext->geometry().x(),
                                          ui->maintext->geometry().y()+Text_Layout,
                                          ui->maintext->geometry().width(),
                                          ui->maintext->geometry().height()));
        Text_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But1_Animation->setStartValue(QRect(ui->pushButton->geometry().x(),
                                            ui->pushButton->geometry().y(),
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        But1_Animation->setEndValue(QRect(ui->pushButton->geometry().x(),
                                          ui->pushButton->geometry().y()+Text_Layout,
                                          ui->pushButton->geometry().width(),
                                          ui->pushButton->geometry().height()));
        But1_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But2_Animation->setStartValue(QRect(ui->pushButton_2->geometry().x(),
                                            ui->pushButton_2->geometry().y(),
                                            ui->pushButton_2->geometry().width(),
                                            ui->pushButton_2->geometry().height()));
        But2_Animation->setEndValue(QRect(ui->pushButton_2->geometry().x(),
                                          ui->pushButton_2->geometry().y()+Text_Layout,
                                          ui->pushButton_2->geometry().width(),
                                          ui->pushButton_2->geometry().height()));
        But2_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But3_Animation->setStartValue(QRect(ui->pushButton_3->geometry().x(),
                                            ui->pushButton_3->geometry().y(),
                                            ui->pushButton_3->geometry().width(),
                                            ui->pushButton_3->geometry().height()));
        But3_Animation->setEndValue(QRect(ui->pushButton_3->geometry().x(),
                                          ui->pushButton_3->geometry().y()+Text_Layout,
                                          ui->pushButton_3->geometry().width(),
                                          ui->pushButton_3->geometry().height()));
        But3_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        //ui->pushButton_3->setText((QString)0x025B3);

        Text_Animation->start();
        But1_Animation->start();
        But2_Animation->start();
        But3_Animation->start();
        View = false;
    }
}

/* Move */

bool isMouseDown;

void MainForm::mousePressEvent(QMouseEvent *event) {
   if (event->button() == Qt::LeftButton) {
      m_nMouseClick_X_Coordinate = event->x();
      m_nMouseClick_Y_Coordinate = event->y();
      isMouseDown = true;
   }
}

void MainForm::mouseReleaseEvent(QMouseEvent *event) {
   isMouseDown = false;
}

void MainForm::mouseMoveEvent(QMouseEvent *event) {
   if (isMouseDown == true) {
      SettingData setData;
      move(event->globalX()-m_nMouseClick_X_Coordinate,event->globalY()-m_nMouseClick_Y_Coordinate);
      setData.pos_x = event->globalX()-m_nMouseClick_X_Coordinate;
      setData.pos_y = event->globalY()-m_nMouseClick_Y_Coordinate;
      setData.SAVE();
   }
}

void MainForm::resizeEvent(QResizeEvent *event) {
    QMainWindow::resizeEvent(event);
    ui->label->setGeometry(QRect(ui->label->geometry().x(),
                                 ui->label->geometry().y(),
                                 ui->centralWidget->geometry().width(),
                                 ui->centralWidget->geometry().height()-0));
    ui->Month->setGeometry(QRect(ui->Month->geometry().x(),
                                 ui->centralWidget->geometry().height()-80,
                                 ui->Month->geometry().width(),
                                 ui->Month->geometry().height()));
    if(ui->centralWidget->geometry().width()<600)
    {
        QFont font;
        font.setPixelSize(12);
        ui->Day->setFont(font);
    }
    else if(ui->centralWidget->geometry().width()>=600 && ui->centralWidget->geometry().width()<700)
    {
        QFont font;
        font.setPixelSize(13);
        ui->Day->setFont(font);
    }
    else if(ui->centralWidget->geometry().width()>=700)
    {
        QFont font;
        font.setPixelSize(14);
        ui->Day->setFont(font);
    }
    ui->Day->setGeometry(QRect(ui->Day->geometry().x(),
                               ui->Month->geometry().y()+40,
                               ui->centralWidget->geometry().width()-80,
                               ui->Day->geometry().height()));
    if(View == false){
        ui->pushButton_2->setGeometry(QRect(ui->centralWidget->geometry().width()-30,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->pushButton->setGeometry(QRect(ui->centralWidget->geometry().width()-50,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->pushButton_3->setGeometry(QRect(ui->centralWidget->geometry().width()-70,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->maintext->setGeometry(QRect(ui->maintext->geometry().x(),
                                        ui->centralWidget->geometry().height()-20,
                                        ui->centralWidget->geometry().width()-20,
                                        ui->maintext->geometry().height()));}
    else{
        ui->pushButton_2->setGeometry(QRect(ui->centralWidget->geometry().width()-30,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->pushButton->setGeometry(QRect(ui->centralWidget->geometry().width()-50,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->pushButton_3->setGeometry(QRect(ui->centralWidget->geometry().width()-70,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->pushButton->geometry().width(),
                                            ui->pushButton->geometry().height()));
        ui->maintext->setGeometry(QRect(ui->maintext->geometry().x(),
                                        ui->centralWidget->geometry().height()-20-Text_Layout,
                                        ui->centralWidget->geometry().width()-20,
                                        ui->maintext->geometry().height()));}

    SettingData setData;
    setData.size_w = this->size().width();
    setData.size_h = this->size().height();
    setData.SAVE();
}

void MainForm::on_maintext_textChanged()
{
    mTD.Text_Data=ui->maintext->toPlainText();
    mTD.SAVE();
}
