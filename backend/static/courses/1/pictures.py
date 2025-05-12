"""
Этот модуль предоставляет функции для создания различных типов визуализаций
данных психологических и поведенческих исследований.

Включает функции для создания кластеризованных столбчатых диаграмм, категоризированных
гистограмм, диаграмм Бокса-Вискера и диаграмм рассеивания с возможностями настройки.
"""
import os
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

sns.set(style="whitegrid")
plt.rcParams.update({'font.size': 12})

REPORTS_DIR = 'reports/graphs'
os.makedirs(REPORTS_DIR, exist_ok=True)

def clustered_bar_chart(data_frame, category1, category2, output_file=None):
    """кластеризованная столбчатая диаграмма для пары качественных атрибутов"""
    if category1 not in data_frame.columns or category2 not in data_frame.columns:
        raise ValueError(f"столбцы {category1} или {category2} отсутствуют в DataFrame")

    plt.figure(figsize=(10, 6))
    sns_axis  = sns.countplot(data=data_frame, x=category1, hue=category2, palette='pastel')
    plt.title(f"распределение по {category1} и {category2}")
    plt.xlabel(category1)
    plt.ylabel("количество")

    # добавление подписей значений на столбцы
    for temp in sns_axis .patches:
        height = temp.get_height()
        if height > 0:
            sns_axis .annotate(f'{int(height)}', (temp.get_x() + temp.get_width() / 2., height),
                        ha='center', va='bottom', fontsize=10, color='black')

    plt.tight_layout()
    if output_file:
        plt.savefig(os.path.join(REPORTS_DIR, output_file))
    plt.show()


def categorized_histogram(data_frame, numeric_col, category_col, bins=10, output_file=None):
    """категоризированная гистограмма для пары количественный-качественный атрибут"""
    if numeric_col not in data_frame.columns or category_col not in data_frame.columns:
        raise ValueError(f"столбцы {numeric_col} или {category_col} отсутствуют в DataFrame")

    plt.figure(figsize=(10, 6))
    sns.histplot(data=data_frame, x=numeric_col, hue=category_col, bins=bins,
                 element="step", stat="count", common_norm=False, palette="viridis")
    plt.title(f"распределение {numeric_col} по категориям {category_col}")
    plt.xlabel(numeric_col)
    plt.ylabel("частота")
    plt.tight_layout()
    if output_file:
        plt.savefig(os.path.join(REPORTS_DIR, output_file))
    plt.show()


def categorized_boxplot(data_frame, numeric_col, category_col, output_file=None):
    """категоризированная диаграмма Бокса-Вискера"""
    if numeric_col not in data_frame.columns or category_col not in data_frame.columns:
        raise ValueError(f"столбцы {numeric_col} или {category_col} отсутствуют в DataFrame")

    plt.figure(figsize=(10, 6))
    sns.boxplot(data=data_frame, x=category_col, y=numeric_col, hue=category_col)
    plt.title(f"диаграмма Бокса-Вискера для {numeric_col} по категориям {category_col}")
    plt.xlabel(category_col)
    plt.ylabel(numeric_col)
    plt.tight_layout()
    if output_file:
        plt.savefig(os.path.join(REPORTS_DIR, output_file))
    plt.show()



def categorized_scatter(data_frame, x_col, y_col, category_col, output_file=None):
    """категоризированная диаграмма рассеивания"""
    if (x_col not in data_frame.columns or
    y_col not in data_frame.columns or
    category_col not in data_frame.columns):
        raise ValueError(f"столбцы {x_col}, {y_col} или {category_col} отсутствуют в DataFrame")

    plt.figure(figsize=(10, 6))
    sns.scatterplot(data=data_frame, x=x_col, y=y_col, hue=category_col,
                   palette='deep', s=100, edgecolor='black', marker='o')
    plt.title(f"диаграмма рассеивания: {x_col} vs {y_col} по категориям {category_col}")
    plt.xlabel(x_col)
    plt.ylabel(y_col)

    # добавление линии тренда
    sns.regplot(data=data_frame, x=x_col, y=y_col, scatter=False, ax=plt.gca(), color='red')

    plt.tight_layout()
    if output_file:
        plt.savefig(os.path.join(REPORTS_DIR, output_file))
    plt.show()

def generate_default_graphs(data_frame):
    """
    Генерирует набор стандартных визуализаций из входного DataFrame.
    
    Аргументы:
        df (pd.DataFrame): Входные данные, содержащие психологические и поведенческие метрики
    """
    # === 1. кластеризованные столбчатые диаграммы ===
    # медитация vs многозадачность
    clustered_bar_chart(data_frame, 'Meditation_Habit', 'Multitasking_Habit',
                      output_file='meditation_vs_multitasking.png')
    # чрезмерная стимуляция vs качество сна
    clustered_bar_chart(data_frame, 'Overstimulated', 'Sleep_Quality',
                      output_file='overstimulated_vs_sleep_quality.png')
    # === 2. категоризированные гистограммы ===
    # распределение стресса по группам
    categorized_histogram(data_frame, 'Stress_Level', 'Overstimulated', bins=15,
                        output_file='stress_level_by_overstimulated.png')
    # использование техники по привычке к многозадачности
    categorized_histogram(data_frame, 'Tech_Usage_Hours', 'Multitasking_Habit', bins=10,
                        output_file='tech_usage_by_multitasking.png')
    # === 3. диаграммы Бокса-Вискера ===
    # продолжительность сна по группам
    categorized_boxplot(data_frame, 'Sleep_Hours', 'Overstimulated',
                      output_file='sleep_hours_by_overstimulated.png')
    # уровень стресса по медитативным привычкам
    categorized_boxplot(data_frame, 'Stress_Level', 'Meditation_Habit',
                      output_file='stress_level_by_meditation.png')
    # тревожность по привычке к многозадачности
    categorized_boxplot(data_frame, 'Anxiety_Score', 'Multitasking_Habit',
                      output_file='anxiety_by_multitasking.png')
    # === 4. диаграммы рассеивания ===
    # сон vs использование техники
    categorized_scatter(data_frame, 'Sleep_Hours', 'Tech_Usage_Hours', 'Overstimulated',
                      output_file='sleep_vs_tech_by_overstimulated.png')
    # стресс vs сон
    categorized_scatter(data_frame, 'Stress_Level', 'Sleep_Hours', 'Overstimulated',
                      output_file='stress_vs_sleep_by_overstimulated.png')
    # работа vs социальные взаимодействия
    categorized_scatter(data_frame, 'Work_Hours', 'Social_Interaction', 'Overstimulated',
                      output_file='work_vs_social_by_overstimulated.png')

def get_user_input(data_frame):
    """интерактивное создание графиков по выбору пользователя"""
    # определение типов столбцов
    categorical_cols = [
        'Multitasking_Habit', 'Meditation_Habit', 'Overstimulated', 'Sleep_Quality'
    ]
    quantitative_cols = [col for col in data_frame.columns if col not in categorical_cols + ['ID']]

    print("\n=== настройка пользовательского графика ===")
    print("типы графиков: bar, histogram, boxplot, scatter")
    print("введите 'exit' чтобы завершить")

    print("\nдоступные столбцы: ")
    print(f"\nкатегориальные атрибуты: {categorical_cols}")
    print(f"\nколичественные атрибуты: {quantitative_cols}")

    while True:
        chart_type = input("\nвыберите тип графика: ").strip().lower()

        if chart_type == "bar":
            category1 = input("первый категориальный столбец: ")
            category2 = input("второй категориальный столбец: ")
            if category1 not in categorical_cols or category2 not in categorical_cols:
                print(f"пожалуйста, выберите столбцы из: {categorical_cols}")
                continue
            chart_name = input("имя файла (по умолчанию 'bar_chart.png'): ") or 'bar_chart.png'
            clustered_bar_chart(data_frame, category1, category2, output_file=chart_name)

        elif chart_type == "histogram":
            numeric_col = input("количественный столбец: ")
            category_col = input("категориальный столбец: ")
            if numeric_col not in quantitative_cols or category_col not in categorical_cols:
                print(f"пожалуйста, выберите столбцы из: {quantitative_cols} для числовых и "
      f"{categorical_cols} для категориальных.")
                continue
            chart_name = input("имя файла (по умолчанию 'histogram.png'): ") or 'histogram.png'
            categorized_histogram(data_frame, numeric_col, category_col, output_file=chart_name)

        elif chart_type == "boxplot":
            numeric_col = input("количественный столбец: ")
            category_col = input("категориальный столбец: ")
            if numeric_col not in quantitative_cols or category_col not in categorical_cols:
                print(f"пожалуйста, выберите столбцы из: {quantitative_cols} для числовых"
                      f"и {categorical_cols} для категориальных.")
                continue
            chart_name = input("имя файла (по умолчанию 'boxplot.png'): ") or 'boxplot.png'
            categorized_boxplot(data_frame, numeric_col, category_col, output_file=chart_name)

        elif chart_type == "scatter":
            x_col = input("числовой столбец X: ")
            y_col = input("числовой столбец Y: ")
            category_col = input("категориальный столбец: ")
            if (x_col not in quantitative_cols
                or y_col not in quantitative_cols
                or category_col not in categorical_cols):
                print(f"пожалуйста, выберите столбцы из: {quantitative_cols} "
                      f"для числовых и {categorical_cols} для категориальных.")
                continue
            chart_name = input("имя файла (по умолчанию 'scatter.png'): ") or 'scatter.png'
            categorized_scatter(data_frame, x_col, y_col, category_col, output_file=chart_name)

        elif chart_type == 'exit':
            break
        else:
            print("неверный тип графика, попробуйте снова.")


def main():
    """
    Основная функция выполнения, которая загружает данные, генерирует стандартные визуализации
    и предоставляет интерактивное создание графиков.
    """
    xls = pd.ExcelFile('excel_prototype.xlsx')
    person_df = pd.read_excel(xls, 'Person')
    psych_df = pd.read_excel(xls, 'Psychological Factors')
    phys_df = pd.read_excel(xls, 'Physical Factors')
    social_df = pd.read_excel(xls, 'Social And Working Factors')

    # объединение таблиц по ID
    data_frame = person_df.merge(psych_df, on='ID') \
        .merge(phys_df, on='ID') \
        .merge(social_df, on='ID')

    generate_default_graphs(data_frame)
    get_user_input(data_frame)


if __name__ == "__main__":
    main()
